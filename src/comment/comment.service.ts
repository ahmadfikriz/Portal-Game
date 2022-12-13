import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from 'src/article/entities/article.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const user: any = await this.usersRepository.findOneOrFail({
      where: { id: createCommentDto.user_id },
    });
    const article: any = await this.articleRepository.findOneOrFail({
      where: { id: createCommentDto.article_id },
    });

    const newComment = new Comment();

    newComment.user = user;
    newComment.article = article;
    newComment.comment = createCommentDto.comment;

    const result = await this.commentRepository.insert(newComment);

    return this.commentRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: ['user', 'article'],
    });
  }

  async reply(replyCommentDto: ReplyCommentDto) {
    const user_id: any = await this.usersRepository.findOneOrFail({
      where: { id: replyCommentDto.user_id },
    });
    const article_id: any = await this.articleRepository.findOneOrFail({
      where: { id: replyCommentDto.article_id },
    });
    const comment_id: any = await this.commentRepository.findOneOrFail({
      where: { id: replyCommentDto.comment_id },
    });

    const newComment = new Comment();

    newComment.user = user_id;
    newComment.article = article_id;
    newComment.comments = comment_id;
    newComment.comment = replyCommentDto.comment;

    const result = await this.commentRepository.insert(newComment);

    return this.commentRepository.findOneOrFail({
      where: {
        id: result.identifiers[0].id,
      },
      relations: ['user', 'article', 'comments'],
    });
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}