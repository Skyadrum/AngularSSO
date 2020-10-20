import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ConexionDTO } from '../model/catalogoConexiones';


@Injectable({
    providedIn: 'root'
})

export class CatalogoConexionService {

    constructor(private http: HttpClient) { }

    obtenerCatConexion() {
        return this.http.get<ConexionDTO[]>(`${environment.apiFwkConf}` + 'catalogoConexion/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    crearCatConexion(conexion: ConexionDTO) {
        return this.http.post<ConexionDTO>(`${environment.apiFwkConf}` + 'catalogoConexion/agregar', conexion)
            .toPromise()
            .then(data => { return data })
    }

    editarCatConexion(conexion: ConexionDTO) {
        return this.http.post<ConexionDTO>(`${environment.apiFwkConf}` + 'catalogoConexion/editar', conexion)
            .toPromise()
            .then(data => { return data })
    }

    borrarCatConexion(conexion: ConexionDTO) {
        return this.http.post<ConexionDTO>(`${environment.apiFwkConf}` + 'catalogoConexion/borrar', conexion)
            .toPromise()
            .then(data => { return data })
    }

    obtenerCatConexionById(idSistema: string) {
        return this.http.get<ConexionDTO[]>(`${environment.apiFwkConf}` + 'catalogoConexion/bandeja/'+idSistema)
            .toPromise()
            .then(data => { return data });
    }
}