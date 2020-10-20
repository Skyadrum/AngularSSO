import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ComboService } from '@app/shared/service/Combo.service';
import { CatalogoActividades, CatalogoActividadesGuarda } from '@app/controlProduccion/model/catalogoActividades';
import { OpcionSelect } from '@app/shared/model/Combo';
import { CatalogoActividadesService } from '@app/controlProduccion/service/catalogoActividades.service';
import { CatalogoGenericoService } from '@app/controlProduccion/service/catalogoGenerico.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { BaseComponent } from '@app/shared/model/BaseComponent';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';

@Component({
    selector: 'app-catalogo-actividades',
    templateUrl: './catalogoActividades.component.html'
})
export class CatalogoActividadesComponent extends BaseComponent implements OnInit {

    actividades: CatalogoActividades[];
    actividadSeleccionada: CatalogoActividades = {
        idactividad: null,
        actividad: null,
        dsactividad: null,
        peso: null,
        tipoTarea: null,
        idtipoTarea: {
            idtipoTarea: null,
            tipoTarea: null,
            dstipoTarea: null
        },
        actividadPredecesor: null,
        idActividadPredecesor: null,
        trabajoParaleloString: null,
        trabajoParalelo: null,
        template: null,
        idTemplate: {
            idTemplate: null,
            template: null,
            descTemplate: null,
        }
    };
    actividadGuarda: CatalogoActividadesGuarda = {
        idActividad: null,
        actividad: null,
        descActividad: null,
        peso: null,
        idTipoTarea: null,
        idActividadPredecesor: null,
        trabajoParalelo: 0,
        idTemplate: null,
    }
    cols: any[];
    items: MenuItem[];
    columnasExportar: any[];
    esNuevo: boolean = true;
    habilitarInputs: boolean;

    listaTarea: OpcionSelect[] = [];
    opcionSeleccionadaTarea: OpcionSelect;

    listaActividades: OpcionSelect[] = [];
    opcionSeleccionadaActividad: OpcionSelect;

    listaTemplate: OpcionSelect[] = [];
    opcionSeleccionadaTemplate: OpcionSelect;

    opcionSeleccionadaParalelo: Boolean = false;

    constructor(private catalogoActividadesService: CatalogoActividadesService,
        protected menuHeaderService: MenuHeaderService,
        protected mensajeService: MensajeService,
        protected bitacoraService: BitacoraService,
        protected menuBarActionService: MenuBarActionService,
        private catalogoGenericoService: CatalogoGenericoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private comboService: ComboService)
        {
          super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
         }

    ngOnInit(): void {
        this.cols = [
            { field: "idactividad", header: "Id Actividad" },
            { field: "actividad", header: "Actividad" },
            { field: "dsactividad", header: "Descripción" },
            { field: "peso", header: "Peso %" },
            { field: "tipoTarea", header: "Tipo tarea" },
            { field: "template", header: "Template" },
            { field: "actividadPredecesor", header: "Actividad Predecesor" },
            { field: "trabajoParaleloString", header: "Trabajar en Paralelo" },
        ];

        this.obtenerActividades();
        this.obtenerComboTipoTarea();
        this.obtenerComboTemplate();
    }

    obtenerActividadFormulario(actividadSeleccionada: CatalogoActividades) {
        let actividad = {
            idActividad: actividadSeleccionada.idactividad,
            actividad: actividadSeleccionada.actividad,
            descActividad: actividadSeleccionada.dsactividad,
            peso: actividadSeleccionada.peso,
            idTipoTarea: actividadSeleccionada.idtipoTarea.idtipoTarea,
            idActividadPredecesor: actividadSeleccionada.idActividadPredecesor,
            trabajoParalelo: actividadSeleccionada.trabajoParalelo,
            idTemplate: actividadSeleccionada.idTemplate.idTemplate
        };
        return actividad;
    }

    actividadEliminada() {
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputs = false;
        this.mensajeService.mandarMensajeSuccess("Control Produccion [" + this.actividadSeleccionada.idactividad + "] " + this.actividadSeleccionada.actividad + " eliminado correctamente");
        this.cancelar();
        this.obtenerActividades();
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
        if (this.actividadSeleccionada != null && this.actividadSeleccionada.idactividad != null) {
            this.habilitarInputs = true;
            this.esNuevo = false;
            this.actividadGuarda = this.obtenerActividadFormulario(this.actividadSeleccionada);
            this.opcionSeleccionadaTarea = this.comboService.asignarValorCombo(this.actividadGuarda.idTipoTarea, this.listaTarea);
            this.opcionSeleccionadaActividad = this.comboService.asignarValorCombo(this.actividadGuarda.idActividadPredecesor, this.listaActividades);
            this.opcionSeleccionadaTemplate = this.comboService.asignarValorCombo(this.actividadGuarda.idTemplate, this.listaTemplate);
            this.opcionSeleccionadaParalelo = (this.actividadGuarda.trabajoParalelo == 1);
            this.menuBarActionService.asignarEstatusEditar();
        } else {
  this.mensajeService.mandarMensajeWarn("Seleccione una Actividad  de la tabla");        }
    }

