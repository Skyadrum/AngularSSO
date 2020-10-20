import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CatalogoAgrupadorTareas, CatalogoAgrupadorTareasGuarda } from '../../model/catalogoAgrupadorTareas';
import { CatalogoAgrupadorTareasService } from '../../service/catalogoAgrupadorTareas.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { BaseComponent } from '@app/shared/model/BaseComponent';

@Component({
    selector: 'app-catalogo-agrupador-tareas',
    templateUrl: './catalogoAgrupadorTareas.component.html'
})
export class CatalogoAgrupadorTareasComponent extends BaseComponent implements OnInit {

    agrupadorTarea: CatalogoAgrupadorTareas[];
    agrupadorTareaSeleccionado: CatalogoAgrupadorTareas = {
        idagrupadorTarea: null,
        agrupadorTarea: null,
        ordenAgrupadorTarea: null
    }
    agrupadorTareaGuarda: CatalogoAgrupadorTareasGuarda = {
        idAgrupadorTarea: null,
        agrupadorTarea: null,
        ordenAgrupadorTarea: null
    }
    cols: any[];
    esNuevo: boolean = true;
    habilitarInputs: boolean;

    constructor(
        protected menuHeaderService: MenuHeaderService,
        protected mensajeService: MensajeService,
        protected bitacoraService: BitacoraService,
        private messageService: MessageService,
        protected menuBarActionService: MenuBarActionService,
        private confirmationService: ConfirmationService,
        private catalogoAgrupadorTareasService: CatalogoAgrupadorTareasService)
         {  super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);}

    ngOnInit(): void {
        this.cols = [
            { field: "idagrupadorTarea", header: "Id Agrupador Tarea" },
            { field: "agrupadorTarea", header: "Agrupador Tarea" },
            { field: "ordenAgrupadorTarea", header: "Órden" },
        ];


        this.obtenerAgrupadorTareas();
    }

    obtenerAgrupadorTareaFormulario(agrupadorTareaSeleccionado: CatalogoAgrupadorTareas) {
        var agrupadorTarea = {
            idAgrupadorTarea: agrupadorTareaSeleccionado.idagrupadorTarea,
            agrupadorTarea: agrupadorTareaSeleccionado.agrupadorTarea,
            ordenAgrupadorTarea: agrupadorTareaSeleccionado.ordenAgrupadorTarea
        };
        return agrupadorTarea;
    }

    agrupadorTareaEliminado() {
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputs = false;
        this.mensajeService.mandarMensajeSuccess("Control Produccion [" + this.agrupadorTareaSeleccionado.idagrupadorTarea + "] " + this.agrupadorTareaSeleccionado.agrupadorTarea + " eliminado correctamente");
        this.cancelar();
        this.obtenerAgrupadorTareas();
    }

    cancelar() {
        this.esNuevo = true;
        this.agrupadorTareaGuarda = {
            idAgrupadorTarea: null,
            agrupadorTarea: null,
            ordenAgrupadorTarea: null
        };
        this.agrupadorTareaSeleccionado = {
            idagrupadorTarea: null,
            agrupadorTarea: null,
            ordenAgrupadorTarea: null
        }
    }

    obtenerAgrupadorTareas() {
        this.catalogoAgrupadorTareasService.obtenerAgrupadorTareas().then(agrupadorTareas => this.agrupadorTarea = agrupadorTareas, resultado => {
            this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener el Agrupador Tareas" });
        });
    }

    mostrarMensaje(tipo: string, actividad: CatalogoAgrupadorTareas) {
        this.habilitarInputs = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Se "+tipo+" el Agrupador Tarea ["+actividad.idagrupadorTarea+"] "+actividad.agrupadorTarea+" correctamente" });
        this.cancelar();
    }


    ejecutarBotonNuevo() {
        this.habilitarInputs = true;
        this.cancelar();
    }

    ejecutarBotonCancelar() {
      this.habilitarInputs = false;
      this.cancelar();
    }

    ejecutarBotonEditar() {
        if (this.agrupadorTareaSeleccionado != null && this.agrupadorTareaSeleccionado.idagrupadorTarea != null) {
            this.habilitarInputs = true;
            this.menuBarActionService.asignarEstatusEditar();
            this.esNuevo = false;
            this.agrupadorTareaGuarda = this.obtenerAgrupadorTareaFormulario(this.agrupadorTareaSeleccionado);
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un Agrupador Tarea  de la tabla");
        }
    }

    ejecutarBotonBorrar() {
      if (this.agrupadorTareaSeleccionado != null && this.agrupadorTareaSeleccionado.idagrupadorTarea != null) {
            this.confirmationService.confirm({
                message: '¿Está seguro de eliminar el Agrupador Tareas ['+this.agrupadorTareaSeleccionado.idagrupadorTarea+'] '+this.agrupadorTareaSeleccionado.agrupadorTarea+' ?',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () => {
                    this.catalogoAgrupadorTareasService.eliminarAgrupadorTareas(this.obtenerAgrupadorTareaFormulario(this.agrupadorTareaSeleccionado)).then(resultado => this.agrupadorTareaEliminado(), estatus => {
                      this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el Control de Producción [" + this.agrupadorTareaSeleccionado.idagrupadorTarea + "] " + this.agrupadorTareaSeleccionado.agrupadorTarea);
                    });
                }
            });
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un Agrupador Tareas de la tabla")
        }
    }


    ejecutarBotonGuardar() {
        if (this.agrupadorTareaGuarda != null) {
            if (this.esNuevo) {
                this.agrupadorTareaGuarda.idAgrupadorTarea = 0;
                // Alta registro
                this.catalogoAgrupadorTareasService.registrarAgrupadorTareas(this.agrupadorTareaGuarda).then(actividad => { this.obtenerAgrupadorTareas(); this.mostrarMensaje("registró", actividad) }, resultado => {
                    this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al guardar el Agrupador Tarea ["+this.agrupadorTareaGuarda.idAgrupadorTarea+"] "+this.agrupadorTareaGuarda.agrupadorTarea });
                });
            } else {
                // Edicion registro
                this.catalogoAgrupadorTareasService.editarAgrupadorTareas(this.agrupadorTareaGuarda).then(actividad => { this.obtenerAgrupadorTareas(); this.mostrarMensaje("editó", actividad) }, resultado => {
                    this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al editar el Agrupador Tarea ["+this.agrupadorTareaGuarda.idAgrupadorTarea+"] "+this.agrupadorTareaGuarda.agrupadorTarea });
                });
            }
        }
    }





}
