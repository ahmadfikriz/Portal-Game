import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  article_id: string;
}
