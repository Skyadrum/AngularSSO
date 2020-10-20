import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CatalogoActividades, CatalogoActividadesGuarda } from '../model/catalogoActividades';

@Injectable({ providedIn: 'root' })
export class CatalogoActividadesService {

    constructor(private http: HttpClient) { }

    obtenerActividades() {
        return this.http.get<CatalogoActividades[]>(`${environment.apiControlProduccion}` + 'catalogoActividades/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    registrarActividad(actividad: CatalogoActividadesGuarda) {
        return this.http.post<CatalogoActividades>(`${environment.apiControlProduccion}` + 'catalogoActividades/alta', actividad)
            .toPromise()
            .then(data => { return data });
    }

    editarActividad(actividad: CatalogoActividadesGuarda) {
        return this.http.post<CatalogoActividades>(`${environment.apiControlProduccion}` + 'catalogoActividades/cambio', actividad)
            .toPromise()
            .then(data => { return data });
    }

    eliminarActividad(actividad: CatalogoActividadesGuarda) {
        return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoActividades/baja', actividad)
            .toPromise()
            .then(res => { return res });
    }

    obtenerActividadesPorIdTemplate(idTemplate: string) {
        return this.http.get<CatalogoActividades[]>(`${environment.apiControlProduccion}` + 'catalogoActividades/actividades/idTemplate/' + idTemplate)
            .toPromise()
            .then(data => { return data });
    }

}