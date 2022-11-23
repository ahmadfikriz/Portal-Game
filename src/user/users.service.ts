/* eslint-disable no-return-await */
/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelService } from 'src/level/level.service';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private levelService: LevelService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new User();

    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;
    newUser.level = await this.levelService.findByLevel(createUserDto.levels);

    const result = await this.usersRepository.insert(newUser);

    return this.usersRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: ['level'],
    });
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    const query = this.usersRepository.createQueryBuilder('user')
    .innerJoinAndSelect('user.level', 'name')
    .orderBy('user.username', 'ASC');

    return paginate<User>(query, options);
  }

  async findUsername(
    options: IPaginationOptions,
    search: string,
    ): Promise<Pagination<User>> {
      const query = this.usersRepository.createQueryBuilder('user')
      .innerJoinAndSelect('user.level', 'level')
      .orderBy('user.username', 'ASC');

      if (search) {
 (
        query
          .where('user.username LIKE :search', {search: `%${search}%`})
          .orWhere('level.name LIKE :search', {search: `%${search}%`})
      );
} else {
 (
        query.getMany()
      );
}

;
      await query.getMany();

      return paginate<User>(query, options);
    }

  async findById(id: string) {
    try {
      return await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
        relations: ['level'],
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.usersRepository.update(id, updateUserDto);

    return this.usersRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    try {
      await this.usersRepository.findOneOrFail({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.usersRepository.delete(id);
  }

  hash(plainPassword) {
    const hash = bcrypt.hashSync(plainPassword, 20);

    return hash;
  }

  compare(plainPassword, hash) {
    const valid = bcrypt.compare(plainPassword, hash);

    return valid;
  }

async findByUsername(username: string) {
  try {
    return await this.usersRepository.findOneOrFail({
      where: {
        username,
      },
    });
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Data not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
}
