import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuperheroDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'Spiderman',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'Peter Parker',
  })
  @IsString()
  @IsNotEmpty()
  realName: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example:
      'Bitten by a radioactive spider, Peter Parker gained spider-like abilities. He vowed to use his powers responsibly after the tragic death of his Uncle Ben, guided by the words: "With great power comes great responsibility."',
  })
  @IsString()
  @IsNotEmpty()
  originDespription: string;

  @ApiProperty({
    type: String,
    description:
      'Wall-crawling, enhanced agility and reflexes, superhuman strength, spider-sense, web-shooting via gadgets.',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  superpowers: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
    example: 'Your friendly neighborhood Spider-Man!',
  })
  @IsString()
  @IsNotEmpty()
  catchPhrase: string;

  @ApiProperty({
    format: 'binary',
    description: 'Upload one or more superhero images',
    required: false,
  })
  file: Express.Multer.File[];
}
