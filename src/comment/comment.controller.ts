import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    try {
      return {
        data: await this.commentService.create(createCommentDto),
        statusCode: 200,
        message: 'berhasil',
      };
    } catch (error) {
      return {
        message: 'error',
        error,
      };
    }
  }

  @Post('reply')
  async reply(@Body() replyCommentDto: ReplyCommentDto) {
    try {
      return {
        data: await this.commentService.reply(replyCommentDto),
        statusCode: 200,
        message: 'berhasil',
      };
    } catch (error) {
      return {
        message: 'error',
        error,
      };
    }
  }

  @Get()
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
