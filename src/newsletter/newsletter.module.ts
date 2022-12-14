import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { Newsletter } from './entities/newsletter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer/dist';

@Module({
  imports: [
    TypeOrmModule.forFeature([Newsletter]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
      },
    }),
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService],
  exports: [NewsletterService],
})
export class NewsletterModule {}
