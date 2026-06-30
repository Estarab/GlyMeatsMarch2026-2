import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/**
 * Upload one image
 */

export const uploadImage = (buffer, folder = "products") => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {
                folder,
                resource_type: "image",
            },

            (error, result) => {

                if (error) return reject(error);

                resolve({
                    url: result.secure_url,
                    public_id: result.public_id,
                });

            }

        );

        streamifier.createReadStream(buffer).pipe(stream);

    });

};

/**
 * Upload multiple images
 */

export const uploadMultipleImages = async (
    files,
    folder = "products"
) => {

    const images = [];

    if (!files || files.length === 0) return images;

    for (const file of files) {

        const uploaded = await uploadImage(file.buffer, folder);

        images.push(uploaded);

    }

    return images;

};

/**
 * Delete one image
 */

export const deleteImage = async (public_id) => {

    return await cloudinary.uploader.destroy(public_id);

};

/**
 * Delete multiple images
 */

export const deleteMultipleImages = async (images = []) => {

    for (const image of images) {

        if (image.public_id) {

            await deleteImage(image.public_id);

        }

    }

};