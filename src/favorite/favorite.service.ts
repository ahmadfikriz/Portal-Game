import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async addToFavorites(createFavoriteDto: CreateFavoriteDto, userLogin: User) {
    const user = await this.usersRepository.findOne({
      where: { id: userLogin.id },
    });
    console.log('user:', user);
    const article: any = await this.articleRepository.findOneOrFail({
      where: { id: createFavoriteDto.article_id },
    });
    const favoriteArticle = new Favorite();

    favoriteArticle.user = user;
    favoriteArticle.article = article;
    const result = await this.favoriteRepository.save(favoriteArticle);

    return this.favoriteRepository.findOneOrFail({
      where: {
        id: result.id,
      },
      relations: ['user', 'article'],
    });
  }

  findAll() {
    return `This action returns all favorite`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favorite`;
  }

  update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    return `This action updates a #${id} favorite`;
  }

  remove(id: number) {
    return `This action removes a #${id} favorite`;
  }
}
