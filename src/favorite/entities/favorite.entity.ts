import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import { PrimaryGeneratedColumn, ManyToOne, Entity } from 'typeorm';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(
    () => {
      return User;
    },
    (user) => {
      return user.favoriteArticles;
    },
  )
  user: User;

  @ManyToOne(
    () => {
      return Article;
    },
    (article) => {
      return article.favoriteArticles;
    },
  )
  article: Article[];
}
