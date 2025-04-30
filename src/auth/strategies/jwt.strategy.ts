import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppConfigService } from 'src/config/app-config.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(appConfigService: AppConfigService) {
        const jwtConstants = appConfigService.jwt;
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                ExtractJwt.fromAuthHeaderAsBearerToken(),
                ExtractJwt.fromUrlQueryParameter('token'),
                (request: Request) => {
                    // For debugging
                    console.log('Checking for token in:', {
                        headers: request.headers?.authorization ? 'Authorization header exists' : 'No auth header',
                        query: request.query?.token ? 'Query token exists' : 'No query token',
                        cookies: request.cookies?.token ? 'Cookie token exists' : 'No cookie token'
                    });

                    // Try to extract from various sources
                    const token =
                        (request.headers.authorization && request.headers.authorization.split(' ')[1]) ||
                        request.query.token ||
                        request.cookies?.token;

                    if (token) console.log('Token found from custom extractor');
                    return token;
                }
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: any) {
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
            permissions: payload.permissions || []
        };
    }
}