
import { Component, OnInit } from '@angular/core';
import { CatalogoActividades } from '@app/controlProduccion/model/catalogoActividades';
import { CatalogoAgrupadorTareas } from '@app/controlProduccion/model/catalogoAgrupadorTareas';
import { CatalogoColaborador } from '@app/controlProduccion/model/catalogoColaboradores';
import { CatalogoControlProduccion } from '@app/controlProduccion/model/catalogoControlProduccion';
import { CatalogoPlaneacionDTO, CatalogoTareaDTO } from '@app/controlProduccion/model/catalogoPlaneacionTareas';
import { BaseComponent } from '@app/shared/model/BaseComponent';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { CalendarService } from '@app/shared/service/Calendar.service';
import { ComboService } from '@app/shared/service/Combo.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { ConfirmationService } from 'primeng/api';
import { OpcionSelect, OpcionSelectAtributoExtra } from '../../model/catalogoGenerico';
import { CatalogoActividadesService } from '../../service/catalogoActividades.service';
import { CatalogoAgrupadorTareasService } from '../../service/catalogoAgrupadorTareas.service';
import { CatalogoColaboradoresService } from '../../service/catalogoColaboradores.service';
import { CatalogoControlProduccionService } from '../../service/catalogoControlProduccion.service';
import { CatalogoGenericoService } from '../../service/catalogoGenerico.service';
import { CatalogoTareaService } from '../../service/catalogoTarea.service';

@Component({
    selector: 'app-catalogo-planeacion-tareas',
    templateUrl: './catalogoPlaneacionTareas.component.html',
    styles: [
        '.bgBlue { background-color: #116fbf !important; color: #FFFFFF !important}',
        '.bgGray { background-color: #c8c8c8 !important; }',
        '.bgGray:nth-child(14n+17) { background-color: #c8c8c8 !important; }'
    ]
})
export class CatalogoPlaneacionTareasComponent extends BaseComponent implements OnInit {

    editandoTarea: boolean = false;
    controlesProducccionLista: OpcionSelectAtributoExtra[] = [];
    opcionSeleccionadaControlProduccion: OpcionSelectAtributoExtra;
    listaCatalogoAgrupadorTareas: OpcionSelect[] = [];
    opcionSeleccionadaAgrupadorTarea: OpcionSelect;
    listaCatalogoEtapa: OpcionSelect[] = [];
    opcionSeleccionadaEtapa: OpcionSelect;
    listaCatalogoColaboradores: OpcionSelect[] = [];
    opcionSeleccionadaColaborador: OpcionSelect;

    controlesProduccionGrid: CatalogoTareaDTO[];
    catalogoPlaneacionClonado: { [s: string]: CatalogoTareaDTO; } = {};
    listaActividades: CatalogoActividades[] = [];
    columnas: any[] = [];
    formatoFecha: string;
    es: any;
    catalogoPlaneacionTareasSeleccionado: CatalogoTareaDTO = {
        edit: false,
        idGridAutomatico: null,
        idTarea: null,
        idControlProduccion: null,
        tarea: null,
        descTarea: null,
        esfuerzoPlaneado: null,
        esfuerzoPlaneadoDesarrollo: null,
        etapa: null,
        idEtapa: null,
        agrupadorTarea: null,
        idAgrupadorTarea: null,
        orden: null,
        nota: null,
        responsable: null,
        responsableSelect: null,
        idResponsable: null,
        catPlaneacionList: [],
    };
    tareaGuarda: CatalogoTareaDTO = {
        edit: false,
        idGridAutomatico: null,
        idTarea: null,
        idControlProduccion: null,
        tarea: null,
        descTarea: null,
        esfuerzoPlaneado: null,
        esfuerzoPlaneadoDesarrollo: null,
        etapa: null,
        idEtapa: null,
        agrupadorTarea: null,
        idAgrupadorTarea: null,
        orden: null,
        nota: null,
        responsable: null,
        responsableSelect: null,
        idResponsable: null,
        catPlaneacionList: [],
    };

    constructor(
        protected menuHeaderService: MenuHeaderService,
        protected menuBarActionService: MenuBarActionService,
        protected mensajeService: MensajeService,
        protected bitacoraService: BitacoraService,
        private catalogoGenericoService: CatalogoGenericoService,
        private confirmationService: ConfirmationService,
        private catalogoControlProduccionService: CatalogoControlProduccionService,
        private catalogoTareaService: CatalogoTareaService,
        private catalogoAgrupadorTareasService: CatalogoAgrupadorTareasService,
        private comboService: ComboService,
        private catalogoActividadesService: CatalogoActividadesService,
        private catalogoColaboradoresService: CatalogoColaboradoresService,
        private calendarService: CalendarService,
    ) {
        super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }

