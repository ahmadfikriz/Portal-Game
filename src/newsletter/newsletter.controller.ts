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
// import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { string } from 'joi';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { NewsletterService } from './newsletter.service';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(
    private readonly newsletterService: NewsletterService,
    private mailService: MailerService,
  ) {}

  @Get()
  async newsletter(@Query('email') email) {
    await this.mailService.sendMail({
      to: email,
      from: 'afz55.lovers@gmail.com',
      subject: 'Newsletter',
      text: 'Welcome',
    });
    return 'success';
  }

  // @Post()
  // async newsletter(@Body() data: any): Promise<void> {
  //   await this.newsletterService.newsletter(data.email);
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
