import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { SistemaDTO } from '../model/catalogoSistema';
import { OpcionSelect } from '@app/shared/model/Combo';


@Injectable({
    providedIn: 'root'
})

export class CatalogoSistemaService {

    constructor(private http: HttpClient) { }

    obtenerCatSistema() {
        return this.http.get<SistemaDTO[]>(`${environment.apiFwkConf}` + 'catalogoSistema/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    crearCatSistema(sistema: SistemaDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoSistema/agregar', sistema)
            .toPromise()
            .then(data => { return data } )
    }   

    editarCatSistema(sistema: SistemaDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoSistema/editar', sistema)
            .toPromise()
            .then(data => { return data } )
    }

    borrarCatSistema(sistema: SistemaDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoSistema/borrar', sistema)
            .toPromise()
            .then(data => { return data } )
    }

    comboCatSistema() {
        return this.http.get<OpcionSelect[]>(`${environment.apiFwkConf}` + 'catalogoSistema/combo')
            .toPromise()
            .then(data => { return data });
    }
}