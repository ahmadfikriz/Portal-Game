import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { Level } from 'src/level/entities/level.entity';
import { Article } from 'src/article/entities/article.entity';
import { LevelModule } from 'src/level/level.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Level, Article]), LevelModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
