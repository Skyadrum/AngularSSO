import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '@app/shared/service/Account.service';
import { MenuItem } from 'primeng/api/menuitem';
import { SideBarService } from './SideBar.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService,
        private sideBarService: SideBarService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let banderaEncuentra: boolean = false;
        let user = this.accountService.userValue;
        let encuentraMenu = false;

        if (state.url == "/home" && user) {
            encuentraMenu = true;
        } else if (user) {
            encuentraMenu = this.buscarUrlMenu(banderaEncuentra, state.url, this.sideBarService.items);
        }

        if (user && encuentraMenu) {
            // Usuario loggeado y autorizado
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    private buscarUrlMenu(banderaEncuentra: boolean, url: string, lista: MenuItem[]) {
        for (let i = 0; i < lista.length; i++) {
            if (!banderaEncuentra) {
                if (lista[i].items != null) {
                    banderaEncuentra = this.buscarUrlMenu(banderaEncuentra, url, lista[i].items);
                } else if (url == lista[i].routerLink) {
                    return true;
                }
            }
        }
        return banderaEncuentra;
    }

}