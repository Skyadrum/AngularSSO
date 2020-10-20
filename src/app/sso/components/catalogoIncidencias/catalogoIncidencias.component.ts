import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/model/BaseComponent';

// Services
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { BlockService } from '@app/shared/service/Block.service';
import { ConfirmationService } from 'primeng/api';
import { CatalogoIncidenciasService } from '@app/sso/service/catalogoIncidencias.service';

// Models
import { IncidenciaDTO } from '@app/sso/model/catalogoIncidencias';




@Component({
    selector: 'app-catalogo-incidencias',
    templateUrl: './catalogoIncidencias.component.html'
})

export class CatalogoIncidenciasComponent extends BaseComponent implements OnInit {
    
    cols: any[];
    esNuevo: boolean = true;
    habilitarInputs: boolean;
    elementoSeleccionado: IncidenciaDTO;
    elementoGuarda: IncidenciaDTO;
    incidenciaDTO: IncidenciaDTO;

    constructor( protected menuBarActionService: MenuBarActionService,
        protected menuHeaderService: MenuHeaderService,
        protected bitacoraService: BitacoraService,
        protected mensajeService: MensajeService,
        private blockService: BlockService,
        private confirmationService: ConfirmationService, 
        private catalogoIncidenciasService: CatalogoIncidenciasService){
super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
}
    
    

    ngOnInit(): void {
        this.cancelar();
        this.cols = [
            { field: "idIncidencia", header: "ID"},
            { field: "idTipoIncidencia", header: "Tipo"},
            { field: "idSistema ", header: "Sistema "},
            { field: "idAmbiente", header: "Ambiente"},
            { field: "idPantalla", header: "Pantalla"},
            { field: "usuario", header: "Usuario"},
            { field: "ipUsuario", header: "IP"},
            { field: "nombreEquipo", header: "Equipo"},
            { field: "accion", header: "Acción"},
            { field: "dsIncidencia", header: "Descripción"},
            { field: "fechaIncidencia", header: "Fecha"}
        ];
    }

    ejecutarBotonNuevo() {
        this.habilitarInputs = true;
        this.cancelar();
    }


    ejecutarBotonCancelar() {
        this.habilitarInputs = false;
        this.cancelar();
    }

    cancelar() {
        this.esNuevo = true;
        this.elementoSeleccionado = {
            idIncidencia: null,
            idTipoIncidencia: null,
            idSistema: null, 
            idAmbiente: null,
            idPantalla: null,
            usuario: null,
            ipUsuario: null,
            nombreEquipo: null,
            ubicacion: null,
            accion: null,
            valor_anterior: null,
            valor_actual: null,
            dsIncidencia: null,
            fechaIncidencia: null
        }
        this.incidenciaDTO = {
            idIncidencia: null,
            idTipoIncidencia: null,
            idSistema: null, 
            idAmbiente: null,
            idPantalla: null,
            usuario: null,
            ipUsuario: null,
            nombreEquipo: null,
            ubicacion: null,
            accion: null,
            valor_anterior: null,
            valor_actual: null,
            dsIncidencia: null,
            fechaIncidencia: null
        }
        this.elementoGuarda = {
            idIncidencia: null,
            idTipoIncidencia: null,
            idSistema: null, 
            idAmbiente: null,
            idPantalla: null,
            usuario: null,
            ipUsuario: null,
            nombreEquipo: null,
            ubicacion: null,
            accion: null,
            valor_anterior: null,
            valor_actual: null,
            dsIncidencia: null,
            fechaIncidencia: null
        };
    }


}
