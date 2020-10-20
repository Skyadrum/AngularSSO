import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PermisosDTO } from '../model/PermisosDTO';

@Injectable({ providedIn: 'root' })
export class MenuBarService {

    private permisos: PermisosDTO;

    constructor(private http: HttpClient) { }

    private setPermisos(permisos: PermisosDTO){
        this.permisos = permisos;
    }

    getPermisos(){
        return this.permisos;
    }

    obtenerMenuBar(id: string) {
        return this.http.post<PermisosDTO>(`${environment.apiUrl}` + '/menu/user-menu-permissions', { 'id_pantalla': Number(id) })
            .toPromise()
            .then(data => { this.setPermisos(data); return data });
    }

}