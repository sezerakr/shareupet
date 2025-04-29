import { Module } from '@nestjs/common';
import { NovelsService } from './novels.service';
import { NovelsController } from './novels.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  controllers: [NovelsController],
  providers: [NovelsService, { provide: APP_GUARD, useClass: JwtAuthGuard, }],
})
export class NovelsModule { }
