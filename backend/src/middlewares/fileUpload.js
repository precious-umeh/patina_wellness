import multer from "multer";
import path from "path";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();

const fileValidation = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|avif|webp/;

  const extensionName = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  const mimeType = allowedFileTypes.test(file.mimetype);

  if (extensionName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new Error("Only jpeg, jpg, png, gif, avif, and webp files are allowed"),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter: fileValidation,
});

const uploadBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      },
    );

    stream.end(buffer);
  });
};

export const uploadToCloudinary = (folder) => {
  return async (req, res, next) => {
    try {
      // Single file
      if (req.file) {
        const result = await uploadBuffer(req.file.buffer, folder);

        req.file.cloudinaryUrl = result.secure_url;
        req.file.cloudinaryPublicId = result.public_id;
      }

      // Multiple files
      if (req.files && req.files.length > 0) {
        await Promise.all(
          req.files.map(async (file) => {
            const result = await uploadBuffer(file.buffer, folder);

            file.cloudinaryUrl = result.secure_url;
            file.cloudinaryPublicId = result.public_id;
          }),
        );
      }

      next();
    } catch (error) {
      return res.status(500).json({
        message: "Image upload failed",
        error: error.message,
      });
    }
  };
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) return;

    await cloudinary.uploader.destroy(publicId);

    console.log(`Successfully deleted from Cloudinary: ${publicId}`);
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error.message);
  }
};

export default upload;
