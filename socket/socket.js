const Message = require("../models/chat/message.model.js");
const Conversation = require("../models/chat/conversation.model.js");

const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket.IO integration
io.use((socket, next) => {
  const token =
    socket.handshake.auth.token ||
    socket.handshake.headers.authorization?.split(" ")[1] ||
    socket.handshake.query.token;

  if (!token)
    return next(new Error("Authentication error: No token provided!"));

  jwt.verify(token, "ddkdkdk", (err, decoded) => {
    if (err) return next(new Error("Authentication error: Invalid token"));
    socket.decoded = decoded;
    next();
  });
});

io.on("connection", async (socket) => {
  const userId = socket.decoded.userId;

  // Fetch user's conversations and join respective rooms
  socket.on("getChatList", () => {
    try {
      Conversation.find({
        participants: { $all: [userId] },
      })
        .then((conversations) => {
          conversations.forEach((conversation) => {
            socket.join(conversation._id.toString());
            socket.broadcast
              .to(conversation._id.toString())
              .emit("userStatus", { userId, status: "online" });
          });

          socket.emit("chatlist", conversations);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  });

  // Get chat by id
  socket.on("getChat", async (chatId) => {
    Conversation.findOne({
      _id: chatId,
    }).then((conversation) => {
      socket.emit("retrievedChat", conversation);
    });
  });

  // Broadcast to other users in the same conversation when a new message is sent
  socket.on("sendMessage", async (senderId, receiverId, message) => {
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });

        // do here
        socket.join(conversation._id.toString());
        // do here
        await conversation.save();
        Conversation.findOne({
          _id: conversation._id,
        }).then((conversation) => {
          socket.emit("newChat", conversation);
        });
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        message,
        conversation: conversation._id,
      });
      await newMessage.save();

      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }

      await Promise.all([conversation.save(), newMessage.save()]);

      io.to(conversation._id.toString()).emit(
        "newMessage",
        newMessage,
        conversation._id
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Fetch previous messages when a user joins a conversation
  socket.on("joinConversation", async (conversationId) => {
    try {
      socket.join(conversationId);
      const messages = await Message.find({
        conversation: conversationId,
      }).sort({
        createdAt: 1,
      });
      socket.emit("previousMessages", messages);
    } catch (error) {
      console.error("Error joining conversation:", error);
    }
  });

  // Listen for typing indicator
  socket.on("typing", ({ conversationId, isTyping }) => {
    socket.to(conversationId).emit("typingIndicator", { userId, isTyping });
  });

  socket.on("disconnect", async () => {
    try {
      const conversations = await Conversation.find({
        participants: { $all: [userId] },
      });
      conversations.forEach((conversation) => {
        socket.leave(conversation._id);
        socket.broadcast
          .to(conversation._id)
          .emit("userStatus", { userId, status: "offline" });
      });
    } catch (error) {
      console.error("Error handling disconnect:", error);
    }
  });
});

module.exports = {
  app,
  io,
  server,
};
