/* eslint-disable no-param-reassign */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return {
      data: await this.usersService.create(createUserDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Get('getall')
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;

    return this.usersService.findAll({
      page,
      limit,
      route: 'http://localhost:3222/user',
    });
  }

  @Get('search')
  async findUsername(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search: string,
  ): Promise<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;

    return this.usersService.findUsername(
      {
        page,
        limit,
        route: 'http://localhost:3222/user/search',
      },
      search,
    );
  }

  @Get('get/:id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.usersService.findById(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put('update/:id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return {
      data: await this.usersService.update(id, updateUserDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete('delete/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
