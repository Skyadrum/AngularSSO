import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AccountService } from '@app/shared/service/Account.service';
import { UserDTO } from '../model/UserDTO';
import { VariableSistemaService } from './VariableSistema.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private accountService: AccountService,
        private variableSistemaService: VariableSistemaService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const user = this.accountService.userValue;
        const isLoggedIn = user && user.accessToken;
        const isApiUrl = request.url.startsWith(environment.apiUrl);

        if ((isLoggedIn && isApiUrl) || request.url.endsWith("/login-check")) {
            request = request.clone(this.obtenerHeaders(user, request));
        }
        return next.handle(request);
    }

    private obtenerHeaders(user: UserDTO, request: HttpRequest<any>) {
        let headers = {
            setHeaders: {
                'Authorization': (user == null) ? "" : user.accessToken.bearer,
                'Ambiente': (this.variableSistemaService.getIdAmbiente() == null ? "" : this.variableSistemaService.getIdAmbiente())
            }
        };
        if (request.headers.keys().length > 0) {
            let headerString = request.headers.keys();
            for (let i = 0; i < headerString.length; i++) {
                headers.setHeaders[headerString[i]] = request.headers.get(headerString[i]);
            }
        } else if (request.method == "POST") {
            headers.setHeaders["Content-Type"] = 'application/json;charset=UTF-8';
        }
        return headers;
    }
}