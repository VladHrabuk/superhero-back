import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadImageController {
  constructor(private readonly uploadImageService: UploadImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /(image\/jpeg|image\/jpg|image\/png|image\/webp)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body('superheroId') superheroId: number,
  ) {
    if (!superheroId) {
      throw new Error('Superhero ID is required');
    }

    const uploadedImage = await this.uploadImageService.createImage(
      file,
      superheroId,
    );
    return { message: 'Image uploaded successfully', data: uploadedImage };
  }

  @Get(':superheroId')
  async getImagesBySuperhero(
    @Param('superheroId', ParseIntPipe) superheroId: number,
  ) {
    const images =
      await this.uploadImageService.getImagesBySuperhero(superheroId);
    return { message: 'Images fetched successfully', data: images };
  }

  @Delete(':imageId')
  async deleteImage(@Param('imageId', ParseIntPipe) imageId: number) {
    await this.uploadImageService.deleteImage(imageId);
    return { message: 'Image deleted successfully' };
  }
}
