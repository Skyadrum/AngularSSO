import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { environment } from '@environments/environment';
import { MenuDTO } from '../model/MenuDTO';
import { MenuItem } from 'primeng/api/menuitem';

@Injectable({ providedIn: 'root' })
export class SideBarService {
    items: MenuDTO[] = [];
    public controller: string;

    constructor(private http: HttpClient) { 
        this.controller = null;
    }

    obtenerMenu() {
        return this.http.post<any>(`${environment.apiUrl}` + '/menu/user-menu-list', null)
            .toPromise()
            .then(res => <MenuDTO[]>res)
            .then(data => { this.items = data; return data });
    }

    settearController(opcionMenu: MenuItem){
        if(opcionMenu){
            this.controller = this.obtenerControllerById(null, opcionMenu.id, this.items);
        } else {
            this.controller = null;
        }
    }

    private obtenerControllerById(banderaControler: string, idMenu: string, lista: MenuDTO[]) {
        for (let i = 0; i < lista.length; i++) {
            if (!banderaControler) {
                if (lista[i].items != null) {
                    banderaControler = this.obtenerControllerById(banderaControler, idMenu, lista[i].items);
                } else if (idMenu == lista[i].id) {
                    return lista[i].controller;
                }
            }
        }
        return banderaControler;
    }

}