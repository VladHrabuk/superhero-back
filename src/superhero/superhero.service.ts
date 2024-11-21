import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSuperheroDto } from './dto/create-superhero.dto';
import { UpdateSuperheroDto } from './dto/update-superhero.dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadImageService } from 'src/upload-image/upload-image.service';

@Injectable()
export class SuperheroService {
  constructor(
    private readonly databaseService: PrismaService,
    private readonly uploadImageService: UploadImageService,
  ) {}

  async findAll(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const [superheroes, totalCount] = await Promise.all([
        this.databaseService.superhero.findMany({
          skip,
          take: limit,
          include: {
            images: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        }),
        this.databaseService.superhero.count(),
      ]);

      const hasMore = totalCount > page * limit;
      const nextPage = hasMore ? page + 1 : null;

      return {
        superheroes,
        totalCount,
        hasMore,
        nextPage,
      };
    } catch (error) {
      console.error('Error fetching superheroes:', error);
      throw new InternalServerErrorException('Could not fetch superheroes');
    }
  }

  async findOne(id: number) {
    try {
      const superhero = await this.databaseService.superhero.findUnique({
        where: {
          id,
        },
        include: {
          images: true,
        },
      });

      console.log(superhero);
      if (!superhero) {
        throw new NotFoundException(`Superhero with id ${id} not found`);
      }
      return superhero;
    } catch (error) {
      console.error('Database error:', error);
      throw new InternalServerErrorException(
        'Could not retrieve superhero data',
      );
    }
  }

  async create(
    createSuperheroDto: CreateSuperheroDto,
    files: Express.Multer.File[],
  ) {
    try {
      const superhero = await this.databaseService.superhero.create({
        data: {
          ...createSuperheroDto,
        },
      });

      if (files?.length) {
        for (const file of files) {
          await this.uploadImageService.createImage(file, superhero.id);
        }
      }

      return superhero;
    } catch (error) {
      console.error('Database error:', error);

      if (error.code === 'P2002') {
        throw new HttpException(
          `Superhero with nickname "${createSuperheroDto.nickname}" or realname "${createSuperheroDto.realName}" already exists.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new InternalServerErrorException(
        'Could not create superhero. Please try again later.',
      );
    }
  }

  async update(
    id: number,
    updateSuperheroDto: UpdateSuperheroDto,
    files: Express.Multer.File[],
    imageIdsToDelete: number[],
  ) {
    console.log(updateSuperheroDto);
    console.log(files);
    const superhero = await this.databaseService.superhero.findUnique({
      where: { id },
    });

    if (!superhero) {
      throw new HttpException('Superhero not found', HttpStatus.NOT_FOUND);
    }

    if (imageIdsToDelete?.length) {
      console.log(imageIdsToDelete, 'imagesToDelete');
      for (const imageId of imageIdsToDelete) {
        await this.uploadImageService.deleteImage(imageId);
      }
    }

    const { imageIdsToDelete: _, ...data } = updateSuperheroDto;

    const updatedSuperhero = await this.databaseService.superhero.update({
      where: { id },
      data,
    });

    if (files?.length) {
      for (const file of files) {
        await this.uploadImageService.createImage(file, updatedSuperhero.id);
      }
    }

    return updatedSuperhero;
  }

  async remove(id: number) {
    const superhero = await this.databaseService.superhero.findUnique({
      where: { id },
    });

    if (!superhero) {
      throw new HttpException('Superhero not found', HttpStatus.NOT_FOUND);
    }

    const images = await this.uploadImageService.getImagesBySuperhero(id);
    for (const image of images) {
      await this.uploadImageService.deleteImage(image.id);
    }

    return this.databaseService.superhero.delete({
      where: { id },
    });
  }
}
