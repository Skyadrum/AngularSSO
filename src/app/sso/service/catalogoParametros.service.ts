import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ParametroDTO } from '../model/catalogoParametros';
import { OpcionSelect } from '@app/shared/model/Combo';

@Injectable({
    providedIn: 'root'
})

export class CatalogoParametroService {

    constructor(private http: HttpClient) { }

    obtenerCatParametro() {
        return this.http.get<ParametroDTO[]>(`${environment.apiFwkConf}` + 'catalogoParametro/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    crearCatParametro(parametro: ParametroDTO) {
        return this.http.post<ParametroDTO>(`${environment.apiFwkConf}` + 'catalogoParametro/agregar', parametro)
            .toPromise()
            .then(data => { return data })
    }

    editarCatParametro(parametro: ParametroDTO) {
        return this.http.post<ParametroDTO>(`${environment.apiFwkConf}` + 'catalogoParametro/editar', parametro)
            .toPromise()
            .then(data => { return data })
    }

    borrarCatParametro(parametro: ParametroDTO) {
        return this.http.post<ParametroDTO>(`${environment.apiFwkConf}` + 'catalogoParametro/borrar', parametro)
            .toPromise()
            .then(data => { return data })
    }

    obtenerCatParametroById(idSistema: string) {
        return this.http.get<ParametroDTO[]>(`${environment.apiFwkConf}` + 'catalogoParametro/bandeja/'+idSistema)
            .toPromise()
            .then(data => { return data });
    }
    comboCatParametro() {
        return this.http.get<OpcionSelect[]>(`${environment.apiFwkConf}` + 'catalogoParametro/combo')
            .toPromise()
            .then(data => { return data });
    }
}