import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { BaseComponent } from '@app/shared/model/BaseComponent';
import { OnInit, Component } from '@angular/core';
import { OpcionSelect } from '@app/shared/model/Combo';
import { CatalogoPlaneacionService } from '@app/controlProduccion/service/catalogoPlaneacion.service';
import { TreeNode, ConfirmationService } from 'primeng/api';
import { CatalogoProyectoGuarda, CatalogoProyecto } from '@app/controlProduccion/model/catalogoProyecto';
import { ComboService } from '@app/shared/service/Combo.service';
import { CatalogoGenericoService } from '@app/controlProduccion/service/catalogoGenerico.service';
import { CatalogoColaboradoresService } from '@app/controlProduccion/service/catalogoColaboradores.service';
import { CatalogoProyectoService } from '@app/controlProduccion/service/catalogoProyecto.service';
import { BlockService } from '@app/shared/service/Block.service';
import { CatalogoControlProduccionGuarda, CatalogoControlProduccion, CatalogoControlProduccionDTO } from '@app/controlProduccion/model/catalogoControlProduccion';
import { CatalogoControlProduccionService } from '@app/controlProduccion/service/catalogoControlProduccion.service';

@Component({
    templateUrl: './catalogoPlaneacion.component.html',
})
export class CatalogoPlaneacionComponent extends BaseComponent implements OnInit {

    PROYECTO: string = "Proyecto";
    CONTROL_PRODUCCION: string = this.PROYECTO + " / Control Producción";
    AGRUPADOR_TAREA: string = this.CONTROL_PRODUCCION + " / Agrupador Tarea";
    TAREA: string = this.AGRUPADOR_TAREA + " / Tarea";

    ruta: string = this.PROYECTO;

    listaProyecto: OpcionSelect[] = [];
    opcionSeleccionadaProyecto: OpcionSelect;
    menuArbol: TreeNode[] = [];
    elementoSeleccionadoArbol: TreeNode;

    /* Proyecto */
    columnasProyecto: any[];
    gridProyecto: CatalogoProyecto[] = [];
    esNuevoProyecto: boolean = true;
    habilitarInputsProyecto: boolean;

    listaCliente: OpcionSelect[] = [];
    opcionSeleccionadaCliente: OpcionSelect;

    listaPL: OpcionSelect[] = [];
    opcionSeleccionadaPL: OpcionSelect;

    listaADM: OpcionSelect[] = [];
    opcionSeleccionadaADM: OpcionSelect;

    listaTL: OpcionSelect[] = [];
    opcionSeleccionadaTL: OpcionSelect;

    listaDM: OpcionSelect[] = [];
    opcionSeleccionadaDM: OpcionSelect;

    listaPM: OpcionSelect[] = [];
    opcionSeleccionadaPM: OpcionSelect;

    proyectoSeleccionado: CatalogoProyecto = {
        idProyecto: null,
        wbs: null,
        proyecto: null,
        projectLeader: null,
        projectLeaderGrid: null,
        deliveryManager: null,
        deliveryManagerGrid: null,
        adm: null,
        admGrid: null,
        practiceManager: null,
        practiceManagerGrid: null,
        clientes: null,
        idCliente: {
            idcliente: null,
            cliente: null,
            dscliente: null,
        }
    };

    proyectoGuarda: CatalogoProyectoGuarda = {
        idProyecto: null,
        wbs: null,
        proyecto: null,
        projectLeader: null,
        deliveryManager: null,
        adm: null,
        practiceManager: null,
        idCliente: null,
    };

    /* Control Produccion */
    columnasCP: any[];
    gridCP: CatalogoControlProduccionDTO[] = [];
    habilitarInputsControlProduccion: boolean = true;
    esNuevoCP: boolean = true;

    opcionSeleccionadaProyectoCP: OpcionSelect;

    listaEstatusCP: OpcionSelect[] = [];
    opcionSeleccionadaEstatusCP: OpcionSelect;

    listaTemplate: OpcionSelect[] = [];
    opcionSeleccionadaTemplate: OpcionSelect;

    controlProduccionGuarda: CatalogoControlProduccionGuarda = {
        controlProduccion: null,
        idProyecto: null,
        idControlProduccion: null,
        idEstatusCtrlProd: null,
        descControlProduccion: null,
        idTemplate: null
    }

