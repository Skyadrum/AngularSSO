import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { CatalogoUsuario } from '../model/catalogoUsuarios';

@Injectable({
  providedIn: 'root' 
})
export class CatalogoUsuariosService {

  constructor(private http: HttpClient) { }

  obtenerUsuarios() {
    return this.http.get<any>(`${environment.apiControlProduccion}` + 'catalogoUsuarios/bandeja')
      .toPromise()
      .then(res => <CatalogoUsuario[]>res)
      .then(data => { return data });
  }

  registrarUsuario(usuario: Object) {
    return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoUsuarios/alta', usuario)
      .toPromise()
      .then(res => <CatalogoUsuario>res)
      .then(data => { return data });
  }

  editarUsuario(usuario: Object) {
    return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoUsuarios/cambio', usuario)
      .toPromise()
      .then(res => <CatalogoUsuario>res)
      .then(data => { return data });
  }

  eliminarUsuario(usuario: Object) {
    return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoUsuarios/baja', usuario)
      .toPromise()
      .then(res => { return res });
  }

}
