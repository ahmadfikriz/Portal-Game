import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  categories: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ format: 'binary' })
  @IsOptional()
  thumbnail: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  content: string;
}
