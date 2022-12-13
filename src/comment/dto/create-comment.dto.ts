import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  article_id: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  comment: string;
}
