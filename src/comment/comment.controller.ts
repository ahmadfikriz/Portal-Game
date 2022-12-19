import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ReplyCommentDto } from './dto/reply-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const user = req.user;
    console.log('user:', user);
    try {
      return {
        data: await this.commentService.create(createCommentDto, user),
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
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async reply(@Body() replyCommentDto: ReplyCommentDto, @Request() req) {
    const user = req.user;
    try {
      return {
        data: await this.commentService.reply(replyCommentDto, user),
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
