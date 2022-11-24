import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username, password) {
    const user = await this.usersService.validateUser(username);

    if (user) {
      const valid = await this.usersService.compare(password, user.password);

      if (valid) {
        return user;
      }

      throw new BadRequestException({ message: 'Password Salah' });
    } else {
      throw new BadRequestException({ message: 'Email Tidak Ditemukan' });
    }
  }

  generateToken(user: User) {
    const dataToken = {
      userID: user.id,
      username: user.username,
      levelID: user.level.id,
      levelname: user.level.name,
    };
    const token = this.jwtService.sign(dataToken);

    return { token: token };
  }
}
