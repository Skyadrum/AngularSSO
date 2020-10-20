import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/model/BaseComponent';

// Services
import { CatalogoSistemaService } from '@app/sso/service/catalogoSistema.service'
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { BlockService } from '@app/shared/service/Block.service';

// Models
import { OpcionSelect } from '@app/shared/model/Combo';
import { SistemaDTO } from '../../model/catalogoSistema';
import { ConfirmationService } from 'primeng/api';
import { ComboService } from '@app/shared/service/Combo.service';


@Component({
    selector: 'app-catalogo-sistema',
    templateUrl: './catalogoSistema.component.html'
})

export class CatalogoSistemaComponent extends BaseComponent implements OnInit {

    habilitarInputs: boolean;
    cols: any[];
    elementos: SistemaDTO[];
    elementoSeleccionado: SistemaDTO;
    esNuevo: boolean = true;
    listaSeguridad: OpcionSelect[]=[{value: "0", name: "Local"},{value: "1", name: "Delegada"}];
    opcionSeguridad: OpcionSelect;
    elementoGuarda: SistemaDTO;

    constructor(protected menuBarActionService: MenuBarActionService,
        protected menuHeaderService: MenuHeaderService,
        protected bitacoraService: BitacoraService,
        protected mensajeService: MensajeService,
        private blockService: BlockService,
        private catalogoSistemaService: CatalogoSistemaService,
        private confirmationService: ConfirmationService,
        private comboService: ComboService,
        ) {
        super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }

    ngOnInit(): void {
        this.cancelar();
        this.cols = [
            { field: "id", header: "Id" },
            { field: "sistema", header: "Sistema" },
            { field: "seguridadDelegada", header: "Seguridad" },
            { field: "sistemaActivo", header: "Sistema Activo" },
            { field: "dsSistema", header: "Descripción" },
        ];

        this.obtenerCatSistema();
    }

    ejecutarBotonNuevo() {
        this.habilitarInputs = true;
        this.cancelar();
    }

    ejecutarBotonEditar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.id != null) {
            this.habilitarInputs = true;
            this.esNuevo = false;
            this.elementoGuarda = { ...this.elementoSeleccionado };
            this.opcionSeguridad = this.comboService.asignarValorCombo(this.elementoGuarda.bolSeguridadDelegada, this.listaSeguridad);
            this.menuBarActionService.asignarEstatusEditar();
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un elemento de la tabla");
        }
    }

    obtenerCatSistema() {
        this.catalogoSistemaService.obtenerCatSistema().then(sistemas => this.crearTablaSistemas(sistemas), result => this.mensajeService.mandarMensajeError('Ocurrio un error al obtener CatSistema'));
    }

    crearTablaSistemas(lista: SistemaDTO[]) {
        for (let i = 0; i < lista.length; i++) {
            lista[i].sistemaActivo = (lista[i].bolSistemaActivo == 1 ? "Sí" : "No");
            lista[i].seguridadDelegada = (lista[i].bolSeguridadDelegada == 0 ? "Local" : "Delegada");
        }
        this.elementos = lista;
    }

    ejecutarBotonGuardar() {
        if (this.elementoGuarda != null) {

            this.blockService.setBlock();
            
            // Validacion
            if (this.elementoGuarda.sistema == null || this.elementoGuarda.sistema.trim() == ""){
                this.mensajeService.mandarMensajeError("El campo [Sistema] es requerido");
                this.blockService.cleanBlock();
                return;
            }

            this.elementoGuarda.bolSistemaActivo = (this.elementoGuarda.bolSistemaActivo ? 1 : 0);
            this.elementoGuarda.bolSeguridadDelegada = this.comboService.obtenerValorCombo(this.opcionSeguridad);

            if (this.esNuevo) {
                // Alta registro
                this.catalogoSistemaService.crearCatSistema(this.elementoGuarda)
                    .then(elemento => { this.obtenerCatSistema(); this.mostrarMensaje("Registró", elemento); }, resultado => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al guardar el elemento [" + this.elementoGuarda.id + "] " + this.elementoGuarda.sistema); this.blockService.cleanBlock();
                    });
            } else {
                // Edicion registro
                this.catalogoSistemaService.editarCatSistema(this.elementoGuarda)
                    .then(elemento => { this.obtenerCatSistema(); this.mostrarMensaje("Editó", this.elementoGuarda); }, resultado => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al editar el elemento [" + this.elementoGuarda.id + "] " + this.elementoGuarda.sistema); this.blockService.cleanBlock();
                    });
            }
        }
    }

    mostrarMensaje(tipo: string, registro: SistemaDTO) {
        this.habilitarInputs = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.blockService.cleanBlock();
        this.mensajeService.mandarMensajeSuccess("Se " + tipo + " el elemento [" + registro.id + "] " + registro.sistema + " correctamente")
        this.cancelar();
    }

    ejecutarBotonCancelar() {
        this.habilitarInputs = false;
        this.cancelar();
    }

    elementoEliminado() {
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputs = false;
        this.mensajeService.mandarMensajeSuccess("Registro [" + this.elementoSeleccionado.id + "] " + this.elementoSeleccionado.sistema + " eliminado correctamente");
        this.cancelar();
        this.obtenerCatSistema();
    }

    ejecutarBotonBorrar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.id != null && !this.esNuevo) {
            this.confirmationService.confirm({
                message: '¿Está seguro de eliminar el registro [' + this.elementoSeleccionado.id + '] ' + this.elementoSeleccionado.sistema + ' ?',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () =>
                {
                    this.blockService.setBlock();
                    this.catalogoSistemaService.borrarCatSistema(this.elementoGuarda)
                    .then(resultado => {
                        this.blockService.cleanBlock();
                        this.elementoEliminado()
                    }, estatus => { this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el elemento [" + this.elementoSeleccionado.id + "] " + this.elementoSeleccionado.sistema); this.blockService.cleanBlock(); }); 
                }
            } );
        } else {
            this.mensajeService.mandarMensajeError("Debe estar editando un elemento para poder borrarlo");
        }
    }

    cancelar() {
        this.esNuevo = true;
        this.elementoSeleccionado = {
            id: null,
            sistema: null,
            bolSeguridadDelegada: null,
            bolSistemaActivo: null,
            dsSistema: null,
            seguridadDelegada: null,
            sistemaActivo: null,
        }
        this.elementoGuarda = {
            id: null,
            sistema: null,
            bolSeguridadDelegada: null,
            bolSistemaActivo: null,
            dsSistema: null,
            seguridadDelegada: null,
            sistemaActivo: null,
        };
        this.opcionSeguridad = this.comboService.limpiarCombo();
    }
}