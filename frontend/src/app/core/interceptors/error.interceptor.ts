import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../../shared/services/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMessage = `Error: ${error.error.message}`;
        } else if (error.error && typeof error.error === 'object' && error.error.message) {
          // Backend errors (assuming the ErrorResponse structure)
          errorMessage = `Error Code: ${error.status}\nMessage: ${Array.isArray(error.error.message) ? error.error.message.join('\n') : error.error.message}`;
        } else if (error.status) {
          // HTTP errors with status code but no specific backend message
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        this.errorService.showError(errorMessage);
        return throwError(() => new Error(errorMessage));
      }),
    );
  }
}
