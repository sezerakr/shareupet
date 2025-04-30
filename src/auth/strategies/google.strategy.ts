import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { AppConfigService } from 'src/config/app-config.service';

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
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ): Promise<any> {
        const { id, name, emails, photos } = profile;

        const user = await this.authService.validateGoogleUser({
            googleId: id,
            email: emails[0].value,
            displayName: name.givenName + ' ' + name.familyName,
            avatar: photos[0].value,
        });

        done(null, user);
    }
}