import { Injectable } from "@angular/core";
import { environment } from '@environments/environment';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EncryptService {

    constructor(private http: HttpClient) { }

    encriptarTexto(objeto: any) {
        return this.http.post<any>(`${environment.apiUrl}` + '/codificar/', objeto)
            .toPromise()
            .then(data => { return data });
    }

    desencriptarTexto(objeto: any) {
        return this.http.post<any>(`${environment.apiUrl}` + '/decodificar/', objeto)
            .toPromise()
            .then(data => { return data });
    }

    upload(data) {
        return this.http.post<any>(`${environment.apiUrl}` + '/codificararchivo/', data, {
            reportProgress: true,
            observe: 'events',
            headers: {'enctype' : 'multipart/form-data'}
        }).pipe(map((event) => {
            switch (event.type) {
                case HttpEventType.UploadProgress:
                    const progress = Math.round(100 * event.loaded / event.total);
                    return { status: 'progress', message: progress };
                case HttpEventType.Response:
                    return event.body;
                default:
                    return `Unhandled event: ${event.type}`;
            }
        })
        );
    }

}