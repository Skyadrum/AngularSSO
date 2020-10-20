import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ElementoCatalogo } from '@app/shared/model/Combo';

@Injectable({
    providedIn: 'root'
})
export class CatalogoGenericoService {

    constructor(private http: HttpClient) { }

    obtenerCatalogos(origen: string) {
        return this.http.get<any>(`${environment.apiControlProduccion}` + origen + '/bandeja')
            .toPromise()
            .then(res => <ElementoCatalogo[]>res)
            .then(data => { return data });
    }

    registrarCatalogo(origen: string, elemento: Object) {
        return this.http.post<any>(`${environment.apiControlProduccion}` + origen + '/alta', elemento)
            .toPromise()
            .then(res => <ElementoCatalogo>res)
            .then(data => { return data });
    }

    editarCatalogo(origen: string, elemento: Object) {
        return this.http.post<any>(`${environment.apiControlProduccion}` + origen + '/cambio', elemento)
            .toPromise()
            .then(res => <ElementoCatalogo>res)
            .then(data => { return data });
    }

    eliminarCatalogo(origen: string, elemento: string) {
        return this.http.post<any>(`${environment.apiControlProduccion}` + origen + '/baja', elemento)
            .toPromise()
            .then(res => { return res });
    }

}
