import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Prisma } from '@prisma/client';
import { CreateImageDto } from './dto/create-image.dto';
import { ImageDto } from './dto/image.dto';

@Injectable()
export class UploadImageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createImage(
    file: Express.Multer.File,
    superheroId: number,
  ): Promise<ImageDto> {
    const uploadResult = await this.cloudinaryService.uploadImage(file);
    const image = await this.prisma.image.create({
      data: {
        url: uploadResult.secure_url,
        superheroId,
      },
    });

    return {
      id: image.id,
      url: image.url,
      superheroId: image.superheroId,
      createdAt: image.createdAt,
    };
  }

  async getImagesBySuperhero(superheroId: number): Promise<ImageDto[]> {
    return this.prisma.image.findMany({ where: { superheroId } });
  }

  async deleteImage(imageId: number): Promise<void> {
    const image = await this.prisma.image.findUnique({
      where: { id: imageId },
    });
    if (!image) throw new Error('Image not found');

    await this.cloudinaryService.deleteImage(image.url);
    await this.prisma.image.delete({ where: { id: imageId } });
  }
}
