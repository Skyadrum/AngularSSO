import { Component, OnInit } from '@angular/core';

import { CatalogoProyecto, CatalogoProyectoGuarda } from '../../model/catalogoProyecto';
import { CatalogoProyectoService } from '@app/controlProduccion/service/catalogoProyecto.service';
import { OpcionSelect } from '@app/shared/model/Combo';

import { MenuItem } from 'primeng/api/menuitem';
import { MessageService, ConfirmationService } from 'primeng/api';

import { CatalogoGenericoService } from '@app/controlProduccion/service/catalogoGenerico.service';
import { ComboService } from 'src/app/shared/service/Combo.service';
import { CatalogoColaboradoresService } from '@app/controlProduccion/service/catalogoColaboradores.service';

import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { BaseComponent } from '@app/shared/model/BaseComponent';
import { BlockService } from '@app/shared/service/Block.service';




@Component({
  selector: 'app-catalogo-proyecto',
  templateUrl: './catalogoProyecto.component.html',

})
export class CatalogoProyectoComponent extends BaseComponent implements OnInit {

    cols:any[];
    esNuevo: boolean = true;
    listaClientes: OpcionSelect[]=[];
    opcionCliente: OpcionSelect;
    habilitarInputs: boolean;

    listaPLPeticion: any[]=[];
    listaPL : OpcionSelect[]=[];
    opcionPL: OpcionSelect;

    listaAdm : OpcionSelect[] = [];
    opcionAdm: OpcionSelect;

    listaTL : OpcionSelect[] = [];
    opcionTL: OpcionSelect;

    listaDM : OpcionSelect[] = [];
    opcionDM: OpcionSelect;

    listaPXM : OpcionSelect[] = [];
    opcionPXM: OpcionSelect;




proyectos: CatalogoProyecto[]=[];

proyectoSeleccionado: CatalogoProyecto={
  idProyecto:null,
  wbs: null,
  proyecto: null,
  projectLeader: null,
  projectLeaderGrid:null,
  deliveryManager: null,
  deliveryManagerGrid:null,
  adm:null,
  admGrid:null,
  practiceManager:null,
  practiceManagerGrid:null,
  clientes:null,
  idCliente:{
    idcliente: null,
    cliente: null,
    dscliente: null,
 }
};


proyectoGuarda: CatalogoProyectoGuarda={
  idProyecto:null,
  wbs: null,
  proyecto: null,
  projectLeader: null,
  deliveryManager: null,
  adm:null,
  practiceManager:null,
  idCliente:null,

};

  constructor(
      protected menuHeaderService: MenuHeaderService,
      protected menuBarActionService: MenuBarActionService,
      protected mensajeService: MensajeService,
      protected bitacoraService: BitacoraService,
      private proyectoService:CatalogoProyectoService,
      private catalogoColaboradores: CatalogoColaboradoresService,
      private catalogoGenericoService: CatalogoGenericoService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService,
      private comboService: ComboService,
      private blockService: BlockService
    ) {
       super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
      }

    ngOnInit():void {

    this.cols=[
      { field: "idProyecto", header: "ID Proyecto" },
      { field: "wbs", header: "WBS" },
      { field: "proyecto", header: "Proyecto" },
      { field: "projectLeaderGrid", header: "Project Leader" },
      { field: "deliveryManagerGrid", header: "Deliver Manager" },
      { field: "admGrid", header: "ADM" },
      { field: "practiceManagerGrid", header: "Practice Manager" },
      { field: "clientes", header: "Cliente" },
    ];

      this.obtenerComboCliente();
      this.obtenerProjectLader();
      this.obtenerADM();
      this.obtenerDM();
      this.obtenerPXM();
      this.obtenProyecto()
    }

