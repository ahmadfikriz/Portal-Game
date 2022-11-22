import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { Level } from './entities/level.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Level])],
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService],
})
export class LevelModule {}
