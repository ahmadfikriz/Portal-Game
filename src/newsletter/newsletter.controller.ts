import { MailerService } from '@nestjs-modules/mailer';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { NewsletterService } from './newsletter.service';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(
    private readonly newsletterService: NewsletterService,
    private mailService: MailerService,
  ) {}

  @Post()
  async newsletter(@Body() createNewsletterDto: CreateNewsletterDto) {
    try {
      return {
        data: await this.newsletterService.newsletter(createNewsletterDto),
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

  // @Get()
  // async newsletter(@Query('email') email) {
  //   await this.mailService.sendMail({
  //     to: email,
  //     from: 'afz55.lovers@gmail.com',
  //     subject: 'Newsletter',
  //     text: 'Welcome',
  //   });
  //   return 'success';
  // }

  @Get()
  findAll() {
    return this.newsletterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsletterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNewsletterDto: UpdateNewsletterDto,
  ) {
    return this.newsletterService.update(+id, updateNewsletterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsletterService.remove(+id);
  }
}
