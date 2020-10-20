import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { AmbientesDTO } from '../model/catalogoAmbientes';
import { OpcionSelect } from '@app/shared/model/Combo';


@Injectable({
    providedIn: 'root'
})

export class CatalogoAmbienteService {

    constructor(private http: HttpClient) { }

    obtenerCatAmbiente() {
        return this.http.get<AmbientesDTO[]>(`${environment.apiFwkConf}` + 'catalogoAmbiente/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    crearCatAmbiente(ambiente: AmbientesDTO) {
        return this.http.post<AmbientesDTO>(`${environment.apiFwkConf}` + 'catalogoAmbiente/agregar', ambiente)
            .toPromise()
            .then(data => { return data })
    }

    editarCatAmbiente(ambiente: AmbientesDTO) {
        return this.http.post<AmbientesDTO>(`${environment.apiFwkConf}` + 'catalogoAmbiente/editar', ambiente)
            .toPromise()
            .then(data => { return data })
    }

    borrarCatAmbiente(ambiente: AmbientesDTO) {
        return this.http.post<AmbientesDTO>(`${environment.apiFwkConf}` + 'catalogoAmbiente/borrar', ambiente)
            .toPromise()
            .then(data => { return data })
    }

    comboCatAmbiente() {
        return this.http.get<OpcionSelect[]>(`${environment.apiFwkConf}` + 'catalogoAmbiente/combo')
            .toPromise()
            .then(data => { return data });
    }

    obtenerCatAmbienteById(idSistema: string) {
        return this.http.get<AmbientesDTO[]>(`${environment.apiFwkConf}` + 'catalogoAmbiente/bandeja/'+idSistema)
            .toPromise()
            .then(data => { return data });
    }
}