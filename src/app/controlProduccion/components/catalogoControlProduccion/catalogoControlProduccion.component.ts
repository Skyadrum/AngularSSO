import { Component, OnInit } from '@angular/core';
import { CatalogoControlProduccion, CatalogoControlProduccionGuarda } from '@app/controlProduccion/model/catalogoControlProduccion';
import { CatalogoControlProduccionService } from '@app/controlProduccion/service/catalogoControlProduccion.service';
import { CatalogoGenericoService } from '@app/controlProduccion/service/catalogoGenerico.service';
import { CatalogoProyectoService } from '@app/controlProduccion/service/catalogoProyecto.service';
import { BaseComponent } from '@app/shared/model/BaseComponent';
import { OpcionSelect } from '@app/shared/model/Combo';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { ComboService } from '@app/shared/service/Combo.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { ConfirmationService } from 'primeng/api';
import { BlockService } from '@app/shared/service/Block.service';

@Component({
  selector: 'app-catalogo-control-produccion',
  templateUrl: './catalogoControlProduccion.component.html'
})
export class CatalogoControlProduccionComponent extends BaseComponent implements OnInit {

  controlProduccion: CatalogoControlProduccion[];

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

  controlProduccionGuarda: CatalogoControlProduccionGuarda = {
    controlProduccion: null,
    idProyecto: null,
    idControlProduccion: null,
    idEstatusCtrlProd: null,
    descControlProduccion: null,
    idTemplate: null
  }

  cols: any[];
  esNuevo: boolean = true;

  listaProyectos: OpcionSelect[] = [];
  opcionSeleccionadaProyectos: OpcionSelect;

  listaEstatus: OpcionSelect[] = [];
  opcionSeleccionadaEstatus: OpcionSelect;

  listaTemplate: OpcionSelect[] = [];
  opcionSeleccionadaTemplate: OpcionSelect;

  habilitarInputs: boolean;

  constructor(
    protected menuHeaderService: MenuHeaderService,
    protected menuBarActionService: MenuBarActionService,
    protected mensajeService: MensajeService,
    protected bitacoraService: BitacoraService,
    private catalogoControlProduccionService: CatalogoControlProduccionService,
    private catalogoProyectosService: CatalogoProyectoService,
    private catalogoGenericoService: CatalogoGenericoService,
    private confirmationService: ConfirmationService,
    private comboService: ComboService,
    private blockService: BlockService,
  ) {
    super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
  }

  ngOnInit(): void {
    this.habilitarInputs = false;

    this.cols = [
      { field: "idcontrolProduccion", header: "Id Control Producción" },
      { field: "controlProduccion", header: "Control Producción" },
      { field: "dscontrolProduccion", header: "Descripción" },
      { field: "wbs", header: "WBS" },
      { field: "estatus", header: "Estatus" },
      { field: "template", header: "Template" }
    ];

    this.obtenerControlProduccion();
    this.obtenerComboEstatus();
    this.obtenerComboTemplate();
    this.obtenerProyectos();
  }

  obtenerControlProduccionFormulario(controlProduccionSeleccionado: CatalogoControlProduccion) {
    var control = {
      idControlProduccion: controlProduccionSeleccionado.idcontrolProduccion,
      controlProduccion: controlProduccionSeleccionado.controlProduccion,
      descControlProduccion: controlProduccionSeleccionado.dscontrolProduccion,
      idEstatusCtrlProd: controlProduccionSeleccionado.idestatusControProduccion.idestatusControlProduccion,
      idProyecto: controlProduccionSeleccionado.idProyecto.idProyecto,
      idTemplate: controlProduccionSeleccionado.idTemplate.idTemplate
    };
    return control;
  }

  controlProduccionEliminada() {
    this.menuBarActionService.asignarEstatusApertura();
    this.habilitarInputs = false;
    this.mensajeService.mandarMensajeSuccess("Control Produccion [" + this.controlProduccionSeleccionado.idcontrolProduccion + "] " + this.controlProduccionSeleccionado.controlProduccion + " eliminado correctamente");
    this.cancelar();
    this.obtenerControlProduccion();
  }

