import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { tipoIncidenciaDTO } from '../model/catalogoTipoIncidencia';



@Injectable({
    providedIn: 'root'
})

export class CatalogoTipoIncidenciaService {

    constructor(private http: HttpClient) { }

    obtenerCatTipoIncidencias() {
        return this.http.get<tipoIncidenciaDTO[]>(`${environment.apiFwkConf}` + 'catalogoTipoIncidencia/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    crearCatTipoIncidencia(tipoIncidencia: tipoIncidenciaDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoTipoIncidencia/agregar', tipoIncidencia)
            .toPromise()
            .then(data => { return data } )
    }   

    editarCatTipoIncidencia(tipoIncidencia: tipoIncidenciaDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoTipoIncidencia/editar', tipoIncidencia)
            .toPromise()
            .then(data => { return data } )
    }

    borrarCatTipoIncidencia(tipoIncidencia: tipoIncidenciaDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoTipoIncidencia/borrar', tipoIncidencia)
            .toPromise()
            .then(data => { return data } )
    }
}