    ejecutarBotonBorrar() {
        if (this.actividadSeleccionada != null && this.actividadSeleccionada.idactividad != null) {
            this.confirmationService.confirm({
                message: '¿Está seguro de eliminar la Actividad [' + this.actividadSeleccionada.idactividad + '] ' + this.actividadSeleccionada.actividad + ' ?',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () => {
                    this.catalogoActividadesService.eliminarActividad(this.obtenerActividadFormulario(this.actividadSeleccionada)).then(resultado => this.actividadEliminada(), estatus => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el Control de Producción [" + this.actividadSeleccionada.idactividad + "] " + this.actividadSeleccionada.actividad);
                    });
                }
            });
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione una Actividad de la tabla")
        }
    }

    cancelar() {
        this.esNuevo = true;
        this.opcionSeleccionadaTarea = this.comboService.limpiarCombo();
        this.opcionSeleccionadaActividad = this.comboService.limpiarCombo();
        this.opcionSeleccionadaTemplate = this.comboService.limpiarCombo();
        this.opcionSeleccionadaParalelo = false;
        this.actividadGuarda = {
            idActividad: null,
            actividad: null,
            descActividad: null,
            peso: null,
            idTipoTarea: null,
            idActividadPredecesor: null,
            trabajoParalelo: 0,
            idTemplate: null,
        };
        this.actividadSeleccionada = {
            idactividad: null,
            actividad: null,
            dsactividad: null,
            peso: null,
            tipoTarea: null,
            idtipoTarea: {
                idtipoTarea: null,
                tipoTarea: null,
                dstipoTarea: null
            },
            actividadPredecesor: null,
            idActividadPredecesor: null,
            trabajoParaleloString: null,
            trabajoParalelo: null,
            template: null,
            idTemplate: {
                idTemplate: null,
                template: null,
                descTemplate: null,
            }
        };
    }

    ejecutarBotonGuardar() {
        if (this.actividadGuarda != null) {
            this.actividadGuarda.idTipoTarea = this.comboService.obtenerValorCombo(this.opcionSeleccionadaTarea);
            this.actividadGuarda.idActividadPredecesor = this.comboService.obtenerValorCombo(this.opcionSeleccionadaActividad);
            this.actividadGuarda.idTemplate = this.comboService.obtenerValorCombo(this.opcionSeleccionadaTemplate);
            this.actividadGuarda.trabajoParalelo = (this.opcionSeleccionadaParalelo ? 1 : 0);
            if (this.esNuevo) {
                this.actividadGuarda.idActividad = 0;
                // Alta registro
                this.catalogoActividadesService.registrarActividad(this.actividadGuarda).then(actividad => { this.obtenerActividades(); this.mostrarMensaje("registró", actividad) }, resultado => {
                    this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al guardar la Actividad [" + this.actividadGuarda.idActividad + "] " + this.actividadGuarda.actividad });
                });
            } else {
                // Edicion registro
                this.catalogoActividadesService.editarActividad(this.actividadGuarda).then(actividad => { this.obtenerActividades(); this.mostrarMensaje("editó", actividad) }, resultado => {
                    this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al editar la Actividad [" + this.actividadGuarda.idActividad + "] " + this.actividadGuarda.actividad });
                });
            }
        }
    }

    mostrarMensaje(tipo: string, actividad: CatalogoActividades) {
        this.habilitarInputs = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Se " + tipo + " la Actividad [" + actividad.idactividad + "] " + actividad.actividad + " correctamente" });
        this.cancelar();

    }

    obtenerActividades() {
        this.catalogoActividadesService.obtenerActividades().then(actividades => this.crearListaActividades(actividades), resultado => {
            this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener las Actividades" });
        });
    }

    crearListaActividades(lista: CatalogoActividades[]) {
        let listaActividadesAux = [];
        for (var i = 0; i < lista.length; i++) {
            lista[i].tipoTarea = "[" + lista[i].idtipoTarea.idtipoTarea + "] " + lista[i].idtipoTarea.tipoTarea;
            lista[i].actividadPredecesor = (lista[i].idActividadPredecesor != null) ? ("[" + lista[i].idActividadPredecesor + "] " + this.obtenerTextoActividad(lista[i].idActividadPredecesor, lista)) : "";
            lista[i].template = "[" + lista[i].idTemplate.idTemplate + "] " + lista[i].idTemplate.template;
            lista[i].trabajoParaleloString = (lista[i].trabajoParalelo == 0) ? "" : "Sí";
            listaActividadesAux.push({
                value: String(lista[i].idactividad),
                name: "[" + lista[i].idactividad + "] " + lista[i].actividad
            });
        }
        this.actividades = lista;
        this.listaActividades = listaActividadesAux;
    }

    obtenerTextoActividad(id: number, lista: CatalogoActividades[]) {
        for (var i = 0; i < lista.length; i++) {
            if (lista[i].idactividad == id) {
                return lista[i].actividad;
            }
        }
        return "";
    }

    obtenerComboTemplate() {
        this.catalogoGenericoService.obtenerCatalogos("catalogoTemplate").then(templates => { this.listaTemplate = this.comboService.crearListaComboBase(templates) }, resultado => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener el template" });
        })
      }

    obtenerComboTipoTarea() {
        this.catalogoGenericoService.obtenerCatalogos("catalogoTiposTarea").then(tipoTarea => { this.listaTarea = this.comboService.crearListaComboBase(tipoTarea) }, resultado => {
            this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener los Tipos Tarea" });
        })
    }

}
