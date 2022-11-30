/* eslint-disable no-param-reassign */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Pagination } from 'nestjs-typeorm-paginate';
import { extname } from 'path';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCategoryDto })
  @UseInterceptors(
    FileInterceptor('icon', {
      storage: diskStorage({
        destination: './uploads/icon',
        filename: (req: any, file, icon) => {
          const fileName = [req.user.id, Date.now()].join('-');

          icon(null, fileName + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() icon: Express.Multer.File,
  ) {
    createCategoryDto.icon = icon.filename;

    return {
      data: await this.categoryService.create(createCategoryDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  // @Post()
  // async create(@Body() createCategoryDto: CreateCategoryDto) {
  //   return {
  //     data: await this.categoryService.create(createCategoryDto),
  //     statusCode: HttpStatus.CREATED,
  //     message: 'success',
  //   };
  // }

  // @Get()
  // async findAll() {
  //   const [data, count] = await this.categoryService.findAll();

  //   return {
  //     data,
  //     count,
  //     statusCode: HttpStatus.OK,
  //     message: 'success',
  //   };
  // }

  @Get()
  async findCategory(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search: string,
  ): Promise<Pagination<Category>> {
    limit = limit > 100 ? 100 : limit;

    return (
      this.categoryService.findCategory(
        {
          page,
          limit,
          route: 'http://localhost:3222/category',
        },
        search,
      ) ||
      this.categoryService.findAll({
        page,
        limit,
        route: 'http://localhost:3222/category',
      })
    );
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.categoryService.findById(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return {
      data: await this.categoryService.update(id, updateCategoryDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.categoryService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
