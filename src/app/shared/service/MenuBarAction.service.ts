import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuBarActionService {

    constructor() { }

    private action = new Subject<string>();
    private estatus = new Subject<string>();

    // Utilizado para saber cual boton es presionado
    getAction(): Observable<string> {
        return this.action.asObservable();
    }
    setAction(action: string) {
        this.action.next(action);
    }

    // Utilizado para saber que estatus tiene la pantalla para habilitar/deshabilitar botones
    getEstatus(): Observable<string>{
        return this.estatus.asObservable();
    }
    asignarEstatusEditar(){
        this.estatus.next("asignaEstatusEditar");
    }
    asignarEstatusApertura(){
        this.estatus.next("asignaEstatusApertura");
    }
    asignarEstatusNuevo(){
        this.estatus.next("asignaEstatusNuevo");
    }

    // Utilizado para la pantalla Reales
    asignaEstatusRealesDeshabilitado(){
        this.estatus.next("asignaEstatusRealesDeshabilitado");
    }
    asignaEstatusRealesApertura(){
        this.estatus.next("asignaEstatusRealesApertura");
    }
    asignarEstatusPlay(){
        this.estatus.next("asignaEstatusPlay");
    }
    asignarEstatusPausa(){
        this.estatus.next("asignaEstatusPausa");
    }


}
