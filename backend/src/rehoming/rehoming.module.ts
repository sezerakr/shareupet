import { Module } from '@nestjs/common';
import { RehomingService } from './rehoming.service';
import { RehomingController } from './rehoming.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rehoming } from './entities/rehoming.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rehoming])],
  providers: [RehomingService],
  controllers: [RehomingController],
  exports: [RehomingService],
})
export class RehomingModule {}
