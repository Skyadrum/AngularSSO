import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/model/BaseComponent';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { ElementoCatalogo } from '@app/shared/model/Combo';
import { CatalogoGenericoService } from '@app/controlProduccion/service/catalogoGenerico.service';
import { ConfirmationService } from 'primeng/api';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { BlockService } from '@app/shared/service/Block.service';

@Component({
    selector: 'app-catalogo-estatus-control-produccion',
    templateUrl: './catalogoEstatusCtrlProd.component.html'
})
export class CatalogoEstatusCtrlProd extends BaseComponent implements OnInit {

    catalogos: any[];
    elementos: ElementoCatalogo[];
    elementoSeleccionado: ElementoCatalogo = {
        id: null,
        nombre: null,
        descripcion: null
    };
    elementoGuarda: ElementoCatalogo = {
        id: null,
        nombre: null,
        descripcion: null
    };
    cols: any[];
    esNuevo: boolean = true;
    catalogoController = "catalogoEstatusCtrlProd";
    habilitarInputs: boolean;

    constructor(
        protected menuHeaderService: MenuHeaderService,
        protected menuBarActionService: MenuBarActionService,
        protected mensajeService: MensajeService,
        protected bitacoraService: BitacoraService,
        private catalogoGenericoService: CatalogoGenericoService,
        private confirmationService: ConfirmationService,
        private blockService: BlockService,
    ) {
        super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }

    ngOnInit() {
        this.habilitarInputs = false;
        this.cols = [
            { field: "id", header: "Id" },
            { field: "nombre", header: "Nombre" },
            { field: "descripcion", header: "Descripción" },
        ];

        this.obtenerDatos();

    }

    ejecutarBotonNuevo() {
        this.habilitarInputs = true;
        this.cancelar();
    }
    
    ejecutarBotonCancelar() {
        this.habilitarInputs = false;
        this.cancelar();
    }

    elementoEliminado() {
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputs = false;
        this.mensajeService.mandarMensajeSuccess("Registro [" + this.elementoSeleccionado.id + "] " + this.elementoSeleccionado.nombre + " eliminado correctamente");
        this.cancelar();
        this.obtenerCatalogos();
    }

    ejecutarBotonBorrar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.id != null && !this.esNuevo) {
            this.confirmationService.confirm({
                message: '¿Está seguro de eliminar el registro [' + this.elementoSeleccionado.id + '] ' + this.elementoSeleccionado.nombre + ' ?',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () => {
                    this.blockService.setBlock();  
                    this.catalogoGenericoService.eliminarCatalogo(this.catalogoController, JSON.stringify({ id: this.elementoSeleccionado.id })).then(resultado => {this.blockService.cleanBlock(); this.elementoEliminado()}, estatus => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el elemento [" + this.elementoSeleccionado.id + "] " + this.elementoSeleccionado.nombre);this.blockService.cleanBlock();
                    });
                }
            });
        } else {
            this.mensajeService.mandarMensajeError("Debe estar editando un elemento para poder borrarlo");
        }
    }

    ejecutarBotonGuardar() {
        if (this.elementoGuarda != null) {
            this.blockService.setBlock()
            if (this.esNuevo) {
                // Alta registro
                this.catalogoGenericoService.registrarCatalogo(this.catalogoController, this.elementoGuarda).then(elemento => { this.obtenerDatos(); this.mostrarMensaje("Registró", elemento) }, resultado => {
                    this.mensajeService.mandarMensajeError("Ocurrió un error al guardar el elemento [" + this.elementoGuarda.id + "] " + this.elementoGuarda.nombre);
                    this.blockService.cleanBlock();
                });
            }
            else {
                // Edicion registro
                this.catalogoGenericoService.editarCatalogo(this.catalogoController, this.elementoGuarda).then(elemento => { this.obtenerDatos(); this.mostrarMensaje("Editó", elemento) }, resultado => {
                    this.mensajeService.mandarMensajeError("Ocurrió un error al editar el elemento [" + this.elementoGuarda.id + "] " + this.elementoGuarda.nombre);this.blockService.cleanBlock();
                });
            }
        }
    }

    mostrarMensaje(tipo: string, registro: ElementoCatalogo) {
        this.habilitarInputs = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.blockService.cleanBlock();
        this.mensajeService.mandarMensajeSuccess("Se " + tipo + " el elemento [" + registro.id + "] " + registro.nombre + " correctamente")
        this.cancelar();

    }

    obtenerDatos() {
        this.obtenerCatalogos();

    }

    obtenerCatalogos() {
        this.catalogoGenericoService.obtenerCatalogos(this.catalogoController).then(elementos => this.elementos = elementos, resultado => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el Catálogo");
        });
    }

    cancelar() {
        this.esNuevo = true;
        this.elementoGuarda = {
            id: null,
            nombre: null,
            descripcion: null
        };
        this.elementoSeleccionado = {
            id: null,
            nombre: null,
            descripcion: null
        };
    }

    ejecutarBotonEditar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.id != null) {
            this.habilitarInputs = true;
            this.esNuevo = false;
            this.elementoGuarda = { ...this.elementoSeleccionado };
            this.menuBarActionService.asignarEstatusEditar();
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un elemento de la tabla");
        }
    }

}