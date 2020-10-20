import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AccountService } from '@app/shared/service/Account.service';

@Injectable()
export class ErrorInterceptorService implements HttpInterceptor {
    constructor(
        private accountService: AccountService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if ([401, 403, 405].includes(err.status) && this.accountService.userValue) {
                this.accountService.logout();
            }
            const error = (err.error && err.error.message) || err.statusText;
            return throwError(error);
        }))
    }
}