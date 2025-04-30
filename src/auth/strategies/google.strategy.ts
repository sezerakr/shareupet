import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AppConfigService } from 'src/config/app-config.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private appConfigService: AppConfigService,
        private authService: AuthService,
    ) {
        super({
            clientID: appConfigService.google.clientID,
            clientSecret: appConfigService.google.clientSecret,
            callbackURL: appConfigService.google.callbackURL,
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });
    }

    async validate(
        request: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        console.log('Google auth validate called', {
            accessToken: accessToken.substring(0, 10) + '...',
            queryParams: request.query
        });

        const { id, name, emails, photos } = profile;

        const user = await this.authService.validateGoogleUser({
            googleId: id,
            email: emails[0].value,
            displayName: name.givenName + ' ' + name.familyName,
            avatar: photos[0].value,
        });

        // Pass the original query parameters to check if it's from Swagger
        const isFromSwagger = request.query.swagger === 'true';
        user.fromSwagger = isFromSwagger;

        done(null, user);
    }
}