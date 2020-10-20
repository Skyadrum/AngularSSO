import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { IncidenciaDTO } from '../model/catalogoIncidencias';



@Injectable({
    providedIn: 'root'
})

export class CatalogoIncidenciasService {

    constructor(private http: HttpClient) { }

    obtenerCatIncidencias() {
        return this.http.get<IncidenciaDTO[]>(`${environment.apiFwkConf}` + 'catalogoIncidencia/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    crearCatIncidencias(incidencia: IncidenciaDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoIncidencia/agregar', incidencia)
            .toPromise()
            .then(data => { return data } )
    }   

    editarCatIncidencias(incidencia: IncidenciaDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoIncidencia/editar', incidencia)
            .toPromise()
            .then(data => { return data } )
    }

    borrarCatIncidencias(incidencia: IncidenciaDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoIncidencia/borrar', incidencia)
            .toPromise()
            .then(data => { return data } )
    }
}