    obtenerProyectoFormulario(proyectoSeleccionado: CatalogoProyecto) {
        var proyecto = {
          idProyecto:proyectoSeleccionado.idProyecto,
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

    proyectoEliminado() {
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputs = false;
        this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Proyecto ["+this.proyectoSeleccionado.idProyecto+"] "+this.proyectoSeleccionado.proyecto+" eliminado correctamente" });
        this.cancelar();
        this.obtenProyecto();
    }

    cancelar() {
      this.esNuevo = true;
      this.opcionCliente = this.comboService.limpiarCombo();
      this.opcionPL= this.comboService.limpiarCombo();
      this.opcionDM=this.comboService.limpiarCombo();
      this.opcionAdm=this.comboService.limpiarCombo();
      this.opcionPXM=this.comboService.limpiarCombo();

      this.proyectoGuarda = {
        idProyecto:null,
        wbs: null,
        proyecto: null,
        projectLeader: null,
        deliveryManager: null,
        adm:null,
        practiceManager:null,
        idCliente: null,
      };
      this.proyectoSeleccionado={
        idProyecto:null,
        wbs: null,
        proyecto: null,
        projectLeader: null,
        projectLeaderGrid:null,
        deliveryManager: null,
        deliveryManagerGrid:null,
        adm:null,
        admGrid:null,
        practiceManager:null,
        practiceManagerGrid:null,
        clientes:null,
        idCliente:{
          idcliente: null,
          cliente: null,
          dscliente: null
       }
     };
    }

    mostrarMensaje(tipo: string, proyecto: CatalogoProyecto) {
        this.habilitarInputs = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.blockService.cleanBlock();
        this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Se "+tipo+" la Actividad ["+proyecto.idProyecto+"] "+proyecto.proyecto+" correctamente"});
        this.cancelar();

    }

    obtenProyecto() {
      this.proyectoService.getProyectos().then(proyectos => this.crearListaProyectos(proyectos),resultado=>{
      this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener Proyectos" });
      });
        }

    crearListaProyectos(lista: CatalogoProyecto[]) {
        for (var i = 0; i < lista.length; i++) {
        lista[i].clientes = "[" + lista[i].idCliente.idcliente + "] " + lista[i].idCliente.cliente;
        lista[i].projectLeaderGrid= "["+ lista[i].projectLeader.isColaborador+ " ] " +  lista[i].projectLeader.nombre + " " + lista[i].projectLeader.apellidoPaterno + " " + lista[i].projectLeader.apellidoMaterno;
        lista[i].admGrid= "["+ lista[i].adm.isColaborador+ " ] " +  lista[i].adm.nombre + " " + lista[i].adm.apellidoPaterno + " " + lista[i].adm.apellidoMaterno;
        lista[i].deliveryManagerGrid= "["+ lista[i].deliveryManager.isColaborador+ " ] " +  lista[i].deliveryManager.nombre + " " + lista[i].deliveryManager.apellidoPaterno + " " + lista[i].deliveryManager.apellidoMaterno;
        lista[i].practiceManagerGrid= "["+ lista[i].practiceManager.isColaborador+ " ] " +  lista[i].practiceManager.nombre + " " + lista[i].practiceManager.apellidoPaterno + " " + lista[i].practiceManager.apellidoMaterno;
        }
      this.proyectos = lista;
      }


      obtenerComboCliente() {
          this.catalogoGenericoService.obtenerCatalogos("catalogoClientes").then(clientes => { this.listaClientes = this.comboService.crearListaComboBase(clientes) }, resultado => {
              this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener los Templates" });
          });
      }


      obtenerProjectLader() {
        this.catalogoColaboradores.obtenerPl().then(projectLader =>{ this.listaPL=this.crearListaRolesNegocio(projectLader);this.listaPLPeticion =projectLader} , resultado => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener Project Lader" });
        });
      }

      obtenerADM() {
        this.catalogoColaboradores.obtenerAdm().then(adm => {this.listaAdm = this.crearListaRolesNegocio(adm);this.listaPLPeticion =adm}, resultado => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener ADM" });
        });
      }


