import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppConfig,
  DatabaseConfig,
  GoogleAuthConfig,
  JwtConfig,
} from './interfaces/configuration.interface';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<AppConfig>) {}

  get port(): number {
    return this.configService.get<number>('port', { infer: true }) || 3000;
  }

  get nodeEnv(): string {
    return (
      this.configService.get<string>('NODE_ENV', { infer: true }) ||
      'development'
    );
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get database(): DatabaseConfig {
    const databaseConfig = this.configService.get<DatabaseConfig>('database');
    if (!databaseConfig) {
      throw new Error('Database configuration is missing');
    }
    return databaseConfig;
  }

  get jwt(): JwtConfig {
    const jwtConfig = this.configService.get<JwtConfig>('jwt');
    if (!jwtConfig) {
      throw new Error('JWT configuration is missing');
    }
    return jwtConfig;
  }

  get google(): GoogleAuthConfig {
    const googleConfig = this.configService.get<GoogleAuthConfig>('google');
    if (!googleConfig) {
      throw new Error('Google authentication configuration is missing');
    }
    return googleConfig;
  }

  getDatabaseHost(): string {
    return this.database.host;
  }

  getDatabaseConnectionString(): string {
    const { host, port, username, password, name } = this.database;
    return `postgresql://${username}:${password}@${host}:${port}/${name}`;
  }

  getJwtSecret(): string {
    return this.jwt.secret;
  }

  getJwtExpiresIn(): string {
    return this.jwt.expiresIn;
  }

  hasGoogleAuthEnabled(): boolean {
    return !!this.google.clientID && !!this.google.clientSecret;
  }
}
