const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const ApiError = require("../utils/apiError");

// Configure Cloudinary
cloudinary.config({
  cloud_name: "darw3b55s",
  api_key: "839626653447746",
  api_secret: "Z4BM3iCLVWDpu4kFi8zMqfzIQJg",
});

const multerOptions = () => {
  const upload = multer({
    storage: multer.diskStorage({}), // Use disk storage (default)
    fileFilter: (req, file, cb) => {
      // Check file type
      if (!file.mimetype.startsWith("image")) {
        // console.log(req.file);
        return cb(new Error("Only image files are allowed!"), false);
      }
      cb(null, true);
    },
  });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);

// exports.resizeVideo = asyncHandler(async (req, res, next) => {
//   const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;

//   try {
//     if (!req.file) {
//       return next(new ApiError("No video file provided", 400));
//     }

//     const { originalname, buffer } = req.file;
//     const filename = `video-${uuidv4()}${originalname.substr(
//       originalname.lastIndexOf(".")
//     )}`;

//     // Upload the video file to Cloudinary
//     const result = await cloudinary.uploader
//       .upload_stream(
//         {
//           resource_type: "video",
//           public_id: `videos/${filename}`, // Store the video in a "videos" folder
//         },
//         (error, result) => {
//           if (error) {
//             return next(
//               new ApiError("Failed to upload video to Cloudinary", 500)
//             );
//           }
//           req.cloudinaryUrl = result.secure_url; // Save the Cloudinary URL for further processing
//           next();
//         }
//       )
//       .end(buffer);
//   } catch (error) {
//     next(error);
//   }
// });
