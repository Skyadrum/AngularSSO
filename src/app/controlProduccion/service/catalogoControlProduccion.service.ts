import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CatalogoControlProduccion, CatalogoControlProduccionGuarda, CatalogoControlProduccionDTO } from '../model/catalogoControlProduccion';

@Injectable({ providedIn: 'root' })
export class CatalogoControlProduccionService {

  constructor(private http: HttpClient) { }

  obtenerControlProduccion() {
    return this.http.get<CatalogoControlProduccion[]>(`${environment.apiControlProduccion}` + 'catalogoControlProduccion/bandeja')
      .toPromise()
      .then(data => { return data });
  }

  registrarControlProduccion(colaborador: CatalogoControlProduccionGuarda) {
    return this.http.post<CatalogoControlProduccion>(`${environment.apiControlProduccion}` + 'catalogoControlProduccion/alta', colaborador)
      .toPromise()
      .then(data => { return data });
  }

  editarControlProduccion(colaborador: CatalogoControlProduccionGuarda) {
    return this.http.post<CatalogoControlProduccion>(`${environment.apiControlProduccion}` + 'catalogoControlProduccion/cambio', colaborador)
      .toPromise()
      .then(data => { return data });
  }

  eliminarControlProduccion(colaborador: CatalogoControlProduccionGuarda) {
    return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoControlProduccion/baja', colaborador)
      .toPromise()
      .then(res => { return res });
  }

  obtenerControlProduccionPorIdProyecto(idProyecto: number) {
    return this.http.get<CatalogoControlProduccionDTO[]>(`${environment.apiControlProduccion}` + 'catalogoControlProduccion/bandeja/idProyecto/' + idProyecto)
      .toPromise()
      .then(data => { return data });
  }


}
