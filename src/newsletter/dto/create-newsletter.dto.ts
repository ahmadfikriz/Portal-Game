import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateNewsletterDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  email: string;
}
