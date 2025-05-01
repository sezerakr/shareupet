import { Module, Global } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import * as Joi from 'joi';
import configuration from './configuration';
import * as path from 'path';

@Global()
@Module({
    imports: [
        NestConfigModule.forRoot({
            load: [configuration],
            envFilePath: [
                path.resolve(process.cwd(), 'src/config/environments/.env.development'),
                path.resolve(process.cwd(), 'src/config/environments/.env.production'),
            ],
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
                PORT: Joi.number().default(3000),
                DATABASE_HOST: Joi.string().required(),
                DATABASE_PORT: Joi.number().default(5432),
                DATABASE_USERNAME: Joi.string().required(),
                DATABASE_PASSWORD: Joi.string().required(),
                DATABASE_NAME: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRES_IN: Joi.string().default('1h'),
                GOOGLE_CLIENT_ID: Joi.string().allow(''),
                GOOGLE_CLIENT_SECRET: Joi.string().allow(''),
                GOOGLE_CALLBACK_URL: Joi.string().allow(''),
            }),
            isGlobal: true,
        }),
    ],
    providers: [AppConfigService],
    exports: [AppConfigService],
})
export class AppConfigModule { }