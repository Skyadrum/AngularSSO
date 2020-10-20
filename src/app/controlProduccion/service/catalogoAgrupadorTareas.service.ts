import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CatalogoAgrupadorTareas, CatalogoAgrupadorTareasGuarda } from '../model/catalogoAgrupadorTareas';

@Injectable({ providedIn: 'root' })
export class CatalogoAgrupadorTareasService {

    constructor(private http: HttpClient) { }

    obtenerAgrupadorTareas() {
        return this.http.get<CatalogoAgrupadorTareas[]>(`${environment.apiControlProduccion}` + 'catalogoAgrupadorTareas/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    registrarAgrupadorTareas(agrupadorTareas: CatalogoAgrupadorTareasGuarda) {
        return this.http.post<CatalogoAgrupadorTareas>(`${environment.apiControlProduccion}` + 'catalogoAgrupadorTareas/alta', agrupadorTareas)
            .toPromise()
            .then(data => { return data });
    }

    editarAgrupadorTareas(agrupadorTareas: CatalogoAgrupadorTareasGuarda) {
        return this.http.post<CatalogoAgrupadorTareas>(`${environment.apiControlProduccion}` + 'catalogoAgrupadorTareas/cambio', agrupadorTareas)
            .toPromise()
            .then(data => { return data });
    }

    eliminarAgrupadorTareas(agrupadorTareas: CatalogoAgrupadorTareasGuarda) {
        return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoAgrupadorTareas/baja', agrupadorTareas)
            .toPromise()
            .then(res => { return res });
    }

}