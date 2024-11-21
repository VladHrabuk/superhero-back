import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

const imgParams = {
  dimensions: {
    width: 400,
    height: 600,
  },
  maxFileSize: 100000,
  acceptableFileTypes: ['jpg', 'jpeg', 'png', 'webp'],
};

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: 'superhero',
          allowed_formats: imgParams.acceptableFileTypes,
          transformation: [
            {
              width: imgParams.dimensions.width,
              height: imgParams.dimensions.height,
              crop: 'fill',
            },
          ],
          bytes: imgParams.maxFileSize,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const urlParts = imageUrl.split('/');
    const fileNameWithExtension = urlParts.pop();
    const publicId =
      urlParts.slice(urlParts.indexOf('superhero')).join('/') +
      '/' +
      fileNameWithExtension.split('.')[0];

    try {
      const result = await v2.uploader.destroy(publicId);
      console.log('Cloudinary response:', result);

      if (result.result !== 'ok') {
        throw new Error(`Image deletion failed: ${result.result}`);
      }

      console.log('Image successfully deleted from Cloudinary');
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }
}
