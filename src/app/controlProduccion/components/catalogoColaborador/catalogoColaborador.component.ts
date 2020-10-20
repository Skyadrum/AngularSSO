import { Component, OnInit } from '@angular/core';

import { CatalogoColaboradoresGuarda, CatalogoColaborador } from '../../model/catalogoColaboradores';
import { OpcionSelect, ElementoCatalogo } from '../../model/catalogoGenerico';

import { CatalogoColaboradoresService } from '../../service/catalogoColaboradores.service';
import { CatalogoGenericoService } from '../../service/catalogoGenerico.service';

import { MenuItem } from 'primeng/api/menuitem';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ComboService } from 'src/app/shared/service/Combo.service';
import { BaseComponent } from '@app/shared/model/BaseComponent';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { BlockService } from '@app/shared/service/Block.service';


@Component({
  selector: 'app-catalogo-colaborador',
  templateUrl: './catalogoColaborador.component.html'
})
export class CatalogoColaboradorComponent extends BaseComponent implements OnInit {


  cols: any[];
  esNuevo: boolean = true;
  listaGeneros: OpcionSelect[]=[];
  opcionGenero: OpcionSelect;
  muestraFormulario: boolean = false;
  habilitarInputs: boolean;

  opcionADM:boolean=false;
  opcionDM:boolean=false;
  opcionPL:boolean=false;
  opcionPXM:boolean=false;
  opcionTL:boolean=false;

  elementos:ElementoCatalogo[];


  colaboradores: CatalogoColaborador[];

  colaboradorSeleccionado: CatalogoColaborador = {
    idColaborador:null,
    isColaborador:null,
    usuario:null,
    nombre:null,
    apellidoPaterno:null,
    apellidoMaterno:null,
    at:null,
    atImporte:0,
    genero:null,
    idGenero: {
      idGenero: 0,
      genero: null,
      dsGenero: null,
    },
    rolNegocio:null,
    rolTL: null,
    rolPL:null,
    rolDM:null,
    rolADM:null,
    rolPXM:null,
  };


  colaboradorGuarda: CatalogoColaboradoresGuarda={
    idColaborador:null,
    isColaborador:null,
    usuario:null,
    nombre:null,
    apellidoPaterno:null,
    apellidoMaterno:null,
    at:null,
    atImporte:null,
    idGenero:null,
    rolTL: null,
    rolPL:null,
    rolDM:null,
    rolADM:null,
    rolPXM:null,
  };



  constructor(
    protected menuHeaderService: MenuHeaderService,
    protected menuBarActionService: MenuBarActionService,
    protected mensajeService: MensajeService,
    protected bitacoraService: BitacoraService,
    private colaboradorService: CatalogoColaboradoresService,
    private catalogoGenericoService: CatalogoGenericoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private comboService: ComboService,
    private blockService: BlockService) {
       super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
     }


  ngOnInit() {

    this.cols = [
      { field: "idColaborador", header: "Id" },
      { field: "isColaborador", header: "Clave IS" },
      { field: "usuario", header: "Usuario " },
      { field: "nombre", header: "Nombre" },
      { field: "apellidoPaterno", header: "Apellido Paterno" },
      { field: "apellidoMaterno", header: "Apellido Materno" },
      { field: "at", header: "AT" },
      { field: "atImporte", header: "AT Importe" },
      { field: "genero", header: "Genero" },
      { field: "rolNegocio", header: "Rol Negocio" },

    ];


    this.obteneColaborador();
    this.obtenerComboGenero();
  }
  /*METODOS------------*/


  obtenerColaboradorFormulario(colaboradorSeleccionada: CatalogoColaborador) {
      var colaborador = {
          idColaborador: colaboradorSeleccionada.idColaborador,
          isColaborador: colaboradorSeleccionada.isColaborador,
          usuario: colaboradorSeleccionada.usuario,
          nombre: colaboradorSeleccionada.nombre,
          apellidoPaterno: colaboradorSeleccionada.apellidoPaterno,
          apellidoMaterno: colaboradorSeleccionada.apellidoMaterno,
          at: colaboradorSeleccionada.at,
          atImporte: colaboradorSeleccionada.atImporte,
          idGenero: colaboradorSeleccionada.idGenero.idGenero,
          rolTL: colaboradorSeleccionada.rolTL,
          rolPL:colaboradorSeleccionada.rolPL,
          rolDM:colaboradorSeleccionada.rolDM,
          rolADM:colaboradorSeleccionada.rolADM,
          rolPXM:colaboradorSeleccionada.rolPXM,
      };
      return colaborador;

  }

  colaboradorEliminado() {
    this.menuBarActionService.asignarEstatusApertura();
    this.habilitarInputs = false;
    this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Actividad ["+this.colaboradorSeleccionado.idColaborador+"] "+this.colaboradorSeleccionado.nombre+" eliminado correctamente" });
    this.cancelar();
    this.obteneColaborador();
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
    if (this.colaboradorSeleccionado != null && this.colaboradorSeleccionado.idColaborador != null) {
      console.log(this.colaboradorSeleccionado)
      this.habilitarInputs = true;
      this.menuBarActionService.asignarEstatusEditar();
      this.esNuevo = false;
      this.colaboradorGuarda = this.obtenerColaboradorFormulario(this.colaboradorSeleccionado);
      this.opcionGenero = this.comboService.asignarValorCombo(this.colaboradorGuarda.idGenero, this.listaGeneros);
      
     if(this.colaboradorSeleccionado.rolADM==1){this.opcionADM=true}
     if(this.colaboradorSeleccionado.rolTL==1){this.opcionTL=true}
     if(this.colaboradorSeleccionado.rolDM==1){this.opcionDM=true}
     if(this.colaboradorSeleccionado.rolPL==1){this.opcionPL=true}
     if(this.colaboradorSeleccionado.rolPXM==1){this.opcionPXM=true}

    } else {
      this.messageService.add({ severity: 'warn', summary: "Resultado", detail: "Seleccione un Colaborador de la tabla" });
    }
  }