      obtenerDM() {
        this.catalogoColaboradores.obtenerDm().then(dm =>{this.listaDM = this.crearListaRolesNegocio(dm);this.listaPLPeticion =dm}, resultado => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener Delivery Manager" });
        });
      }

      obtenerPXM() {
        this.catalogoColaboradores.obtenerPxm().then(pxm =>{this.listaPXM = this.crearListaRolesNegocio(pxm);this.listaPLPeticion =pxm}, resultado => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener Practice Manager" });
        });
      }

      crearListaRolesNegocio(lista: any[]) {
        let listaAuxColaboradores: OpcionSelect[] = [];
        for (var i = 0; i < lista.length; i++) {
          listaAuxColaboradores.push({
            value: String(lista[i].idColaborador),
            name: "[" + lista[i].isColaborador + "] " + lista[i].nombre +" " + lista[i].apellidoPaterno
          });
        }
      return listaAuxColaboradores
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
      if (this.proyectoGuarda != null ) {
        this.blockService.setBlock();

        this.proyectoGuarda.idCliente = this.comboService.obtenerValorCombo(this.opcionCliente);
        this.proyectoGuarda.projectLeader = this.comboService.obtenerValorCombo(this.opcionPL);
        this.proyectoGuarda.deliveryManager = this.comboService.obtenerValorCombo(this.opcionDM);
        this.proyectoGuarda.adm = this.comboService.obtenerValorCombo(this.opcionAdm);
        this.proyectoGuarda.practiceManager = this.comboService.obtenerValorCombo(this.opcionPXM);

        if (this.esNuevo) {
          this.proyectoGuarda.idProyecto=0;
          // Alta registro
          this.proyectoService.registrarProyecto(this.proyectoGuarda).then(proyecto => {this.obtenProyecto();this.mostrarMensaje("registro",proyecto)}, resultado => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al guardar el Proyecto  ["+this.proyectoGuarda.idProyecto+"] "+this.proyectoGuarda.idProyecto }); this.blockService.cleanBlock(); 

          });
        }
        else {
          // Edicion registro
          this.proyectoService.editarProyecto(this.proyectoGuarda).then(proyecto => {this.obtenProyecto();this.mostrarMensaje("editó",proyecto)}, resultado => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al editar el Proyecto  ["+this.proyectoGuarda.idProyecto+"] "+this.proyectoGuarda.idProyecto }); this.blockService.cleanBlock();
          /*  this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al editar el Colaborador" }); */
          });
        }
      }
    }

    ejecutarBotonEditar() {
      if (this.proyectoSeleccionado != null && this.proyectoSeleccionado.idProyecto != null) {
        this.esNuevo = false;
        this.habilitarInputs = true;
        this.menuBarActionService.asignarEstatusEditar();
        this.proyectoGuarda = this.obtenerProyectoFormulario(this.proyectoSeleccionado);
        this.opcionCliente =this.comboService.asignarValorCombo(this.proyectoGuarda.idCliente,this.listaClientes);
        this.opcionPL =this.comboService.asignarValorCombo(this.proyectoGuarda.projectLeader,this.listaPL);
        this.opcionDM=this.comboService.asignarValorCombo(this.proyectoGuarda.deliveryManager,this.listaDM);
        this.opcionAdm=this.comboService.asignarValorCombo(this.proyectoGuarda.adm,this.listaAdm);
        this.opcionPXM=this.comboService.asignarValorCombo(this.proyectoGuarda.practiceManager,this.listaPXM);

      } else {
        this.messageService.add({ severity: 'warn', summary: "Resultado", detail: "Seleccione un Proyecto de la tabla" });
      }
    }

    ejecutarBotonBorrar() {
      if (this.proyectoSeleccionado != null && this.proyectoSeleccionado.idProyecto !=null) {

        this.confirmationService.confirm({
          message: '¿Está seguro de eliminar el Proyecto  ['+this.proyectoSeleccionado.idProyecto+'] '+this.proyectoSeleccionado.proyecto +' ?',
          acceptLabel: 'Aceptar',
          rejectLabel: 'Cancelar',
          accept: () => {
            this.blockService.setBlock()
            this.proyectoService.eliminarProyecto(this.obtenerProyectoFormulario(this.proyectoSeleccionado))
            .then(resultado=> { this.blockService.cleanBlock(); this.proyectoEliminado() }, estatus => {
              this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al eliminar el Proyecto ["+this.proyectoSeleccionado.idProyecto+"] " + this.proyectoSeleccionado.proyecto }); this.blockService.cleanBlock();
            });
          }
        });
      } else {
        this.messageService.add({ severity: 'warn', summary: "Advertencia", detail: "Seleccione un Proyecto de la tabla" });
      }
    }

}
