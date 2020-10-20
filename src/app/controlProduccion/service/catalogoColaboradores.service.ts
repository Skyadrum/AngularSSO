import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CatalogoColaborador, CatalogoColaboradoresGuarda } from '../model/catalogoColaboradores';

@Injectable({ providedIn: 'root' })
export class CatalogoColaboradoresService {

  constructor(private http: HttpClient) { }

  obtenerColaboradores() {
    return this.http.get<CatalogoColaborador[]>(`${environment.apiControlProduccion}` + 'catalogoColaboradores/bandeja')
      .toPromise()
      .then(data => { return data });
  }

  registrarColaborador(colaborador: CatalogoColaboradoresGuarda) {
    return this.http.post<CatalogoColaborador>(`${environment.apiControlProduccion}` + 'catalogoColaboradores/alta', colaborador)
      .toPromise()
      .then(data => { return data });
  }

  editarColaborador(colaborador: CatalogoColaboradoresGuarda) {
    return this.http.post<CatalogoColaborador>(`${environment.apiControlProduccion}` + 'catalogoColaboradores/cambio', colaborador)
      .toPromise()
      .then(data => { return data });
  }

  eliminarColaborador(colaborador: CatalogoColaboradoresGuarda) {
    return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoColaboradores/baja', colaborador)
      .toPromise()
      .then(res => { return res });
  }

  /* Metodos Auxiliares Proyectos*/
  obtenerPl() {
    return this.http.get<CatalogoColaborador[]>(`${environment.apiControlProduccion}` + 'catalogoColaboradores/conRolPL')
      .toPromise()
      .then(data => { return data });
  }


  obtenerAdm() {
    return this.http.get<CatalogoColaborador[]>(`${environment.apiControlProduccion}` + 'catalogoColaboradores/conRolADM')
      .toPromise()
      .then(data => { return data });
  }


  obtenerTl() {
    return this.http.get<CatalogoColaborador[]>(`${environment.apiControlProduccion}` + 'catalogoColaboradores/conRolTl')
      .toPromise()
      .then(data => { return data });
  }

  obtenerDm() {
    return this.http.get<CatalogoColaborador[]>(`${environment.apiControlProduccion}` + 'catalogoColaboradores/conRolDM')
      .toPromise()
      .then(data => { return data });
  }

  obtenerPxm() {
    return this.http.get<CatalogoColaborador[]>(`${environment.apiControlProduccion}` + 'catalogoColaboradores/conRolPXM')
      .toPromise()
      .then(data => { return data });
  }

}
