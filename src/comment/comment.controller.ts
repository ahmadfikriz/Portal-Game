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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
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
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Request() user: User,
  ) {
    // console.log('user:', user);
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
  @UseGuards(AuthGuard('jwt'))
  async reply(@Body() replyCommentDto: ReplyCommentDto, @Request() user: User) {
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