  cancelar() {
    this.esNuevo = true;
    this.opcionSeleccionadaProyectos = this.comboService.limpiarCombo();
    this.opcionSeleccionadaEstatus = this.comboService.limpiarCombo();
    this.opcionSeleccionadaTemplate = this.comboService.limpiarCombo();

    this.controlProduccionGuarda = {
      controlProduccion: null,
      idProyecto: null,
      idControlProduccion: null,
      idEstatusCtrlProd: null,
      descControlProduccion: null,
      idTemplate: null
    };

    this.controlProduccionSeleccionado = {
      controlProduccion: null,
      idProyecto: {
        idProyecto: null,
        wbs: null,
        proyecto: null,
        projectLeader: null,
        projectLeaderGrid: null,
        deliveryManager: null,
        deliveryManagerGrid: null,
        admGrid: null,
        adm: null,
        practiceManager: null,
        practiceManagerGrid: null,
        clientes: null,
        idCliente: {
          idcliente: null,
          cliente: null,
          dscliente: null
        }
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
  }

  mostrarMensaje(tipo: string, controlProduccion: CatalogoControlProduccion) {
    this.habilitarInputs = false;
    this.menuBarActionService.asignarEstatusApertura();
    this.blockService.cleanBlock();
    this.mensajeService.mandarMensajeSuccess("Se " + tipo + " el Control de Produccion [" + controlProduccion.idcontrolProduccion + "] " + controlProduccion.controlProduccion + " correctamente");
    this.cancelar();
  }

  obtenerControlProduccion() {
    this.catalogoControlProduccionService.obtenerControlProduccion().then(controlProduccion => this.crearListaControlProduccion(controlProduccion), resultado => {
      this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el Control de Producción");
    });
  }

  crearListaControlProduccion(lista: CatalogoControlProduccion[]) {
    for (var i = 0; i < lista.length; i++) {
      lista[i].estatus = "[" + lista[i].idestatusControProduccion.idestatusControlProduccion + "] " + lista[i].idestatusControProduccion.estatusControlProduccion;
      lista[i].template = "[" + lista[i].idTemplate.idTemplate + "] " + lista[i].idTemplate.template;
      lista[i].wbs = "[" + lista[i].idProyecto.wbs + "] " + lista[i].idProyecto.proyecto;
    }
    this.controlProduccion = lista;
  }

  obtenerComboEstatus() {
    this.catalogoGenericoService.obtenerCatalogos("catalogoEstatusCtrlProd").then(estatus => { this.listaEstatus = this.comboService.crearListaComboBase(estatus) }, resultado => {
      this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el estatus");
    });
  }

  obtenerComboTemplate() {
    this.catalogoGenericoService.obtenerCatalogos("catalogoTemplate").then(templates => { this.listaTemplate = this.comboService.crearListaComboBase(templates) }, resultado => {
      this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el template");
    });
  }

  obtenerProyectos() {
    this.catalogoProyectosService.getProyectos().then(proyectos => this.crearListaProyecto(proyectos), resultado => {
      this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Colaboradores");
    });
  }

  crearListaProyecto(lista: any[]) {
    let listaAuxColaboradores: OpcionSelect[] = [];
    for (var i = 0; i < lista.length; i++) {
      listaAuxColaboradores.push({
        value: String(lista[i].idProyecto),
        name: "[" + lista[i].wbs + "] " + lista[i].proyecto
      });
    }
    this.listaProyectos = listaAuxColaboradores;
  }

  ejecutarBotonNuevo() {
    this.habilitarInputs = true;
    this.cancelar();
  }

  ejecutarBotonCancelar() {
    this.habilitarInputs = false;
    this.cancelar();
  }

  ejecutarBotonGuardar() {
    if (this.controlProduccionGuarda != null) {
      this.blockService.setBlock();
      this.controlProduccionGuarda.idProyecto = this.comboService.obtenerValorCombo(this.opcionSeleccionadaProyectos);
      this.controlProduccionGuarda.idEstatusCtrlProd = this.comboService.obtenerValorCombo(this.opcionSeleccionadaEstatus);
      this.controlProduccionGuarda.idTemplate = this.comboService.obtenerValorCombo(this.opcionSeleccionadaTemplate);
      if (this.esNuevo) {
        this.controlProduccionGuarda.idControlProduccion = 0;
        // Alta registro
        this.catalogoControlProduccionService.registrarControlProduccion(this.controlProduccionGuarda).then(controlProduccion => { this.obtenerControlProduccion(); this.mostrarMensaje("registró", controlProduccion) }, resultado => {
          this.mensajeService.mandarMensajeError("Ocurrió un error al guardar el Control de Produccion [" + this.controlProduccionGuarda.idControlProduccion + "] " + this.controlProduccionGuarda.controlProduccion); this.blockService.cleanBlock();
        });
      } else {
        // Edicion registro
        this.catalogoControlProduccionService.editarControlProduccion(this.controlProduccionGuarda).then(controlProduccion => { this.obtenerControlProduccion(); this.mostrarMensaje("editó", controlProduccion) }, resultado => {
          this.mensajeService.mandarMensajeError("Ocurrió un error al editar el Control de Produccion [" + this.controlProduccionGuarda.idControlProduccion + "] " + this.controlProduccionGuarda.controlProduccion); this.blockService.cleanBlock();
        });
      }
    }
  }

  ejecutarBotonEditar() {
    if (this.controlProduccionSeleccionado != null && this.controlProduccionSeleccionado.idcontrolProduccion != null) {
      this.habilitarInputs = true;
      this.esNuevo = false;
      this.controlProduccionGuarda = this.obtenerControlProduccionFormulario(this.controlProduccionSeleccionado);

      this.opcionSeleccionadaProyectos = this.comboService.asignarValorCombo(this.controlProduccionGuarda.idProyecto, this.listaProyectos);
      this.opcionSeleccionadaEstatus = this.comboService.asignarValorCombo(this.controlProduccionGuarda.idEstatusCtrlProd, this.listaEstatus);
      this.opcionSeleccionadaTemplate = this.comboService.asignarValorCombo(this.controlProduccionGuarda.idTemplate, this.listaTemplate);
      this.menuBarActionService.asignarEstatusEditar();
    } else {
      this.mensajeService.mandarMensajeWarn("Seleccione un Control Producción  de la tabla");
    }
  }

  ejecutarBotonBorrar() {
    if (this.controlProduccionSeleccionado != null && this.controlProduccionSeleccionado.idcontrolProduccion != null) {
      this.confirmationService.confirm({
        message: '¿Está seguro de eliminar el Control de Producción [' + this.controlProduccionSeleccionado.idcontrolProduccion + '] ' + this.controlProduccionSeleccionado.controlProduccion + ' ?',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.blockService.setBlock()
          this.catalogoControlProduccionService.eliminarControlProduccion(this.obtenerControlProduccionFormulario(this.controlProduccionSeleccionado))
          
          .then(resultado => {
              this.blockService.cleanBlock(); 
              this.controlProduccionEliminada()
            }, 
            estatus => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el Control de Producción [" + this.controlProduccionSeleccionado.idcontrolProduccion + "] " + this.controlProduccionSeleccionado.controlProduccion); this.blockService.cleanBlock();
          });
        }
      });
    } else {
      this.mensajeService.mandarMensajeWarn("Seleccione Control de Producción de la tabla")
    }
  }

}
