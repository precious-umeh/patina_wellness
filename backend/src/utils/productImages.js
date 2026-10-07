import { deleteFromCloudinary } from "../middlewares/fileUpload.js";

export function buildProductImages(files = []) {
  return files.map((file) => ({
    url: file.cloudinaryUrl,
    publicId: file.cloudinaryPublicId,
  }));
}

export async function cleanupUploadedImages(files = []) {
  const uploadedFiles = files.filter((file) => file.cloudinaryPublicId);

  await Promise.all(
    uploadedFiles.map((file) => deleteFromCloudinary(file.cloudinaryPublicId)),
  );
}

export async function cleanupProductImages(images = []) {
  const publicIds = images.map((image) => image.publicId).filter(Boolean);

  await Promise.all(
    publicIds.map((publicId) => deleteFromCloudinary(publicId)),
  );
}
