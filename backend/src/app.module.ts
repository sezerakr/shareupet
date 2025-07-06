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
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { Like } from './likes/entities/like.entity';
import { Share } from './shares/entities/share.entity';
import { Rehoming } from './rehoming/entities/rehoming.entity';
import { Message } from './messaging/entities/message.entity';
import { Conversation } from './messaging/entities/conversation.entity';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { Like } from './likes/entities/like.entity';
import { Share } from './shares/entities/share.entity';
import { Rehoming } from './rehoming/entities/rehoming.entity';
import { Message } from './messaging/entities/message.entity';
import { Conversation } from './messaging/entities/conversation.entity';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/app-config.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesPermissionsGuard } from './core/guards/roles-permissions.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { SharesModule } from './shares/shares.module';
import { RehomingModule } from './rehoming/rehoming.module';
import { MessagingModule } from './messaging/messaging.module';
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
        entities: [
          User,
          Pet,
          Breed,
          Post,
          Comment,
          Like,
          Share,
          Rehoming,
          Message,
          Conversation,
        ],
        synchronize: true,
      }),
      inject: [AppConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AuthModule,
    UsersModule,
    PetsModule,
    BreedsModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    SharesModule,
    RehomingModule,
    MessagingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
export class AppModule {}
