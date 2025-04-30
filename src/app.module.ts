import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PetsModule } from './pets/pets.module';
import { BreedsModule } from './breeds/breeds.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Breed } from './breeds/entities/breed.entity';
import { Pet } from './pets/entities/pet.entity';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/app-config.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesPermissionsGuard } from './core/guards/roles-permissions.guard';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (appConfigService: AppConfigService) => ({
        type: 'postgres',
        host: appConfigService.database.host,
        port: appConfigService.database.port,
        username: appConfigService.database.username,
        password: appConfigService.database.password,
        database: appConfigService.database.name,
        entities: [User, Pet, Breed],
        synchronize: true,
      }),
      inject: [AppConfigService],
    }),
    AuthModule, UsersModule, PetsModule, BreedsModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesPermissionsGuard,
    },
  ],
})
export class AppModule { }
