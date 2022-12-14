import { MailerService } from '@nestjs-modules/mailer/dist';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { UpdateNewsletterDto } from './dto/update-newsletter.dto';
import { Newsletter } from './entities/newsletter.entity';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectRepository(Newsletter)
    private newsletterRepository: Repository<Newsletter>,
    private mailService: MailerService,
  ) {}

  async newsletter(createNewsletterDto: CreateNewsletterDto) {
    try {
      const newsletter = new Newsletter();

      newsletter.email = createNewsletterDto.email;

      const result = await this.newsletterRepository.insert(newsletter);

      await this.mailService.sendMail({
        to: createNewsletterDto.email,
        from: 'afz55.lovers@gmail.com',
        subject: 'Newsletter',
        text: 'Welcome',
      });

      return this.newsletterRepository.findOneOrFail({
        where: {
          id: result.identifiers[0].id,
        },
      });
    } catch (error) {
      // Tambahkan logika untuk menangani kesalahan di sini
    }
  }

  findAll() {
    return `This action returns all newsletter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} newsletter`;
  }

  update(id: number, updateNewsletterDto: UpdateNewsletterDto) {
    return `This action updates a #${id} newsletter`;
  }

  remove(id: number) {
    return `This action removes a #${id} newsletter`;
  }
}
