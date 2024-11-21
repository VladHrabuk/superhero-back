import { PartialType } from '@nestjs/mapped-types';
import { CreateSuperheroDto } from './create-superhero.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSuperheroDto extends PartialType(CreateSuperheroDto) {
  imageIdsToDelete: string;
}
