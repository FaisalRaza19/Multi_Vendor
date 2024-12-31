import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: "faisalraza",
    api_key: "615757737347819",
    api_secret: "YGm49A7doHVOqM0YYL-P2lgkcDI",
});

export const fileUploadOnCloudinary = async (filePath, folder) => {
    try {
        if (!filePath) return null;
        const uploadFile = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            resource_type : 'image',
        });

        fs.unlinkSync(filePath);
        return uploadFile;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        fs.unlinkSync(filePath)
    }
};

export const removeFileFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok') {
            throw new Error(`Failed to delete image with publicId: ${publicId}`);
        }
        return result;
    } catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        throw new Error('Error deleting file from Cloudinary');
    }
};
