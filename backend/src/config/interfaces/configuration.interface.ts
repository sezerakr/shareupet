export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface GoogleAuthConfig {
  clientID: string;
  clientSecret: string;
  callbackURL: string;
}

export interface AppConfig {
  port: number;
  database: DatabaseConfig;
  jwt: JwtConfig;
  google: GoogleAuthConfig;
}
