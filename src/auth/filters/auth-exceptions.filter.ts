import { ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        const exceptionResponse = exception.getResponse() as any;
        const message = exceptionResponse.message || 'Unauthorized';

        response.status(status).json({
            statusCode: status,
            message: Array.isArray(message) ? message[0] : message,
            error: 'Unauthorized',
            timestamp: new Date().toISOString(),
        });
    }
}