import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/model/BaseComponent';

// Services
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { BlockService } from '@app/shared/service/Block.service';
import { CatalogoTipoIncidenciaService } from '@app/sso/service/catalogoTipoIncidencia.service';
import { ConfirmationService } from 'primeng/api';

// Models
import { tipoIncidenciaDTO } from '@app/sso/model/catalogoTipoIncidencia';



@Component({
    selector: 'app-catalogo-tipo-incidencia',
    templateUrl: './catalogoTipoIncidencia.component.html'
})

export class CatalogoTiposIncidenciaComponent extends BaseComponent implements OnInit {
    
    cols: any[];
    esNuevo: boolean = true;
    habilitarInputs: boolean;
    habilitarEdicion: boolean;
    elementoSeleccionado: tipoIncidenciaDTO;
    elementos: tipoIncidenciaDTO[] = []; 
    elementoGuarda: tipoIncidenciaDTO;
    tipoIncidenciaDTO: tipoIncidenciaDTO;

    constructor( protected menuBarActionService: MenuBarActionService,
        protected menuHeaderService: MenuHeaderService,
        protected bitacoraService: BitacoraService,
        protected mensajeService: MensajeService,
        private blockService: BlockService,
        private confirmationService: ConfirmationService, 
        private catalogoTipoIncidenciaService: CatalogoTipoIncidenciaService){
super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
}
    
    

    ngOnInit(): void {
        this.cancelar();
        this.cols = [
            { field: "idTipoIncidencia", header: "Id" },
            { field: "tipoIncidencia", header: "Tipo" },
            { field: "dsTipoIncidencia", header: "Descripción" },
        ];

        this.obtenerCatTipoIncidencia();
    }

    obtenerCatTipoIncidencia(){
        this.catalogoTipoIncidenciaService.obtenerCatTipoIncidencias()
            .then(tipoIncidencias => {
                this.elementos = tipoIncidencias;
            }, error => {
                this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el Catálogo Género");
            })
    }

    ejecutarBotonGuardar(){
        if (this.elementoGuarda != null) {
            this.blockService.setBlock();

            // Validaciones
            let listaErrores = [];

            if( this.elementoGuarda.idTipoIncidencia == null || this.elementoGuarda.idTipoIncidencia < 1 || this.elementoGuarda.idTipoIncidencia > 5 ){
                listaErrores.push('El ID no puede ser mayor a 5')
            }

            if( this.elementoGuarda.tipoIncidencia == null || this.elementoGuarda.tipoIncidencia.trim() == '' ){
                listaErrores.push('Tipo de incidencia')
            }

            if (!this.mensajeService.validarCamposRequeridos(listaErrores)){
                this.blockService.cleanBlock();
                return;
            }

            if (this.esNuevo) {
                this.catalogoTipoIncidenciaService.crearCatTipoIncidencia(this.elementoGuarda)
                    .then(elemento => {
                        this.habilitarEdicion = true;
                        this.obtenerCatTipoIncidencia();
                        this.mostrarMensaje("Registró", elemento);
                    })
            } else {
                this.catalogoTipoIncidenciaService.editarCatTipoIncidencia (this.elementoGuarda)
                    .then(elemento => {
                        this.habilitarEdicion = true;
                        this.obtenerCatTipoIncidencia();
                        this.mostrarMensaje("Editó", this.elementoGuarda)
                        this.habilitarEdicion = false;
                    }, error => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al editar el elemento [" + this.elementoGuarda.idTipoIncidencia + "] " + this.elementoGuarda.tipoIncidencia); 
                        this.blockService.cleanBlock();
                    })
            }
        }
    }

    ejecutarBotonEditar() {
        // Agregar validaciones para cambio de IDS
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.idTipoIncidencia != null) {
            this.habilitarInputs = true;
            this.esNuevo = false;
            this.elementoGuarda = { ...this.elementoSeleccionado };
            this.menuBarActionService.asignarEstatusEditar();
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un elemento de la tabla");
        }
    }

    ejecutarBotonBorrar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.idTipoIncidencia != null && !this.esNuevo) {
            this.confirmationService.confirm({
                message: '¿Está seguro de eliminar el registro [' + this.elementoSeleccionado.idTipoIncidencia + '] ' + this.elementoSeleccionado.tipoIncidencia + ' ?',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () => {
                    this.blockService.setBlock();
                    this.catalogoTipoIncidenciaService.borrarCatTipoIncidencia(this.elementoSeleccionado)
                        .then(resultado => {
                            this.blockService.cleanBlock();
                            this.elementoEliminado()
                        }, error => {
                            this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el elemento [" + this.elementoSeleccionado.idTipoIncidencia + "] " + this.elementoSeleccionado.tipoIncidencia); this.blockService.cleanBlock();
                        });
                }
            });
        } else {
            this.mensajeService.mandarMensajeError("Debe estar editando un elemento para poder borrarlo");
        }
    }

    elementoEliminado(){
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputs = false;
        this.habilitarEdicion = false;
        this.mensajeService.mandarMensajeSuccess("Registro [" + this.elementoSeleccionado.idTipoIncidencia + "] " + this.elementoSeleccionado.tipoIncidencia + " eliminado correctamente");
        this.cancelar();
        this.obtenerCatTipoIncidencia();
    }

    mostrarMensaje(tipo: string, registro: tipoIncidenciaDTO) {
        this.habilitarInputs = false;
        this.habilitarEdicion = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.blockService.cleanBlock();
        this.mensajeService.mandarMensajeSuccess("Se " + tipo + " el elemento [" + registro.idTipoIncidencia + "] " + registro.tipoIncidencia + " correctamente")
        this.cancelar();
    }



    ejecutarBotonNuevo() {
        this.habilitarInputs = true;
        this.habilitarEdicion = true;
        this.cancelar();
    }

    ejecutarBotonCancelar() {
        this.habilitarInputs = false;
        this.habilitarEdicion = false
        this.cancelar();
    }

    cancelar() {
        this.esNuevo = true;
        this.elementoSeleccionado = {
            idTipoIncidencia: null,
            tipoIncidencia: null,
            dsTipoIncidencia: null,
        }
        this.tipoIncidenciaDTO = {
            idTipoIncidencia: null,
            tipoIncidencia: null,
            dsTipoIncidencia: null,
        }
        this.elementoGuarda = {
            idTipoIncidencia: null,
            tipoIncidencia: null,
            dsTipoIncidencia: null,
        };
    }


}
