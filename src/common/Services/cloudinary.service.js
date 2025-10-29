import { v2 as cloudV2 } from "cloudinary";

// ==============================> config cloudinary <=======================================

cloudV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==============================> upload File <=======================================
export const uploadFileOnCloudinary = async (file,options={}) => {
  const result = await cloudV2.uploader.upload(file,options);
  return result;
};
// ==============================> Upload Many Files <======================================= 
export const uploadManyFilesOnCloudinary = async (files,options={}) => {
  const result = await cloudV2.uploader.upload_batch(files,options);
  return result;
};
// ==============================> Delete File <=======================================
export const deleteFileOnCloudinary = async (public_id) => {
  const result = await cloudV2.uploader.destroy(public_id);
  return result;
};
// ==============================> Delete Many Files <======================================= 
export const deleteManyFilesOnCloudinary = async (public_ids) => {
  const result = await cloudV2.api.delete_resources(public_ids);
  return result;
};
// ==============================> Clean up Folder <=======================================
export const cleanUpFolderOnCloudinary = async (folder) => {
  const result = await cloudV2.api.delete_resources_by_prefix(folder);
  return result;
};
// ==============================> Delete Folder <=======================================
export const deleteFolderOnCloudinary = async (folder) => {
cleanUpFolderOnCloudinary(folder);
const result = await cloudV2.api.delete_folder(folder);
  return result;
};


