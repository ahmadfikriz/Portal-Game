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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return {
      data: await this.articleService.create(createArticleDto),
      statusCode: HttpStatus.CREATED,
      message: 'success',
    };
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Article>> {
    limit = limit > 100 ? 100 : limit;

    return this.articleService.findAll({
      page,
      limit,
      route: 'http://localhost:3222/article',
    });
  }

  @Get('search')
  async findArticle(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('search') search: string,
  ): Promise<Pagination<Article>> {
    limit = limit > 100 ? 100 : limit;

    return this.articleService.findArticle(
      {
        page,
        limit,
        route: 'http://localhost:3222/article/search',
      },
      search,
    );
  }

  @Get('article/:id')
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

  @Delete('article/:id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.articleService.remove(id);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
    };
  }
}