    ngOnInit(): void {

        this.formatoFecha = this.calendarService.obtenerFormatoFecha();
        this.es = this.calendarService.obtenerIdioma();

        /*
        this.items = [
            {
                label: "Mover Arriba",
                icon: "pi pi-fw pi-arrow-up",
                command: () => this.moverTareaArriba()
            },
            {
                label: "Mover Abajo",
                icon: "pi pi-fw pi-arrow-down",
                command: () => this.moverTareaAbajo()
            },
            {
                label: "Calcular Planeación",
                icon: "pi pi-fw pi-chart-line",
                command: () => this.calcularTodaPlaneacion()
            },
        ];
*/

        this.obtenerComboControlesProduccion();
        this.obtenerComboAgrupadorTareas();
        this.obtenerComboEtapa();
        this.obtenerComboColaboradores();
    }

    obtenerCatalogoPlaneacionTareas() {
        this.catalogoTareaService.obtenerTareasPorIdControlProduccion(Number(this.opcionSeleccionadaControlProduccion.value)).then(tareas => this.crearGrid(tareas), resultado => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener las Tareas");
        });
    }

    obtenerComboControlesProduccion() {
        this.catalogoControlProduccionService.obtenerControlProduccion().then(controlProduccion => { this.controlesProducccionLista = this.crearListaComboControlProduccion(controlProduccion) }, resultado => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Controles de Producción");
        });
    }

    crearListaComboControlProduccion(lista: CatalogoControlProduccion[]) {
        let listaAux: OpcionSelectAtributoExtra[] = [];
        for (let i = 0; i < lista.length; i++) {
            listaAux.push({
                value: String(lista[i].idcontrolProduccion),
                name: "[" + lista[i].idcontrolProduccion + "] " + lista[i].controlProduccion,
                atributo: "[" + lista[i].idTemplate.idTemplate + "] " + lista[i].idTemplate.template
            });
        }
        return listaAux;
    }

    obtenerComboAgrupadorTareas() {
        this.catalogoAgrupadorTareasService.obtenerAgrupadorTareas().then(agrupadorTareas => { this.listaCatalogoAgrupadorTareas = this.crearListaAgrupadorTareas(agrupadorTareas) }, resultado => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Agrupadores Tarea");
        });
    }

    crearListaAgrupadorTareas(lista: CatalogoAgrupadorTareas[]) {
        let listaAux: OpcionSelect[] = [];
        for (let i = 0; i < lista.length; i++) {
            listaAux.push({
                value: String(lista[i].idagrupadorTarea),
                name: "[" + lista[i].idagrupadorTarea + "] " + lista[i].agrupadorTarea
            });
        }
        return listaAux;
    }

    obtenerComboEtapa() {
        this.catalogoGenericoService.obtenerCatalogos("catalogoEtapas").then(etapas => { this.listaCatalogoEtapa = this.comboService.crearListaComboBase(etapas) }, resultado => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener las Etapas");
        });
    }

    obtenerComboColaboradores() {
        this.catalogoColaboradoresService.obtenerColaboradores().then(colaboradores => { this.listaCatalogoColaboradores = this.crearListaColaboradores(colaboradores) }, resultado => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Colaboradores");
        });
    }

    crearListaColaboradores(lista: CatalogoColaborador[]) {
        let listaAux: OpcionSelect[] = [];
        for (let i = 0; i < lista.length; i++) {
            listaAux.push({
                value: String(lista[i].idColaborador),
                name: "[" + lista[i].isColaborador + "] " + lista[i].nombre + " " + lista[i].apellidoPaterno + " " + lista[i].apellidoMaterno
            });
        }
        return listaAux;
    }

    limpiarCatalogoPlaneacion() {
        this.controlesProduccionGrid = [];
        this.cancelar();
    }

    obtenerCatalogoActividades(elemento: OpcionSelectAtributoExtra) {
        let idTemplate = elemento.atributo.substring(1, elemento.atributo.indexOf("]"));
        this.catalogoActividadesService.obtenerActividadesPorIdTemplate(idTemplate).then(actividades => { this.listaActividades = actividades; this.obtenerCatalogoPlaneacionTareas(); }, resultado => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener las Etapas");
        });
    }

    cambiarControlProduccion(event) {
        this.menuBarActionService.asignarEstatusApertura();
        this.limpiarCatalogoPlaneacion();
        if (event != null && event.value != null && event.value.value != null) {
            this.obtenerCatalogoActividades(event.value);
        }
    }

    cancelar() {
        this.opcionSeleccionadaAgrupadorTarea = this.comboService.limpiarCombo();
        this.opcionSeleccionadaEtapa = this.comboService.limpiarCombo();
        this.opcionSeleccionadaColaborador = this.comboService.limpiarCombo();
        this.editandoTarea = false;
        this.catalogoPlaneacionTareasSeleccionado = {
            edit: false,
            idGridAutomatico: null,
            idTarea: null,
            idControlProduccion: null,
            tarea: null,
            descTarea: null,
            esfuerzoPlaneado: null,
            esfuerzoPlaneadoDesarrollo: null,
            etapa: null,
            idEtapa: null,
            agrupadorTarea: null,
            idAgrupadorTarea: null,
            orden: null,
            nota: null,
            responsable: null,
            responsableSelect: null,
            idResponsable: null,
            catPlaneacionList: [],
        };
        this.tareaGuarda = {
            edit: false,
            idGridAutomatico: null,
            idTarea: null,
            idControlProduccion: null,
            tarea: null,
            descTarea: null,
            esfuerzoPlaneado: null,
            esfuerzoPlaneadoDesarrollo: null,
            etapa: null,
            idEtapa: null,
            agrupadorTarea: null,
            idAgrupadorTarea: null,
            orden: null,
            nota: null,
            responsable: null,
            responsableSelect: null,
            idResponsable: null,
            catPlaneacionList: [],
        };
    }

    crearGrid(lista: CatalogoTareaDTO[]) {
        let columnas: any[] = [];
        for (let i = 0; i < this.listaActividades.length; i++) {
            columnas.push(
                { header: "Actividad" },
                { header: "Asignado a *" },
                { header: "% Planeado" },
                { header: "Esfuerzo Planeado hrs *" },
                { header: "Esfuerzo Planeado Manual" },
                { header: "Fecha Planeada Inicio *" },
                { header: "Fecha Planeada Fin *" },
            );
        }
        for (let i = 0; i < lista.length; i++) {
            lista[i].idGridAutomatico = i;
            // Agrupador Tareas
            for (let j = 0; j < this.listaCatalogoAgrupadorTareas.length; j++) {
                if (lista[i].idAgrupadorTarea == Number(this.listaCatalogoAgrupadorTareas[j].value)) {
                    lista[i].agrupadorTarea = this.listaCatalogoAgrupadorTareas[j].name;
                }
            }
            // Etapas
            for (let j = 0; j < this.listaCatalogoEtapa.length; j++) {
                if (lista[i].idEtapa == Number(this.listaCatalogoEtapa[j].value)) {
                    lista[i].etapa = this.listaCatalogoEtapa[j].name;
                }
            }

            lista[i].esfuerzoPlaneadoDesarrollo = 0;

            // Responsable
            for (let j = 0; j < this.listaCatalogoColaboradores.length; j++) {
                if (this.listaCatalogoColaboradores[j].value == String(lista[i].idResponsable)) {
                    lista[i].responsable = this.listaCatalogoColaboradores[j].name;
                    lista[i].responsableSelect = { name: this.listaCatalogoColaboradores[j].name, value: String(lista[i].idResponsable) };
                }
            }

            // Lista de Planeacion
            for (let k = 0; k < lista[i].catPlaneacionList.length; k++) {
                // Actividades
                for (let j = 0; j < this.listaActividades.length; j++) {
                    if (this.listaActividades[j].idactividad == lista[i].catPlaneacionList[k].idActividad) {
                        lista[i].catPlaneacionList[k].actividad = "[" + this.listaActividades[j].idactividad + "] " + this.listaActividades[j].actividad;
                        lista[i].catPlaneacionList[k].porcentage = this.listaActividades[j].peso + "%";
                    }
                }
                // Asignado A
                for (let j = 0; j < this.listaCatalogoColaboradores.length; j++) {
                    if (this.listaCatalogoColaboradores[j].value == String(lista[i].catPlaneacionList[k].asignadoA)) {
                        lista[i].catPlaneacionList[k].asignadoAGrid = this.listaCatalogoColaboradores[j].name;
                        lista[i].catPlaneacionList[k].asignadoASelect = { name: this.listaCatalogoColaboradores[j].name, value: String(lista[i].catPlaneacionList[k].asignadoA) };
                    }
                }
                // Fecha Inicio
                if (lista[i].catPlaneacionList[k].fechaInicioPlaneado != null) {
                    lista[i].catPlaneacionList[k].fechaInicioPlaneado = this.calendarService.obtenerDatePorFecha(lista[i].catPlaneacionList[k].fechaInicioPlaneado);
                }
                // Fecha Fin
                if (lista[i].catPlaneacionList[k].fechaTerminoPlaneado != null) {
                    lista[i].catPlaneacionList[k].fechaTerminoPlaneado = this.calendarService.obtenerDatePorFecha(lista[i].catPlaneacionList[k].fechaTerminoPlaneado);
                }
                // Manual
                lista[i].catPlaneacionList[k].manualBoolean = (lista[i].catPlaneacionList[k].manual == 1);
                // Esfuerzo planeado desarrollo
                lista[i].esfuerzoPlaneadoDesarrollo += lista[i].catPlaneacionList[k].esfuerzoPlaneado;
            }
        }
        this.columnas = columnas;
        this.controlesProduccionGrid = lista;
    }

    mandarMensaje(tipo: string) {
        this.menuBarActionService.asignarEstatusApertura();
        this.mensajeService.mandarMensajeSuccess('La Tarea se ha ' + tipo + ' correctamente');
        this.cancelar();
    }

    ejecutarBotonEditar() {
        if (this.opcionSeleccionadaControlProduccion != null) {
            if (this.catalogoPlaneacionTareasSeleccionado != null && this.catalogoPlaneacionTareasSeleccionado.idTarea != null) {
                this.seleccionarElemento();
                this.menuBarActionService.asignarEstatusEditar();
                this.mensajeService.mandarMensajeSuccess('Está editando la Tarea [' + this.catalogoPlaneacionTareasSeleccionado.idTarea + '] ' + (this.catalogoPlaneacionTareasSeleccionado.tarea != null ? this.catalogoPlaneacionTareasSeleccionado.tarea : ""));
            } else {
                this.mensajeService.mandarMensajeWarn("Seleccione una Tarea para editar");
            }
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un Control de Producción para editar una Tarea");
        }
    }

    ejecutarBotonNuevo() {
        if (this.opcionSeleccionadaControlProduccion != null) {
            if (!this.validarElementoPendiente() && !this.editandoTarea) {
                if (this.catalogoPlaneacionTareasSeleccionado != null && this.catalogoPlaneacionTareasSeleccionado.idTarea != null) {
                    // Agregar en la posicion siguiente del elemento seleccionado
                    let posicionSeleccionada = this.obtenerPosicionSeleccionada();
                    this.controlesProduccionGrid.splice(++posicionSeleccionada, 0, {
                        edit: false,
                        idGridAutomatico: this.generarIdGridAutomatico(),
                        idTarea: 0,
                        idControlProduccion: Number(this.opcionSeleccionadaControlProduccion.value),
                        tarea: null,
                        descTarea: null,
                        esfuerzoPlaneado: 0,
                        esfuerzoPlaneadoDesarrollo: 0,
                        etapa: null,
                        idEtapa: null,
                        agrupadorTarea: this.catalogoPlaneacionTareasSeleccionado.agrupadorTarea,
                        idAgrupadorTarea: this.catalogoPlaneacionTareasSeleccionado.idAgrupadorTarea,
                        orden: null,
                        nota: null,
                        responsable: null,
                        responsableSelect: null,
                        idResponsable: null,
                        catPlaneacionList: this.crearListaPlaneaciones()
                    });
                    this.catalogoPlaneacionTareasSeleccionado = this.controlesProduccionGrid[posicionSeleccionada];
                    this.seleccionarElemento();
                } else {
                    // Agrega en la ultima posicion si es que no se selecciono una tarea
                    this.controlesProduccionGrid.push({
                        edit: false,
                        idGridAutomatico: this.generarIdGridAutomatico(),
                        idTarea: 0,
                        idControlProduccion: Number(this.opcionSeleccionadaControlProduccion.value),
                        tarea: null,
                        descTarea: null,
                        esfuerzoPlaneado: 0,
                        esfuerzoPlaneadoDesarrollo: 0,
                        etapa: null,
                        idEtapa: null,
                        agrupadorTarea: null,
                        idAgrupadorTarea: null,
                        orden: null,
                        nota: null,
                        responsable: null,
                        responsableSelect: null,
                        idResponsable: null,
                        catPlaneacionList: this.crearListaPlaneaciones()
                    });
                    this.catalogoPlaneacionTareasSeleccionado = this.controlesProduccionGrid[this.controlesProduccionGrid.length - 1];
                    this.seleccionarElemento();
                }
                this.mensajeService.mandarMensajeSuccess("Se ha agregado una nueva Tarea");
            } else {
                this.mensajeService.mandarMensajeWarn("Tiene una Tarea pendiente de capturar, debe guardarla para agregar más");
            }
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un Control de Producción para agregar una Tarea");
        }
    }

    seleccionarElemento() {
        this.catalogoPlaneacionTareasSeleccionado.edit = true;
        this.editandoTarea = true;
        this.catalogoPlaneacionClonado[this.catalogoPlaneacionTareasSeleccionado.idTarea] = JSON.parse(JSON.stringify(this.catalogoPlaneacionTareasSeleccionado));
        this.opcionSeleccionadaAgrupadorTarea = this.comboService.asignarValorCombo(this.catalogoPlaneacionTareasSeleccionado.idAgrupadorTarea, this.listaCatalogoAgrupadorTareas);
        this.opcionSeleccionadaEtapa = this.comboService.asignarValorCombo(this.catalogoPlaneacionTareasSeleccionado.idEtapa, this.listaCatalogoEtapa);
    }

    crearListaPlaneaciones(): CatalogoPlaneacionDTO[] {
        let lista: CatalogoPlaneacionDTO[] = [];
        for (let i = 0; i < this.listaActividades.length; i++) {
            lista.push({
                idPlaneacion: 0,
                fechaInicioPlaneado: null,
                fechaTerminoPlaneado: null,
                esfuerzoPlaneado: 0,
                asignadoASelect: null,
                asignadoAGrid: null,
                asignadoA: null,
                fechaAsignacion: null,
                idEstatusTarea: 1,
                actividad: "[" + this.listaActividades[i].idactividad + "] " + this.listaActividades[i].actividad,
                idActividad: this.listaActividades[i].idactividad,
                idTarea: 0,
                porcentage: this.listaActividades[i].peso + "%",
                manual: 0,
                manualBoolean: false
            });
        }
        return lista;
    }

    validarElementoPendiente() {
        for (let i = 0; i < this.controlesProduccionGrid.length; i++) {
            if (this.controlesProduccionGrid[i].idTarea == 0) {
                return true;
            }
        } return false;
    }

    obtenerPosicionSeleccionada() {
        for (let i = 0; i < this.controlesProduccionGrid.length; i++) {
            if (this.catalogoPlaneacionTareasSeleccionado.idTarea == this.controlesProduccionGrid[i].idTarea) {
                return i;
            }
        }
    }

    generarIdGridAutomatico(): number {
        let idGridAutomatico = 0;
        for (let i = 0; i < this.controlesProduccionGrid.length; i++) {
            if (idGridAutomatico < this.controlesProduccionGrid[i].idGridAutomatico) {
                idGridAutomatico = this.controlesProduccionGrid[i].idGridAutomatico;
            }
        } ++idGridAutomatico
        return idGridAutomatico;
    }

    ejecutarBotonGuardar() {
        if (this.opcionSeleccionadaControlProduccion != null) {
            if (this.editandoTarea) {
                let indiceElementoSeleccionado = this.obtenerPosicionSeleccionada();
                this.controlesProduccionGrid[indiceElementoSeleccionado].idAgrupadorTarea = this.comboService.obtenerValorCombo(this.opcionSeleccionadaAgrupadorTarea);
                this.controlesProduccionGrid[indiceElementoSeleccionado].idEtapa = this.comboService.obtenerValorCombo(this.opcionSeleccionadaEtapa);
                this.tareaGuarda = JSON.parse(JSON.stringify(this.controlesProduccionGrid[indiceElementoSeleccionado]));

                let listaTareas = this.calcularOrdenTareas();
                if (this.tareaGuarda.idTarea == 0) {
                    // Nuevo
                    this.catalogoTareaService.guardarTareas(listaTareas).then(respuesta => { this.obtenerCatalogoPlaneacionTareas(); this.mandarMensaje("registrado") }, resultado => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al registrar la Tarea [" + this.tareaGuarda.idTarea + "] " + this.tareaGuarda.tarea);
                    });
                } else {
                    // Edicion
                    this.catalogoTareaService.guardarTareas(listaTareas).then(respuesta => { this.obtenerCatalogoPlaneacionTareas(); this.mandarMensaje("editado") }, resultado => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al editar la Tarea [" + this.tareaGuarda.idTarea + "] " + this.tareaGuarda.tarea);
                    });
                }
            } else {
                this.mensajeService.mandarMensajeWarn("Debe estar editando una Tarea para utilizar esta opción");
            }
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un Control de Producción para guardar una Tarea");
        }
    }

    ejecutarBotonBorrar() {
        if (this.opcionSeleccionadaControlProduccion != null) {
            if (this.catalogoPlaneacionTareasSeleccionado != null && this.catalogoPlaneacionTareasSeleccionado.idTarea != null) {
                let indiceElementoSeleccionado = this.obtenerPosicionSeleccionada();
                this.tareaGuarda = JSON.parse(JSON.stringify(this.controlesProduccionGrid[indiceElementoSeleccionado]));
                if (this.tareaGuarda != null && this.tareaGuarda.idTarea != null) {
                    this.confirmationService.confirm({
                        message: '¿Está seguro de eliminar la Tarea [' + this.tareaGuarda.idTarea + '] ' + (this.tareaGuarda.tarea != null ? this.tareaGuarda.tarea : "") + ' y toda su Planeación?',
                        acceptLabel: 'Aceptar',
                        rejectLabel: 'Cancelar',
                        accept: () => {
                            this.catalogoTareaService.borrarTareas(this.tareaGuarda).then(resultado => this.tareaEliminada(this.tareaGuarda), estatus => {
                                this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar la Tarea [" + this.tareaGuarda.idTarea + "] " + this.tareaGuarda.tarea);
                            });
                        }
                    });
                } else {
                    this.mensajeService.mandarMensajeWarn("Seleccione una Tarea de la tabla, la tarea debe haber sido guardada con anterioridad");
                }
            } else {
                this.mensajeService.mandarMensajeWarn("Debe seleccionar una Tarea para eliminarla");
            }
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un Control de Producción para eliminar una Tarea");
        }
    }

    tareaEliminada(catalogoPlaneacion: any) {
        this.menuBarActionService.asignarEstatusApertura();
        this.mensajeService.mandarMensajeSuccess("Tarea [" + catalogoPlaneacion.idTarea + "] " + (catalogoPlaneacion.tarea != null ? catalogoPlaneacion.tarea : "") + " eliminada correctamente");
        this.cancelar();
        this.obtenerCatalogoPlaneacionTareas();
    }

    ejecutarBotonCancelar() {
        if (this.opcionSeleccionadaControlProduccion != null) {
            if (this.editandoTarea) {
                this.mensajeService.mandarMensajeSuccess("Se ha cancelado la edición de la Tarea [" + this.catalogoPlaneacionTareasSeleccionado.idTarea + "] " + (this.catalogoPlaneacionTareasSeleccionado.tarea != null ? this.catalogoPlaneacionTareasSeleccionado.tarea : ""));
                let indiceElementoSeleccionado = this.obtenerPosicionSeleccionada();
                this.controlesProduccionGrid[indiceElementoSeleccionado] = JSON.parse(JSON.stringify(this.catalogoPlaneacionClonado[this.catalogoPlaneacionTareasSeleccionado.idTarea]));
                this.controlesProduccionGrid[indiceElementoSeleccionado].edit = false;
                delete this.catalogoPlaneacionClonado[this.catalogoPlaneacionTareasSeleccionado.idTarea];
                if (this.controlesProduccionGrid[indiceElementoSeleccionado].idTarea == 0) {
                    this.controlesProduccionGrid.splice(indiceElementoSeleccionado, 1);
                }
                this.cancelar();
            } else {
                this.mensajeService.mandarMensajeWarn("Debe estar editando una Tarea para utilizar esta opción");
            }
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un Control de Producción para cancelar la edición de una Tarea");
        }
    }

    cambiarColaborador(planeacion: CatalogoPlaneacionDTO) {
        if (planeacion.asignadoASelect != null) {
            planeacion.asignadoAGrid = planeacion.asignadoASelect.name;
            planeacion.asignadoA = Number(planeacion.asignadoASelect.value);
        } else {
            planeacion.asignadoAGrid = null;
            planeacion.asignadoA = null;
        }
    }

    cambiarResponsable(tarea: CatalogoTareaDTO) {
        if (tarea.responsableSelect != null) {
            tarea.responsable = tarea.responsableSelect.name;
            tarea.idResponsable = Number(tarea.responsableSelect.value);
        } else {
            tarea.responsable = null;
            tarea.idResponsable = null;
        }
    }

    ejecutarBotonEjecutar() {
        if (this.opcionSeleccionadaControlProduccion != null) {
            if (!this.editandoTarea) {
                this.confirmationService.confirm({
                    message: '¿Está seguro de Calcular toda la Planeación? Esto actualizará las horas capturadas de todas las Actividades dentro de este Control de Producción',
                    acceptLabel: 'Aceptar',
                    rejectLabel: 'Cancelar',
                    accept: () => {
                        for (let i = 0; i < this.controlesProduccionGrid.length; i++) {
                            this.calcularEsfuerzoPlaneacion(this.controlesProduccionGrid[i]);
                        }
                        this.catalogoTareaService.guardarTareas(this.controlesProduccionGrid).then(respuesta => { this.obtenerCatalogoPlaneacionTareas(); this.mensajeService.mandarMensajeSuccess("Se ha calculado toda la planeación para el Control de Producción " + this.opcionSeleccionadaControlProduccion.name); }, resultado => {
                            this.mensajeService.mandarMensajeError("Ocurrió un error al Calcular la Planeación");
                        });
                    }
                });
            } else {
                this.mensajeService.mandarMensajeWarn("No debe estar editando una Tarea para utilizar esta opción");
            }
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un Control de Producción para Calcular la Planeación");
        }
    }

    calcularEsfuerzoPlaneacion(tarea: CatalogoTareaDTO) {
        if (tarea.esfuerzoPlaneado != null && tarea.esfuerzoPlaneado > 0) {
            for (let i = 0; i < tarea.catPlaneacionList.length; i++) {
                for (let j = 0; j < this.listaActividades.length; j++) {
                    if (tarea.catPlaneacionList[i].idActividad == this.listaActividades[j].idactividad && tarea.catPlaneacionList[i].manualBoolean == false) {
                        if (this.listaActividades[j].peso > 0) {
                            tarea.catPlaneacionList[i].esfuerzoPlaneado = Number(((this.listaActividades[j].peso / 100) * tarea.esfuerzoPlaneado).toFixed(2));

                        } else {
                            tarea.catPlaneacionList[i].esfuerzoPlaneado = 0;
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < tarea.catPlaneacionList.length; i++) {
                tarea.catPlaneacionList[i].esfuerzoPlaneado = 0;
            }
        }
        this.calcularEsfuerzoDesarrollo(tarea);
    }

    calcularEsfuerzoActividad(planeacion: CatalogoPlaneacionDTO, tarea: CatalogoTareaDTO) {
        planeacion.manual = (planeacion.manualBoolean ? 1 : 0);
        if (planeacion.manualBoolean) {
            planeacion.esfuerzoPlaneado = 0;
        } else {
            for (let j = 0; j < this.listaActividades.length; j++) {
                if (planeacion.idActividad == this.listaActividades[j].idactividad) {
                    if (this.listaActividades[j].peso > 0) {
                        planeacion.esfuerzoPlaneado = Number(((this.listaActividades[j].peso / 100) * tarea.esfuerzoPlaneado).toFixed(2));
                    } else {
                        planeacion.esfuerzoPlaneado = 0;
                    }
                }
            }
        }
        this.calcularEsfuerzoDesarrollo(tarea);
    }

    asignarPlaneacionManual(planeacion: CatalogoPlaneacionDTO, tarea: CatalogoTareaDTO) {
        planeacion.manual = 1;
        planeacion.manualBoolean = true;
        this.calcularEsfuerzoDesarrollo(tarea);
    }

    calcularEsfuerzoDesarrollo(tarea: CatalogoTareaDTO) {
        let sumaEsfuerzo = 0;
        for (let i = 0; i < tarea.catPlaneacionList.length; i++) {
            sumaEsfuerzo += tarea.catPlaneacionList[i].esfuerzoPlaneado;
        }
        tarea.esfuerzoPlaneadoDesarrollo = sumaEsfuerzo;
    }

    ejecutarBotonArriba() {
        if (this.opcionSeleccionadaControlProduccion != null) {
            if (this.catalogoPlaneacionTareasSeleccionado.idTarea != null) {
                if (!this.editandoTarea) {
                    let indiceElementoSeleccionado = this.obtenerPosicionSeleccionada();
                    if (indiceElementoSeleccionado == 0) {
                        this.mensajeService.mandarMensajeWarn("La Tarea no se puede mover más arriba");
                    } else {
                        // Cambio los indices
                        let indiceDisminuido = indiceElementoSeleccionado - 1;
                        let tareaAux = JSON.parse(JSON.stringify(this.controlesProduccionGrid[indiceDisminuido]));
                        this.controlesProduccionGrid[indiceDisminuido] = JSON.parse(JSON.stringify(this.controlesProduccionGrid[indiceElementoSeleccionado]));
                        this.controlesProduccionGrid[indiceElementoSeleccionado] = tareaAux;
                        // Mando a calcular los ordenes de nuevo
                        let listaTareas = this.calcularOrdenTareas();
                        // Mando a guardar todas
                        this.catalogoTareaService.guardarTareas(listaTareas).then(respuesta => { this.obtenerCatalogoPlaneacionTareas(); this.mandarMensaje("movido arriba") }, resultado => {
                            this.mensajeService.mandarMensajeError("Ocurrió un error al mover la Tarea [" + this.tareaGuarda.idTarea + "] " + this.tareaGuarda.tarea);
                        });
                    }
                } else {
                    this.mensajeService.mandarMensajeWarn("No debe estar editando una Tarea para utilizar esta opción");
                }
            } else {
                this.mensajeService.mandarMensajeWarn("Seleccione un elemento de la tabla para Mover Arriba una Tarea");
            }
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un Control de Producción para Mover Arriba una Tarea");
        }
    }

    ejecutarBotonAbajo() {
        if (this.opcionSeleccionadaControlProduccion != null) {
            if (this.catalogoPlaneacionTareasSeleccionado.idTarea != null) {
                if (!this.editandoTarea) {
                    let indiceElementoSeleccionado = this.obtenerPosicionSeleccionada();
                    if (indiceElementoSeleccionado == this.controlesProduccionGrid.length - 1) {
                        this.mensajeService.mandarMensajeWarn("La Tarea no se puede mover más abajo");
                    } else {
                        // Cambio los indices
                        let indiceAumentado = indiceElementoSeleccionado + 1;
                        let tareaAux = JSON.parse(JSON.stringify(this.controlesProduccionGrid[indiceAumentado]));
                        this.controlesProduccionGrid[indiceAumentado] = JSON.parse(JSON.stringify(this.controlesProduccionGrid[indiceElementoSeleccionado]));
                        this.controlesProduccionGrid[indiceElementoSeleccionado] = tareaAux;
                        // Mando a calcular los ordenes de nuevo
                        let listaTareas = this.calcularOrdenTareas();
                        // Mando a guardar todas
                        this.catalogoTareaService.guardarTareas(listaTareas).then(respuesta => { this.obtenerCatalogoPlaneacionTareas(); this.mandarMensaje("movido abajo") }, resultado => {
                            this.mensajeService.mandarMensajeError("Ocurrió un error al mover la Tarea [" + this.tareaGuarda.idTarea + "] " + this.tareaGuarda.tarea);
                        });
                    }
                } else {
                    this.mensajeService.mandarMensajeWarn("No debe estar editando una Tarea para utilizar esta opción");
                }
            } else {
                this.mensajeService.mandarMensajeWarn("Seleccione un elemento de la tabla para Mover Abajo una Tarea");
            }
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un Control de Producción para Mover Abajo una Tarea");
        }
    }

    calcularOrdenTareas(): CatalogoTareaDTO[] {
        let orden = 0;
        let tareasGuarda: CatalogoTareaDTO[] = [];
        for (let i = 0; i < this.controlesProduccionGrid.length; i++) {
            if (this.catalogoPlaneacionTareasSeleccionado.idAgrupadorTarea == this.controlesProduccionGrid[i].idAgrupadorTarea) {
                this.controlesProduccionGrid[i].orden = ++orden;
                tareasGuarda.push(JSON.parse(JSON.stringify(this.controlesProduccionGrid[i])));

            }
        }
        return tareasGuarda;
    }

}