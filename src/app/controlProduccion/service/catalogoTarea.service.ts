import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { CatalogoTareaDTO } from '../model/catalogoPlaneacionTareas';
import { CatalogoTareas, CatalogoTareasGuarda } from '../model/catalogoTareas';

@Injectable({ providedIn: 'root' })
export class CatalogoTareaService {

    constructor(private http: HttpClient) { }

    obtenerTareas() {
        return this.http.get<CatalogoTareas[]>(`${environment.apiControlProduccion}` + 'catalogoTareas/bandeja')
            .toPromise()
            .then(data => { return data });
    }

    registrarTarea(tarea: CatalogoTareasGuarda) {
        return this.http.post<CatalogoTareas>(`${environment.apiControlProduccion}` + 'catalogoTareas/alta', tarea)
            .toPromise()
            .then(data => { return data });
    }

    editarTarea(tarea: CatalogoTareasGuarda) {
        return this.http.post<CatalogoTareas>(`${environment.apiControlProduccion}` + 'catalogoTareas/cambio', tarea)
            .toPromise()
            .then(data => { return data });
    }

    eliminarTarea(tarea: CatalogoTareasGuarda) {
        return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoTareas/baja', tarea)
            .toPromise()
            .then(res => { return res });
    }

    obtenerTareasPorIdControlProduccion(idControlProduccion: number) {
        return this.http.get<CatalogoTareaDTO[]>(`${environment.apiControlProduccion}` + 'catalogoTareas/tareas/idCtrlProd/' + idControlProduccion)
            .toPromise()
            .then(data => { return data });
    }

    guardarTareas(tareas: CatalogoTareaDTO[]) {
        return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoTareas/tareas/guardar', tareas)
            .toPromise()
            .then(res => { return res });
    }

    borrarTareas(tareas: CatalogoTareaDTO) {
        return this.http.post<any>(`${environment.apiControlProduccion}` + 'catalogoTareas/tareas/borrar', tareas)
            .toPromise()
            .then(res => { return res });
    }
}