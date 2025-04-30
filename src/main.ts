
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthExceptionFilter } from './auth/filters/auth-exceptions.filter';
import { AppConfigService } from './config/app-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));

  app.useGlobalFilters(new AuthExceptionFilter());

  const configService = app.get(AppConfigService);

  const config = new DocumentBuilder()
    .setTitle('Share Your Pets API')
    .setDescription('The Share Your Pets with everyone that loves pets')
    .setVersion('1.0')
    .addTag('pets')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        implicit: {
          authorizationUrl: '/auth/google?swagger=true',
          scopes: {
            'email': 'Email access',
            'profile': 'Profile information',
          }
        }
      },
      description: 'Google OAuth2 Authentication'
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const securedOperations = Object.values(document.paths)
    .flatMap(path => Object.values(path))
    .filter(operation => !operation.security);

  securedOperations.forEach(operation => {
    operation.security = [{ oauth2: ['email', 'profile'] }];
  });
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: `${process.env.SERVER_URL || 'http://localhost:3000'}/api/oauth2-redirect.html`,
      oauth: {
        clientId: configService.google.clientID,
        appName: 'Share Your Pets API',
        scopeSeparator: ' ',
        useBasicAuthenticationWithAccessCodeGrant: false,
        usePkceWithAuthorizationCodeGrant: false,
        additionalQueryStringParams: {
          swagger: 'true'
        }
      },
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
