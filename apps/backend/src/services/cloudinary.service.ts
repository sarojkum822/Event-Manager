import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

/**
 * Upload image to Cloudinary
 * @param buffer - Image buffer from multer
 * @param folder - Cloudinary folder name
 * @returns Cloudinary upload result with secure URL
 */
export const uploadImage = async (
    buffer: Buffer,
    folder: string = 'event-planner'
): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 1200, height: 1200, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                } else {
                    reject(new Error('Upload failed'));
                }
            }
        );

        // Convert buffer to stream and pipe to Cloudinary
        const bufferStream = Readable.from(buffer);
        bufferStream.pipe(uploadStream);
    });
};

/**
 * Upload multiple images to Cloudinary
 * @param files - Array of multer files
 * @param folder - Cloudinary folder name
 * @returns Array of upload results
 */
export const uploadMultipleImages = async (
    files: Express.Multer.File[],
    folder: string = 'event-planner'
): Promise<Array<{ url: string; publicId: string }>> => {
    const uploadPromises = files.map((file) => uploadImage(file.buffer, folder));
    return Promise.all(uploadPromises);
};

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export const deleteImage = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};
