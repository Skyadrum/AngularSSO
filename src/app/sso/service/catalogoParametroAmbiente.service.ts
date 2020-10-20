import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ParametroAmbienteDTO } from '../model/catalogoParametroAmbiente';


@Injectable({
    providedIn: 'root'
})

export class CatalogoParametroAmbienteService {

    constructor(private http: HttpClient) { }

    obtenerCatParametro() {
        return this.http.get<ParametroAmbienteDTO[]>(`${environment.apiFwkConf}` + 'catalogoParametroAmbiente/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    crearCatParametro(parametro: ParametroAmbienteDTO) {
        return this.http.post<ParametroAmbienteDTO>(`${environment.apiFwkConf}` + 'catalogoParametroAmbiente/agregar', parametro)
            .toPromise()
            .then(data => { return data })
    }
    editarCatParametro(parametro: ParametroAmbienteDTO) {
        return this.http.post<ParametroAmbienteDTO>(`${environment.apiFwkConf}` + 'catalogoParametroAmbiente/editar', parametro)
            .toPromise()
            .then(data => { return data })
    }
    borrarCatParametro(parametro: ParametroAmbienteDTO) {
        return this.http.post<ParametroAmbienteDTO>(`${environment.apiFwkConf}` + 'catalogoParametroAmbiente/borrar', parametro)
            .toPromise()
            .then(data => { return data })
    }
}