/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { UsersService } from 'src/user/users.service';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { Article } from './entities/article.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private usersService: UsersService,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private categoryService: CategoryService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const newArticle = new Article();

    newArticle.title = createArticleDto.title;
    newArticle.thumbnail = createArticleDto.thumbnail;
    newArticle.content = createArticleDto.content;
    newArticle.user = await this.usersService.findByUsername(createArticleDto.username);
    newArticle.category = await this.categoryService.findByCategory(createArticleDto.categories);

    const result = await this.articleRepository.insert(newArticle);

    return this.articleRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
relations: ['user', 'category'],
    });
  }

  findAll(options: IPaginationOptions): Promise<Pagination<Article>> {
    const query = this.articleRepository.createQueryBuilder('Article')
    .innerJoinAndSelect('Article.user', 'user')
    .innerJoinAndSelect('Article.category', 'category')
    .orderBy('Article.title', 'ASC');

    return paginate<Article>(query, options);
  }

  async findArticle(options: IPaginationOptions, search: string,): Promise<Pagination<Article>> {
    const query = this.articleRepository.createQueryBuilder('Article')
    .innerJoinAndSelect('Article.user', 'user')
    .innerJoinAndSelect('Article.category', 'category')
    .orderBy('Article.title', 'ASC');

    if (search) {
 (
      query
        .where('Article.title LIKE :search', {search: `%${search}%`})
        .orWhere('Article.user LIKE :search', {search: `%${search}%`})
        .orWhere('Article.category LIKE :search', {search: `%${search}%`})
    );
} else {
 (
      query.getMany()
    );
}

;
    await query.getMany();

    return paginate<Article>(query, options);
  }

  async findById(id: string) {
    try {
      return await this.articleRepository.findOneOrFail({
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
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    try {
      await this.articleRepository.findOneOrFail({
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

    await this.articleRepository.update(id, updateArticleDto);

    return this.articleRepository.findOneOrFail({
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    try {
      await this.articleRepository.findOneOrFail({
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

    await this.articleRepository.delete(id);
  }
}
