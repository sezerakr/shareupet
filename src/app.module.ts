import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NovelsModule } from './novels/novels.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PetsModule } from './pets/pets.module';
import { BreedsModule } from './breeds/breeds.module';
import { PetsModule } from './pets/pets.module';

@Module({
  imports: [NovelsModule, AuthModule, UsersModule, PetsModule, BreedsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
