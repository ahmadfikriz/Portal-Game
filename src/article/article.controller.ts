/* eslint-disable no-param-reassign */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  DefaultValuePipe,
  HttpStatus,
  ParseIntPipe,
  Query,
  ParseUUIDPipe,
  Put,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Pagination } from 'nestjs-typeorm-paginate';
import { extname } from 'path';
import { JwtGuard } from 'src/auth/jwt.guard';
import { User } from 'src/user/entities/user.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateArticleDto })
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: diskStorage({
        destination: './file',
        filename: (req: any, file, thumbnail) => {
          const fileName = [req.user.id, Date.now()].join('-');

          thumbnail(null, fileName + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() createArticleDto: CreateArticleDto,
    @Req() user: User,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    createArticleDto.thumbnail = thumbnail.filename;

    return {
      data: await this.articleService.create(createArticleDto, user),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  // @Post()
  // async create(@Body() createArticleDto: CreateArticleDto) {
  //   return {
  //     data: await this.articleService.create(createArticleDto),
  //     statusCode: HttpStatus.CREATED,
  //     message: 'success',
  //   };
  // }

  // @Get()
  // async findAll(
  //   @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  //   @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  // ): Promise<Pagination<Article>> {
  //   limit = limit > 100 ? 100 : limit;

  //   return this.articleService.findAll({
  //     page,
  //     limit,
  //     route: 'http://localhost:3222/article',
  //   });
  // }
  @Get()
  async findArticle(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search: string,
  ): Promise<Pagination<Article>> {
    limit = limit > 100 ? 100 : limit;

    return (
      this.articleService.findArticle(
        {
          page,
          limit,
          route: 'http://localhost:3222/article',
        },
        search,
      ) ||
      this.articleService.findAll({
        page,
        limit,
        route: 'http://localhost:3222/article',
      })
    );
  }

  @Get('recommendation')
  async recommendation(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Article>> {
    limit = limit > 100 ? 100 : limit;

    return this.articleService.recommendation({
      page,
      limit,
      route: 'http://localhost:3222/article/recommendation',
    });
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string) {
    return {
      data: await this.articleService.findById(id),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return {
      data: await this.articleService.update(id, updateArticleDto),
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.articleService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }

  @Get('view/:id')
  async viewArticle(@Param('id') id: string): Promise<Article> {
    return this.articleService.viewArticle(id);
  }
}