    controlProduccionSeleccionado: CatalogoControlProduccion = {
        controlProduccion: null,
        idProyecto: {
            idProyecto: null,
            wbs: null,
            proyecto: null,
            projectLeader: null,
            projectLeaderGrid: null,
            deliveryManager: null,
            deliveryManagerGrid: null,
            adm: null,
            admGrid: null,
            practiceManager: null,
            practiceManagerGrid: null,
            clientes: null,
            idCliente: {
                idcliente: null,
                cliente: null,
                dscliente: null
            },
        },
        wbs: null,
        idcontrolProduccion: null,
        idestatusControProduccion: {
            idestatusControlProduccion: null,
            estatusControlProduccion: null,
            dsestatusControlProduccion: null,
        },
        estatus: null,
        dscontrolProduccion: null,
        template: null,
        idTemplate: {
            idTemplate: null,
            template: null,
            descTemplate: null
        }
    };

    constructor(
        protected menuHeaderService: MenuHeaderService,
        protected menuBarActionService: MenuBarActionService,
        protected mensajeService: MensajeService,
        protected bitacoraService: BitacoraService,
        private catalogoPlaneacionService: CatalogoPlaneacionService,
        private comboService: ComboService,
        private catalogoGenericoService: CatalogoGenericoService,
        private catalogoColaboradoresService: CatalogoColaboradoresService,
        private proyectoService: CatalogoProyectoService,
        private blockService: BlockService,
        private confirmationService: ConfirmationService,
        private catalogoControlProduccionService: CatalogoControlProduccionService,
    ) {
        super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }

    ngOnInit(): void {

        /* Proyecto */
        this.columnasProyecto = [
            { field: "wbs", header: "Work Breakdown Structure" },
            { field: "proyecto", header: "Proyecto" },
            { field: "projectLeaderGrid", header: "Project Leader" },
            { field: "deliveryManagerGrid", header: "Delivery Manager" },
            { field: "admGrid", header: "Advanced Delivery Manager" },
            { field: "practiceManagerGrid", header: "Practice Manager" },
            { field: "clientes", header: "Cliente" },
        ];

        this.obtenerMenuArbol(null);
        this.obtenerComboProyecto();
        this.obtenerComboCliente();
        this.obtenerComboPL();
        this.obtenerComboADM();
        this.obtenerComboDM();
        this.obtenerComboPM();
        this.obtenerGridProyecto();

        /* Control Produccion */
        this.columnasCP = [
            { field: "idcontrolProduccion", header: "Id Control Producción" },
            { field: "controlProduccion", header: "Control Producción" },
            { field: "proyectoColumna", header: "Proyecto" },
            { field: "estatusColumna", header: "Estatus" },
            { field: "templateColumna", header: "Template" },
            { field: "descControlProduccion", header: "Descripción" },
        ];

        this.obtenerComboEstatusCP();
        this.obtenerComboTemplate();

        this.obtenerGridControlProduccion(1);
    }

    limpiarSeleccion(event) {
        this.proyectoSeleccionado = null;
    }
    limpiarNodoSeleccionado(event) {
        this.elementoSeleccionadoArbol = null;
    }

