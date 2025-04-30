import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        // Add custom state parameter for Swagger
        const request = context.switchToHttp().getRequest();

        // If this is the initial authorization request
        if (request.url.includes('/auth/google') && !request.url.includes('/callback')) {
            // If request is from Swagger, preserve the state parameter
            if (request.query.swagger === 'true') {
                // This is important for OAuth security
                console.log(`Google Auth request from Swagger with state: ${request.query.state}`);
            }
        }

        return super.canActivate(context);
    }

    // Override to ensure state is passed to the strategy
    getAuthenticateOptions(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const options: any = {};

        if (req.query.state) {
            options.state = req.query.state;
        }

        return options;
    }
}