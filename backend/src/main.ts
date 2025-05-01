import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AuthExceptionFilter } from './auth/filters/auth-exceptions.filter';
import { AppConfigService } from './config/app-config.service';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors();

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
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, but good practice
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header'
      },
      'access-token',
    )

    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            // Ensure this URL is correct for your Google OAuth initiation route
            authorizationUrl: '/auth/google?swagger=true',
            scopes: { 'email': 'Email access', 'profile': 'Profile access' }
          }
        }
      },
      'oauth2' // This is the unique name for this scheme, used in @ApiSecurity()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const securedOperations = Object.values(document.paths)
    .flatMap(path => Object.values(path))
    .filter(operation => operation && typeof operation === 'object' && !operation.security); // Added null/type check

  securedOperations.forEach(operation => {
    operation.security = [{ oauth2: ['email', 'profile'] }];
  });


  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      oauth2RedirectUrl: `${process.env.SERVER_URL || 'http://localhost:3000'}/api/oauth2-redirect.html`,
      oauth: {
        clientId: configService.google.clientID, // Assuming you have a Google clientID in your config
        appName: 'Share Your Pets API',
        scopeSeparator: ' ',
        useBasicAuthenticationWithAccessCodeGrant: false, // Usually false for implicit/auth code flow
        usePkceWithAuthorizationCodeGrant: false, // Set to true if you are using PKCE
        additionalQueryStringParams: {
          swagger: 'true' // Custom param if needed by your auth route
        }
      },
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  app.use(cookieParser());
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger UI is available on: http://localhost:${port}/api`);
}

bootstrap();