    obtenerComboCliente() {
        this.catalogoGenericoService.obtenerCatalogos("catalogoClientes").then(clientes => { this.listaCliente = this.comboService.crearListaComboBase(clientes) }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener Clientes");
        });
    }

    obtenerComboPL() {
        this.catalogoColaboradoresService.obtenerPl().then(pl => { this.listaPL = this.crearListaRolesNegocio(pl) }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener Project Leader")
        });
    }

    obtenerComboADM() {
        this.catalogoColaboradoresService.obtenerAdm().then(adm => { this.listaADM = this.crearListaRolesNegocio(adm) }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener Advanced Delivery Manager")
        });
    }

    obtenerComboDM() {
        this.catalogoColaboradoresService.obtenerDm().then(dm => { this.listaDM = this.crearListaRolesNegocio(dm) }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener Delivery Manager")
        });
    }

    obtenerComboPM() {
        this.catalogoColaboradoresService.obtenerPxm().then(pm => { this.listaPM = this.crearListaRolesNegocio(pm) }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener Practice Manager")
        });
    }

    crearListaRolesNegocio(lista: any[]): OpcionSelect[] {
        let listaAuxColaborador: OpcionSelect[] = [];
        for (var i = 0; i < lista.length; i++) {
            listaAuxColaborador.push({
                value: String(lista[i].idColaborador),
                name: "[" + lista[i].isColaborador + "] " + lista[i].nombre + " " + lista[i].apellidoPaterno + " " + lista[i].apellidoMaterno
            });
        }
        return listaAuxColaborador;
    }

    obtenerComboProyecto() {
        this.proyectoService.obtenerCombo().then(combo => { this.listaProyecto = combo }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el combo Proyecto")
        });
    }

    obtenerGridProyecto() {
        this.proyectoService.getProyectos().then(proyecto => this.crearListaProyecto(proyecto), error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el grid Proyecto")
        });
    }

    crearListaProyecto(lista: CatalogoProyecto[]) {
        for (var i = 0; i < lista.length; i++) {
            lista[i].clientes = "[" + lista[i].idCliente.idcliente + "] " + lista[i].idCliente.cliente;
            lista[i].projectLeaderGrid = "[" + lista[i].projectLeader.isColaborador + "] " + lista[i].projectLeader.nombre + " " + lista[i].projectLeader.apellidoPaterno + " " + lista[i].projectLeader.apellidoMaterno;
            lista[i].admGrid = "[" + lista[i].adm.isColaborador + "] " + lista[i].adm.nombre + " " + lista[i].adm.apellidoPaterno + " " + lista[i].adm.apellidoMaterno;
            lista[i].deliveryManagerGrid = "[" + lista[i].deliveryManager.isColaborador + "] " + lista[i].deliveryManager.nombre + " " + lista[i].deliveryManager.apellidoPaterno + " " + lista[i].deliveryManager.apellidoMaterno;
            lista[i].practiceManagerGrid = "[" + lista[i].practiceManager.isColaborador + "] " + lista[i].practiceManager.nombre + " " + lista[i].practiceManager.apellidoPaterno + " " + lista[i].practiceManager.apellidoMaterno;
        }
        this.gridProyecto = lista;
    }

    cambiarProyecto(event) {
        if (event != null && event.value != null) {
            if (event.value.value != null) {
                this.obtenerMenuArbol(event.value.value);
            } else {
                this.obtenerMenuArbol(event.value);
            }
        } else {
            this.obtenerMenuArbol(null);
        }
    }

    obtenerMenuArbol(idPlaneacion: string) {
        this.catalogoPlaneacionService.obtenerMenuArbol(idPlaneacion).then(lista => {
            this.menuArbol = lista;
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el árbol de selección");
            this.menuArbol = [];
        }).finally(() => {
            this.elementoSeleccionadoArbol = null;
        });
    }

    editarProyecto(proyecto: CatalogoProyecto) {
        this.esNuevoProyecto = false;
        this.habilitarInputsProyecto = true;
        this.menuBarActionService.asignarEstatusEditar();
        this.proyectoGuarda = this.obtenerProyectoFormulario(proyecto);
        this.opcionSeleccionadaCliente = this.comboService.asignarValorCombo(this.proyectoGuarda.idCliente, this.listaCliente);
        this.opcionSeleccionadaPL = this.comboService.asignarValorCombo(this.proyectoGuarda.projectLeader, this.listaPL);
        this.opcionSeleccionadaDM = this.comboService.asignarValorCombo(this.proyectoGuarda.deliveryManager, this.listaDM);
        this.opcionSeleccionadaADM = this.comboService.asignarValorCombo(this.proyectoGuarda.adm, this.listaADM);
        this.opcionSeleccionadaPM = this.comboService.asignarValorCombo(this.proyectoGuarda.practiceManager, this.listaPM);
    }

    nuevoProyecto() {
        this.habilitarInputsProyecto = true;
        this.cancelarProyecto();
    }

    guardarProyecto() {
        if (this.proyectoGuarda != null) {
            this.blockService.setBlock();

            this.proyectoGuarda.idCliente = this.comboService.obtenerValorCombo(this.opcionSeleccionadaCliente);
            this.proyectoGuarda.projectLeader = this.comboService.obtenerValorCombo(this.opcionSeleccionadaPL);
            this.proyectoGuarda.deliveryManager = this.comboService.obtenerValorCombo(this.opcionSeleccionadaDM);
            this.proyectoGuarda.adm = this.comboService.obtenerValorCombo(this.opcionSeleccionadaADM);
            this.proyectoGuarda.practiceManager = this.comboService.obtenerValorCombo(this.opcionSeleccionadaPM);

            // Validaciones
            let listaErrores = [];
            if (this.proyectoGuarda.wbs == null || this.proyectoGuarda.wbs.trim() == '') {
                listaErrores.push('WBS')
            }
            if (this.proyectoGuarda.proyecto == null || this.proyectoGuarda.proyecto.trim() == '') {
                listaErrores.push('Proyecto')
            }
            if (this.proyectoGuarda.projectLeader == null) {
                listaErrores.push('Proyect Leader')
            }
            if (this.proyectoGuarda.deliveryManager == null) {
                listaErrores.push('Delivery Manager')
            }
            if (this.proyectoGuarda.adm == null) {
                listaErrores.push('Advanced Delivery Manager')
            }
            if (this.proyectoGuarda.practiceManager == null) {
                listaErrores.push('Practice Manager')
            }
            if (this.proyectoGuarda.idCliente == null) {
                listaErrores.push('Cliente')
            }

            if (!this.mensajeService.validarCamposRequeridos(listaErrores)) {
                this.blockService.cleanBlock();
                return;
            }

            if (this.esNuevoProyecto) {
                this.proyectoGuarda.idProyecto = 0;
                // Alta proyecto
                this.proyectoService.registrarProyecto(this.proyectoGuarda).then(proyecto => {
                    this.obtenerGridProyecto();
                    this.obtenerComboProyecto();
                    this.cambiarProyecto(this.opcionSeleccionadaProyecto);
                    this.mostrarMensajeProyecto("registro", proyecto);
                }, error => {
                    this.mensajeService.mandarMensajeError("Ocurrió un error al guardar el Proyecto  [" + this.proyectoGuarda.wbs + "] " + this.proyectoGuarda.proyecto);
                    this.blockService.cleanBlock();
                });
            }
            else {
                // Edicion proyecto
                this.proyectoService.editarProyecto(this.proyectoGuarda).then(proyecto => {
                    this.obtenerGridProyecto();
                    this.obtenerComboProyecto();
                    this.cambiarProyecto(this.opcionSeleccionadaProyecto);
                    this.mostrarMensajeProyecto("editó", proyecto);
                }, error => {
                    this.mensajeService.mandarMensajeError("Ocurrió un error al editar el Proyecto  [" + this.proyectoGuarda.wbs + "] " + this.proyectoGuarda.proyecto);
                    this.blockService.cleanBlock();
                });
            }
        }
    }

    mostrarMensajeProyecto(tipo: string, proyecto: CatalogoProyecto) {
        this.habilitarInputsProyecto = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.blockService.cleanBlock();
        this.mensajeService.mandarMensajeSuccess("Se " + tipo + " el Proyecto [" + proyecto.wbs + "] " + proyecto.proyecto + " correctamente");
        this.cancelarProyecto();
    }

    buscarProyectoId(id: number) {
        for (let i = 0; i < this.gridProyecto.length; i++) {
            if (this.gridProyecto[i].idProyecto == id) {
                return this.gridProyecto[i];
            }
        } return null;
    }

    obtenerProyectoFormulario(proyectoSeleccionado: CatalogoProyecto) {
        var proyecto = {
            idProyecto: proyectoSeleccionado.idProyecto,
            wbs: proyectoSeleccionado.wbs,
            proyecto: proyectoSeleccionado.proyecto,
            projectLeader: proyectoSeleccionado.projectLeader.idColaborador,
            practiceManager: proyectoSeleccionado.practiceManager.idColaborador,
            idCliente: proyectoSeleccionado.idCliente.idcliente,
            deliveryManager: proyectoSeleccionado.deliveryManager.idColaborador,
            adm: proyectoSeleccionado.adm.idColaborador,
        };
        return proyecto;
    }

    borrarProyecto() {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar el Proyecto  [' + this.proyectoGuarda.wbs + '] ' + this.proyectoGuarda.proyecto + ' ?',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                this.blockService.setBlock()
                this.proyectoService.eliminarProyecto(this.proyectoGuarda)
                    .then(resultado => { this.blockService.cleanBlock(); this.proyectoEliminado() }, error => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el Proyecto [" + this.proyectoGuarda.wbs + "] " + this.proyectoGuarda.proyecto);
                        this.blockService.cleanBlock();
                    });
            }
        });
    }

    proyectoEliminado() {
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputsProyecto = false;
        this.mensajeService.mandarMensajeSuccess("Proyecto [" + this.proyectoGuarda.wbs + "] " + this.proyectoGuarda.proyecto + " eliminado correctamente");
        this.cancelarProyecto();
        this.obtenerGridProyecto();
        this.obtenerComboProyecto();
        this.cambiarProyecto(this.opcionSeleccionadaProyecto);
    }

    cancelarProyecto() {
        this.esNuevoProyecto = true;
        this.opcionSeleccionadaCliente = this.comboService.limpiarCombo();
        this.opcionSeleccionadaPL = this.comboService.limpiarCombo();
        this.opcionSeleccionadaDM = this.comboService.limpiarCombo();
        this.opcionSeleccionadaADM = this.comboService.limpiarCombo();
        this.opcionSeleccionadaPM = this.comboService.limpiarCombo();

        this.proyectoGuarda = {
            idProyecto: null,
            wbs: null,
            proyecto: null,
            projectLeader: null,
            deliveryManager: null,
            adm: null,
            practiceManager: null,
            idCliente: null,
        };

        this.proyectoSeleccionado = {
            idProyecto: null,
            wbs: null,
            proyecto: null,
            projectLeader: null,
            projectLeaderGrid: null,
            deliveryManager: null,
            deliveryManagerGrid: null,
            adm: null,
            admGrid: null,
            practiceManager: null,
            practiceManagerGrid: null,
            clientes: null,
            idCliente: {
                idcliente: null,
                cliente: null,
                dscliente: null
            }
        };
    }


    /* Control Produccion */

    obtenerComboEstatusCP() {
        this.catalogoGenericoService.obtenerCatalogos("catalogoEstatusCtrlProd").then(estatus => { this.listaEstatusCP = this.comboService.crearListaComboBase(estatus) }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el combo Estatus control producción");
        });
    }

    obtenerComboTemplate() {
        this.catalogoGenericoService.obtenerCatalogos("catalogoTemplate").then(templates => { this.listaTemplate = this.comboService.crearListaComboBase(templates) }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el combo Template");
        });
    }

    obtenerGridControlProduccion(idProyecto: number) {
        this.catalogoControlProduccionService.obtenerControlProduccionPorIdProyecto(idProyecto).then(controlProduccion => this.crearListaControlProduccion(controlProduccion), error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el grid Control de Producción");
        });
    }

    crearListaControlProduccion(lista: CatalogoControlProduccionDTO[]) {
        for (let i = 0; i < lista.length; i++) {
            lista[i].estatusColumna = "[" + lista[i].idEstatusCtrlProd + "] " + lista[i].estatusControlProduccion;
            lista[i].templateColumna = "[" + lista[i].idTemplate + "] " + lista[i].template;
            for (let j = 0; j < this.listaProyecto.length; j++){
                if (this.listaProyecto[j].value == String(lista[i].idProyecto)){
                    lista[i].proyectoColumna = "[" + lista[i].idProyecto + "] " + this.listaProyecto[j].name;
                    j = this.listaProyecto.length; 
                }
            }
        }
        this.gridCP = lista;
    }

    /* Acciones Generales */
    ejecutarBotonNuevo() {
        if (this.ruta == this.PROYECTO) {
            this.nuevoProyecto();
        }
    }

    ejecutarBotonEditar() {
        if (this.proyectoSeleccionado != null && this.proyectoSeleccionado.idProyecto != null) {
            this.editarProyecto(this.proyectoSeleccionado);
        } else if (this.elementoSeleccionadoArbol != null && this.elementoSeleccionadoArbol.data.nivel == 1) {
            this.editarProyecto(this.buscarProyectoId(this.elementoSeleccionadoArbol.data.id));
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un elemento para edición")
        }
    }

    ejecutarBotonGuardar() {
        if (this.ruta == this.PROYECTO) {
            this.guardarProyecto();
        }
    }

    ejecutarBotonCancelar() {
        if (this.ruta == this.PROYECTO) {
            this.habilitarInputsProyecto = false;
            this.cancelarProyecto();
        }
    }

    ejecutarBotonBorrar() {
        if (this.ruta == this.PROYECTO) {
            this.borrarProyecto();
        }
    }

    obtenerEstatusPantalla(): string {
        if (this.habilitarInputsProyecto) {
            return (this.esNuevoProyecto ? '[Nuevo]' : '[Edición]');
        }
        return "";
    }

}