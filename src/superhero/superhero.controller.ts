import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseInterceptors,
  UsePipes,
  UploadedFiles,
  Query,
  DefaultValuePipe,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { SuperheroService } from './superhero.service';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { Prisma } from '@prisma/client';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('superheros')
export class SuperheroController {
  constructor(private readonly superheroService: SuperheroService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit = 5,
  ) {
    return this.superheroService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.superheroService.findOne(id);
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nickname: { type: 'string' },
        realName: { type: 'string' },
        originDespription: { type: 'string' },
        superpowers: { type: 'string' },
        catchPhrase: { type: 'string' },
        images: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  async createSuperhero(
    @Body() createSuperheroDto: CreateSuperheroDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    return this.superheroService.create(createSuperheroDto, files);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nickname: { type: 'string' },
        realName: { type: 'string' },
        originDespription: { type: 'string' },
        superpowers: { type: 'string' },
        catchPhrase: { type: 'string' },
        images: { type: 'string', format: 'binary' },
        imageIdsToDelete: {
          type: 'string',
          description: 'Array of image IDs to delete, as a JSON string',
          example: '[46, 47]',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('images'))
  async updateSuperhero(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSuperheroDto: UpdateSuperheroDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('imageIdsToDelete') imageIdsToDelete: string,
  ) {
    console.log(typeof imageIdsToDelete);
    console.log(imageIdsToDelete, 'imagesIdsToDelete');
    const parsedImageIdsToDelete: number[] = imageIdsToDelete
      ? JSON.parse(imageIdsToDelete)
      : [];

    return this.superheroService.update(
      id,
      updateSuperheroDto,
      files,
      parsedImageIdsToDelete,
    );
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.superheroService.remove(id);
  }
}
