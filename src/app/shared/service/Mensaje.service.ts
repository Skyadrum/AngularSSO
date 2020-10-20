import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class MensajeService {
    constructor(private messageService: MessageService) { }

    mandarMensajeSuccess(contenido: string) {
        this.messageService.add({ severity: 'success', summary: "Success", detail: contenido });
    }

    mandarMensajeError(contenido: string) {
        this.messageService.add({ severity: 'error', summary: "Error", detail: contenido });
    }

    mandarMensajeInfo(contenido: string) {
        this.messageService.add({ severity: 'info', summary: "Informative", detail: contenido });
    }

    mandarMensajeWarn(contenido: string) {
        this.messageService.add({ severity: 'warn', summary: "Warning", detail: contenido });
    }

    validarCamposRequeridos(lista: string[]): boolean{
        if (lista.length > 0) {
            this.mandarMensajeError(lista.length == 1 ? "El campo [" + lista.toString() + "] es requerido" : "Los campos [" + lista.toString() + "] son requeridos");
            return false;
        } return true;
    }
}   