  ejecutarBotonBorrar() {
    if (this.colaboradorSeleccionado != null && this.colaboradorSeleccionado.idColaborador != null) {
      this.confirmationService.confirm({
        message: '¿Está seguro de eliminar el Colaborador?',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.blockService.setBlock()
          this.colaboradorService.eliminarColaborador(this.obtenerColaboradorFormulario(this.colaboradorSeleccionado))
          .then(resultado =>{this.blockService.cleanBlock(); this.colaboradorEliminado()},estatus=>{
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al eliminar la Actividad ["+this.colaboradorSeleccionado.idColaborador+"] " + this.colaboradorSeleccionado.nombre }); this.blockService.cleanBlock();
          /*  this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al eliminar el Usuario" });*/
          });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: "Advertencia", detail: "Seleccione un Usuario de la tabla" });
    }
  }
  cancelar() {
    this.opcionADM=false;
    this.opcionDM=false;
    this.opcionPL=false;
    this.opcionPXM=false;
    this.opcionTL=false;
    this.opcionGenero = this.comboService.limpiarCombo();
    this.esNuevo = true;
    this.colaboradorGuarda = {
      idColaborador:null,
      isColaborador:null,
      usuario:null,
      nombre:null,
      apellidoPaterno:null,
      apellidoMaterno:null,
      at:null,
      atImporte:null,
      idGenero: null,
      rolTL: 0,
      rolPL:0,
      rolDM:0,
      rolADM:0,
      rolPXM:0,
    };
    this.colaboradorSeleccionado={
      idColaborador:null,
      isColaborador:null,
      usuario:null,
      nombre:null,
      apellidoPaterno:null,
      apellidoMaterno:null,
      at:null,
      atImporte:0,
      genero:null,
      rolNegocio:null,
      rolTL: 0,
      rolPL:null,
      rolDM:0,
      rolADM:0,
      rolPXM:0,
      idGenero: {
        idGenero: 0,
        genero: null,
        dsGenero: null,
      }
    };
  }

  ejecutarBotonGuardar() {
    if (this.colaboradorGuarda != null ) {
     this.blockService.setBlock();
     this.colaboradorGuarda.idGenero = this.comboService.obtenerValorCombo(this.opcionGenero);
     this.colaboradorGuarda.rolADM = this.opcionADM == true ? 1 : 0 ;
     this.colaboradorGuarda.rolDM = this.opcionDM == true ? 1 : 0;
     this.colaboradorGuarda.rolPL = this.opcionPL == true ? 1 : 0;
     this.colaboradorGuarda.rolPXM = this.opcionPXM == true ? 1 :0;
     this.colaboradorGuarda.rolTL = this.opcionTL == true ?  1 : 0;
      if (this.esNuevo) {

        this.colaboradorGuarda.idColaborador=0;
        // Alta registro
        this.colaboradorService.registrarColaborador(this.colaboradorGuarda).then(colaborador => {this.obteneColaborador();this.mostrarMensajeEdicion("registró", colaborador)}, resultado =>  {
            this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al guardar el Colaborador ["+this.colaboradorGuarda.idColaborador+"] "+this.colaboradorGuarda.nombre }); this.blockService.cleanBlock();
        });
      }
      else {
        // Edicion registro
        this.colaboradorService.editarColaborador(this.colaboradorGuarda).then(colaborador => {this.obteneColaborador();this.mostrarMensajeEdicion("edito",colaborador)}, resultado => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al editar el Colaborador ["+this.colaboradorGuarda.idColaborador+"] "+this.colaboradorGuarda.nombre }); this.blockService.cleanBlock();
        });
      }
    }
  }

  // Funciones formulario

  mostrarMensajeEdicion(tipo: string,colaborador:CatalogoColaborador){
    this.habilitarInputs = false;
    this.menuBarActionService.asignarEstatusApertura();
    this.blockService.cleanBlock();
    this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Se "+tipo+" el Colaborador ["+colaborador.idColaborador+"] "+colaborador.nombre+" correctamente"});
    this.cancelar();
  }

  obteneColaborador() {
  this.colaboradorService.obtenerColaboradores().then(colaboradores => this.crearListaColaborador(colaboradores), resultado => {
    this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener los Usuarios" });
  });
  }

  crearListaColaborador(lista: CatalogoColaborador[]) {
    for (var i = 0; i < lista.length; i++) {
      lista[i].genero = "[" + lista[i].idGenero.idGenero + "] " + lista[i].idGenero.genero;
      lista[i].rolNegocio=" ";
      if(lista[i].rolADM == 1){
        lista[i].rolNegocio= lista[i].rolNegocio + "[ADM]"+" ";
      }
      if(lista[i].rolDM == 1){
        lista[i].rolNegocio= lista[i].rolNegocio + "[DM]"+" ";
      }

      if(lista[i].rolPL == 1){
        lista[i].rolNegocio= lista[i].rolNegocio + "[PL]"+" ";
      }
      if(lista[i].rolPXM == 1){
        lista[i].rolNegocio= lista[i].rolNegocio + "[PxM]"+" ";
      }

      if(lista[i].rolTL == 1){
        lista[i].rolNegocio= lista[i].rolNegocio + "[TL]"+" ";
      }
    }
    this.colaboradores = lista;
  }

  obtenerComboGenero() {
    this.catalogoGenericoService.obtenerCatalogos('catalogoGenero').then(elementos => {this.listaGeneros=this.comboService.crearListaComboBase(elementos) }  , resultado => {
      this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener Genero" });
    });
  }

}
