import { Injectable } from "@angular/core";
import { BitacoraDTO } from '../model/BitacoraDTO';
import { VariableSistemaService } from './VariableSistema.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { Subscription } from 'rxjs';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { MensajeService } from './Mensaje.service';
import { AccountService } from '@app/shared/service/Account.service';

@Injectable({ providedIn: 'root' })
export class BitacoraService {

    protected subscription: Subscription;
    private pantallaActual: any;

    constructor(
        private accountService: AccountService,
        private variableSistema: VariableSistemaService,
        private menuHeaderService: MenuHeaderService,
        private http: HttpClient,
        private mensajeService: MensajeService,
        ) { 
            this.subscription = this.menuHeaderService.getMenuHeader()
            .subscribe(objeto => this.pantallaActual = objeto);
        }

    obtenerPantallaActual(){
        return this.pantallaActual.label;
    }

    obtenerIdPantallaActual(){
        return this.pantallaActual.id_pantalla;
    }

    guardarError(accion: string, ubicacion: string, descripcionIncidencia: string) {
        this.enviarRegistro(1, this.obtenerIdPantallaActual(), accion, ubicacion, descripcionIncidencia, null, null);
    }

    guardarSesion(accion: string, ubicacion: string, descripcionIncidencia: string) {
        this.enviarRegistro(2, 0, accion, ubicacion, descripcionIncidencia, null, null);
    }

    guardarBitacora(accion: string, ubicacion: string, descripcionIncidencia: string) {
        this.enviarRegistro(3, this.obtenerIdPantallaActual(), accion, ubicacion, descripcionIncidencia, null, null);
    }

    guardarTransaccion(accion: string, ubicacion: string, descripcionIncidencia: string, valorAnterior: string, valorActual: string) {
        this.enviarRegistro(4, this.obtenerIdPantallaActual(), accion, ubicacion, descripcionIncidencia, valorAnterior, valorActual);
    }

    guardarAccion(accion: string, ubicacion: string, descripcionIncidencia: string, valorAnterior: string, valorActual: string) {
        this.enviarRegistro(5, this.obtenerIdPantallaActual(), accion, ubicacion, descripcionIncidencia, valorAnterior, valorActual);
    }

    private enviarRegistro(idTipoIncidencia: number, idPantalla: number, accion: string, ubicacion: string, descripcionIncidencia: string, valorAnterior: string, valorActual: string) {
        let bitacora: BitacoraDTO = {
            idIncidencia: null,
            catTipoIncidencia: idTipoIncidencia,
            idSistema: this.variableSistema.getIdSistema(),
            idAmbiente: this.variableSistema.getIdAmbiente(),
            idPantalla: idPantalla,
            usuario: ((this.accountService.userValue) ? this.accountService.userValue.usuario : ""),
            ubicacion: ubicacion,
            accion: accion,
            valorAnterior: valorAnterior,
            valorActual: valorActual,
            descripcionIncidencia: descripcionIncidencia,
            fechaIncidencia: null,
        };
        
        this.obtenerBitacora(bitacora).then(resultado => resultado, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al guardar la bitácora");
        });
    }

    obtenerBitacora(objeto: BitacoraDTO) {
        return this.http.post<any>(`${environment.apiUrl}` + '/bitacora', objeto)
            .toPromise()
            .then(data => { return data });
    }

}