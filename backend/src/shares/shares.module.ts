import { Module } from '@nestjs/common';
import { SharesService } from './shares.service';
import { SharesController } from './shares.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Share } from './entities/share.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Share])],
  providers: [SharesService],
  controllers: [SharesController],
  exports: [SharesService],
})
export class SharesModule {}
