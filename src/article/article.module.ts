import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './entities/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { UsersModule } from 'src/user/users.module';
import { CategoryModule } from 'src/category/category.module';
import { Newsletter } from 'src/newsletter/entities/newsletter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, User, Category, Newsletter]),
    UsersModule,
    CategoryModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
