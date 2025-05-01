import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedsService } from './breeds.service';
import { BreedsController } from './breeds.controller';
import { Breed } from './entities/breed.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Breed]), UsersModule],
  controllers: [BreedsController],
  providers: [BreedsService],
  exports: [BreedsService]
})
export class BreedsModule { }