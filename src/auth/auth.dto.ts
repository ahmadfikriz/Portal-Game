/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password: string;
}
