/* eslint-disable prettier/prettier */
import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';
import { Newsletter } from 'src/newsletter/entities/newsletter.entity';
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
    @InjectRepository(Newsletter)
    private newsletterRepository: Repository<Newsletter>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private categoryService: CategoryService,
    private mailService: MailerService,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const newArticle = new Article();

    newArticle.title = createArticleDto.title;
    newArticle.thumbnail = createArticleDto.thumbnail;
    newArticle.content = createArticleDto.content;
    newArticle.user = await this.usersService.findByUsername(createArticleDto.username);
    newArticle.category = await this.categoryService.findByCategory(createArticleDto.categories);

    const result = await this.articleRepository.insert(newArticle);

    const emails = await this.newsletterRepository.find({ select: ['email'] });

    for (const email of emails) {
      await this.mailService.sendMail({
        to: email.email,
        from: 'afz55.lovers@gmail.com',
        subject: 'Newsletter',
        text: 'Pemberitahuan Artikel Baru',
      });
    }

    return this.articleRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
relations: ['user', 'category'],
    });
  }

  async findAll(options: IPaginationOptions): Promise<Pagination<Article>> {
    const query = this.articleRepository.createQueryBuilder('article')
    .innerJoinAndSelect('article.user', 'user')
    .innerJoinAndSelect('article.category', 'category')
    .orderBy('article.title', 'ASC');

    return paginate<Article>(query, options);
  }

  async findArticle(options: IPaginationOptions, search: string,): Promise<Pagination<Article>> {
    const query = this.articleRepository.createQueryBuilder('article')
    .innerJoinAndSelect('article.user', 'user')
    .innerJoinAndSelect('article.category', 'category')
    .orderBy('article.title', 'ASC');

    if (search) {
 (
      query
        .where('article.title LIKE :search', {search: `%${search}%`})
        .orWhere('user.username LIKE :search', {search: `%${search}%`})
        .orWhere('category.name LIKE :search', {search: `%${search}%`})
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

  async recommendation(options: IPaginationOptions): Promise<Pagination<Article>> {
    const query = this.articleRepository.createQueryBuilder('article')
    .innerJoinAndSelect('article.user', 'user')
    .innerJoinAndSelect('article.category', 'category')
    .orderBy('article.viewers', 'DESC');

    return paginate<Article>(query, options);
  }

  async findById(id: string) {
    try {
      return await this.articleRepository.findOneOrFail({
        where: {
          id,
        },
        relations: ['user', 'category'],
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

  async viewArticle(id: string): Promise<Article> {
    // mengambil artikel yang akan dilihat
    const article = await this.articleRepository.findOne({ where: { id } });

    // menambahkan 1 pada jumlah pengunjung
    article.viewers++;

    // menyimpan perubahan ke dalam database
    await this.articleRepository.save(article);

    return article;
  }
}
