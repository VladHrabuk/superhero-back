import { Module } from '@nestjs/common';
import { UploadImageService } from './upload-image.service';
import { UploadImageController } from './upload-image.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [UploadImageController],
  providers: [UploadImageService],
  exports: [UploadImageService],
  imports: [CloudinaryModule],
})
export class UploadImageModule {}
