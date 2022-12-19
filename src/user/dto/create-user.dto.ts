import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  levels: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  password: string;
}
