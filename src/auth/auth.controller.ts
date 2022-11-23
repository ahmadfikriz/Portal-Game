import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards()
  validateUser(@Request() req) {
    return req.user;
  }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const user = await this.authService.validateUser(
      authDto.username,
      authDto.password,
    );

    return this.authService.generateToken(user);
  }
}
