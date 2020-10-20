import { Injectable } from "@angular/core";
import { PermisosDTO } from '@app/shared/model/PermisosDTO';
import { MensajeService } from '../Mensaje.service';
import { MenuBarService } from '../MenuBar.service';

@Injectable({ providedIn:'root' })
export class HelpService {

    constructor(
        private mensajeService: MensajeService,
        private menuBarService: MenuBarService,
        ){}

    lanzarVentanaNavegador(){
        let permisosPantalla = this.menuBarService.getPermisos();
        if (permisosPantalla && permisosPantalla.url_help){
            let nuevaVentana = window.open(permisosPantalla.url_help, "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=20,left=20,width=980,height=600");
            nuevaVentana.opener = null; // Se quita la referencia del padre
        } else {
            this.mensajeService.mandarMensajeError("La pantalla no tiene una URL definida");
        }
    }

}