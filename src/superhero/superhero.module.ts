import { Module } from '@nestjs/common';
import { SuperheroService } from './superhero.service';
import { SuperheroController } from './superhero.controller';
import { UploadImageModule } from 'src/upload-image/upload-image.module';

@Module({
  controllers: [SuperheroController],
  providers: [SuperheroService],
  imports: [UploadImageModule],
})
export class SuperheroModule {}
