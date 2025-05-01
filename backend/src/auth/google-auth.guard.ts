import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        if (request.url.includes('/auth/google') && !request.url.includes('/callback')) {
            if (request.query.swagger === 'true') {
                console.log(`Google Auth request from Swagger with state: ${request.query.state}`);
            }
        }

        return super.canActivate(context);
    }

    getAuthenticateOptions(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const options: any = {};

        if (req.query.state) {
            options.state = req.query.state;
        }

        return options;
    }
}