import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';
import { Request } from 'express';
import { RequestUser } from 'src/common/interfaces/request-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(appConfigService: AppConfigService) {
    const jwtConstants = appConfigService.jwt;
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
        (request: Request) => {
          return (
            (request.headers.authorization &&
              request.headers.authorization.split(' ')[1]) ||
            (request.query.token as string) ||
            request.cookies?.auth_token
          );
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: any): Promise<RequestUser> {
    if (!payload) {
      console.error('Invalid JWT payload received');
      throw new UnauthorizedException('Invalid token');
    }

    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      displayName: payload.displayName,
      avatar: payload.avatar,
      permissions: payload.permissions || [],
    } as RequestUser;
  }
}
