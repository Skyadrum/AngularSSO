import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api/menuitem';
import { Observable, Subject } from 'rxjs';
import { SideBarService } from './SideBar.service';

@Injectable({ providedIn: 'root' })
export class MenuHeaderService {

    constructor(
        private sideBarService: SideBarService,
        private router: Router,
    ) { }

    private menuHeader = new Subject<MenuItem>();

    getMenuHeader(): Observable<MenuItem> {
        return this.menuHeader.asObservable();
    }

    setMenuHeader() {
        let opcionMenu = this.obtenerOpcionMenu(this.router.url);
        this.sideBarService.settearController(opcionMenu);
        this.menuHeader.next(opcionMenu);
    }


    obtenerOpcionMenu(url: string): MenuItem {
        if (url != null) {
            let opcionMenu: MenuItem;
            return this.buscarUrlMenu(opcionMenu, url, this.sideBarService.items);
        }
        return null;
    }
    private buscarUrlMenu(opcionMenu: MenuItem, url: string, lista: MenuItem[]) {
        for (let i = 0; i < lista.length; i++) {
            if (opcionMenu == null) {
                if (lista[i].items != null) {
                    opcionMenu = this.buscarUrlMenu(opcionMenu, url, lista[i].items);
                } else if (url == lista[i].routerLink) {
                    return lista[i];
                }
            }
        }
        return opcionMenu;
    }
}
