import multer from "multer";
import path from "node:path";
import cloudinary from "../config/cloudinary.js";

const storage = multer.memoryStorage();

const allowedExtensions = new Set([
  ".jpeg",
  ".jpg",
  ".png",
  ".gif",
  ".avif",
  ".webp",
]);

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/avif",
  "image/webp",
]);

const fileValidation = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  const validExtension = allowedExtensions.has(extension);
  const validMimeType = allowedMimeTypes.has(file.mimetype);

  if (validExtension && validMimeType) {
    return cb(null, true);
  }

  const error = new Error(
    "Only JPEG, PNG, GIF, AVIF, and WebP images are allowed",
  );

  error.status = 400;

  return cb(error);
};

const upload = multer({
  storage,
  fileFilter: fileValidation,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
    fields: 20,
    parts: 25,
    fieldNameSize: 100,
    fieldSize: 100 * 1024,
  },
});

const uploadBuffer = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Cloudinary returned no upload result"));
        }

        return resolve(result);
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
      if (req.files?.length) {
        await Promise.all(
          req.files.map(async (file) => {
            const result = await uploadBuffer(file.buffer, folder);

            file.cloudinaryUrl = result.secure_url;
            file.cloudinaryPublicId = result.public_id;
          }),
        );
      }

      return next();
    } catch (error) {
      const uploadError = new Error("Image upload failed", {
        cause: error,
      });

      uploadError.status = 502;

      return next(uploadError);
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
