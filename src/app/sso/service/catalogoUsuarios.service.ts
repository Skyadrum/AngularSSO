import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { UsuarioDTO } from '../model/catalogoUsuarios';
import { ConfiguracionParametro } from '../model/configuracionParametro';
import { OpcionSelect } from '@app/shared/model/Combo';


@Injectable({
    providedIn: 'root'
})

export class CatalogoUsuaiosService {

    constructor(private http: HttpClient) { }

    obtenerCatUsuario() {
        return this.http.get<UsuarioDTO[]>(`${environment.apiFwkConf}` + 'catalogoUsuario/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    crearCatUsuaio(usuario: UsuarioDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoUsuario/agregar', usuario)
            .toPromise()
            .then(data => { return data } )
    }   

    editarCatUsuario(usuario: UsuarioDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoUsuario/editar', usuario)
            .toPromise()
            .then(data => { return data } )
    }

    borrarCatUsuario(usuario: UsuarioDTO) {
        return this.http.post<any>(`${environment.apiFwkConf}` + 'catalogoUsuario/borrar', usuario)
            .toPromise()
            .then(data => { return data } )
    }

    comboCatUsuario() {
        return this.http.get<OpcionSelect[]>(`${environment.apiFwkConf}` + 'catalogoUsuario/combo')
            .toPromise()
            .then(data => { return data });
    }


    obtenerConfiguracionEncriptacion(configuracion: ConfiguracionParametro) {
        return this.http.post<any>(`${environment.apiUrl}` + '/configuracion/parametro/',configuracion)
            .toPromise()
            .then(data => { return data })
    }



}