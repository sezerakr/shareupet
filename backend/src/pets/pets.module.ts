import { Module } from '@nestjs/common';
import { PetsService } from './pets.service';
import { PetsController } from './pets.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pet } from './entities/pet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet])
  ],
  controllers: [PetsController],
  providers: [PetsService, { provide: APP_GUARD, useClass: JwtAuthGuard, }],
})
export class PetsModule { }
