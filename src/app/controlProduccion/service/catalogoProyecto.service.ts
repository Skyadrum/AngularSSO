import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { CatalogoProyecto, CatalogoProyectoGuarda } from '../model/catalogoProyecto';
import { OpcionSelect } from '@app/shared/model/Combo';

@Injectable({ providedIn: 'root' })
export class CatalogoProyectoService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${environment.apiControlProduccion}` + "catalogoProyectos/bandeja");
  }

  getProyectos() {
    return this.http.get<CatalogoProyecto[]>(`${environment.apiControlProduccion}` + 'catalogoProyectos/bandeja')
      .toPromise()
      .then(data => { return data });
  }


  registrarProyecto(proyecto: CatalogoProyectoGuarda) {
    return this.http.post<CatalogoProyecto>(`${environment.apiControlProduccion}` + 'catalogoProyectos/alta', proyecto)
      .toPromise()
      .then(data => { return data });
  }

  editarProyecto(proyecto: CatalogoProyectoGuarda) {
    return this.http.post<CatalogoProyecto>(`${environment.apiControlProduccion}` + 'catalogoProyectos/cambio', proyecto)
      .toPromise()
      .then(data => { return data });
  }

  eliminarProyecto(proyecto: CatalogoProyectoGuarda) {
    return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoProyectos/baja', proyecto)
      .toPromise()
      .then(res => { return res });
  }

  obtenerCombo() {
    return this.http.get<OpcionSelect[]>(`${environment.apiControlProduccion}` + 'catalogoProyectos/combo')
      .toPromise()
      .then(data => { return data });
  }

}
