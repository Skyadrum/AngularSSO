import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { PantallaDTO, MenuPantallaDTO } from '../model/catalogoPantallas';
import { TreeNode } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})


export class CatalogoPantallasService {

    items: TreeNode[] = []


    constructor(private http: HttpClient) {}

    obtenerCatPantalla(){
        return this.http.get<PantallaDTO[]>(`${environment.apiFwkConf}` + 'catalogoPantalla/bandeja')
            .toPromise()
            .then(data => { return data });
    }
    
    crearCatPantalla(pantalla: PantallaDTO) {
        return this.http.post<PantallaDTO>(`${environment.apiFwkConf}` + 'catalogoPantalla/agregar', pantalla)
            .toPromise()
            .then(data => { return data })
    }

    editarCatPantalla(pantalla: PantallaDTO) {
        return this.http.post<PantallaDTO>(`${environment.apiFwkConf}` + 'catalogoPantalla/editar', pantalla)
            .toPromise()
            .then(data => { return data })
    }

    borrarCatPantalla(pantalla: PantallaDTO) {
        return this.http.post<PantallaDTO>(`${environment.apiFwkConf}` + 'catalogoPantalla/borrar', pantalla)
            .toPromise()
            .then(data => { return data })
    }

    obtenerCatAmbienteById(idAmbiente: string) {
        return this.http.get<PantallaDTO[]>(`${environment.apiFwkConf}` + 'catalogoPantalla/bandeja/'+idAmbiente)
            .toPromise()
            .then(data => { return data });
    }

    obtenerMenuArbol() {
        return this.http.post(`${environment.apiFwkConf}` + 'catalogoPantalla/menu-pantalla/',null)
            .toPromise()
            .then(res => <MenuPantallaDTO[]>res)
            .then(data => { this.items = data; return data });
    }
}