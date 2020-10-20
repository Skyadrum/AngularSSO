import { Component, OnInit } from '@angular/core';

import { MenuItem } from 'primeng/api/menuitem';
import { MessageService, ConfirmationService } from 'primeng/api';


import { ComboService } from 'src/app/shared/service/Combo.service';
import { CatalogoUsuario } from '../../model/catalogoUsuarios';
import { OpcionSelect } from '../../model/catalogoGenerico';

import { CatalogoUsuariosService } from '../../service/catalogoUsuarios.service';
import { CatalogoColaboradoresService } from '../../service/catalogoColaboradores.service';

import { BaseComponent } from '@app/shared/model/BaseComponent';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';

@Component({
  selector: 'app-catalogo-usuarios',
  templateUrl: './catalogoUsuarios.component.html'
})
export class CatalogoUsuariosComponent extends BaseComponent implements OnInit {

  usuarios: CatalogoUsuario[];
  usuarioSeleccionado: CatalogoUsuario = {
    idUsuario: null,
    usuario: null,
    clave: null,
    colaborador: null,
    idColaborador: {
      idColaborador: null,
      isColaborador: null,
      usuario: null,
      nombre: null,
      apellidoPaterno: null,
      apellidoMaterno: null,
      at: null,
      atImporte: null,
      idGenero: null,
      rolNegocio:null,
      rolTL: null,
      rolPL:null,
      rolDM:null,
      rolADM:null,
      rolPXM:null,
      genero:null
    }
  };
  usuarioGuarda = {
    idUsuario: null,
    usuario: null,
    clave: null,
    idColaborador: null
  };
  cols: any[];
  items: MenuItem[];
  muestraFormulario: boolean = false;
  columnasExportar: any[];
  esNuevo: boolean = true;
  listaColaboradores: OpcionSelect[];
  opcionCatalogo: OpcionSelect;
  habilitarInputs: boolean;

  constructor(
    protected menuHeaderService: MenuHeaderService,
    protected menuBarActionService: MenuBarActionService,
    protected mensajeService: MensajeService,
    protected bitacoraService: BitacoraService,
    private catalogoUsuariosService: CatalogoUsuariosService,
    private catalogoColaboradoresService: CatalogoColaboradoresService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private comboService: ComboService) { 
      super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }

  ngOnInit(): void {
    this.cols = [
      { field: "idUsuario", header: "Id Usuario" },
      { field: "usuario", header: "Usuario" },
      { field: "clave", header: "Clave" },
      { field: "colaborador", header: "Colaborador" },
    ];

    this.obtenerUsuarios();
    this.obtenerColaboradores();
  }

  // Barra acciones
  ejecutarBotonNuevo() {
    this.habilitarInputs = true;
    this.cancelar();
  }

  ejecutarBotonCancelar() {
    this.habilitarInputs = false;
    this.cancelar();
  }

  ejecutarBotonEditar() {
    if (this.usuarioSeleccionado != null && this.usuarioSeleccionado.idUsuario != null) {
      this.habilitarInputs = true;
      this.menuBarActionService.asignarEstatusEditar();
      this.esNuevo = false;
      this.usuarioGuarda = { ...this.usuarioSeleccionado };
      this.opcionCatalogo = this.comboService.asignarValorCombo(this.usuarioSeleccionado.idColaborador.idColaborador, this.listaColaboradores);
    } else {
      this.messageService.add({ severity: 'warn', summary: "Resultado", detail: "Seleccione un Usuario de la tabla" });
    }
  }

  usuarioEliminado() {
    this.menuBarActionService.asignarEstatusApertura();
    this.habilitarInputs = false;
    this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Usuario ["+this.usuarioSeleccionado.idUsuario+"] "+this.usuarioSeleccionado.usuario+" eliminado correctamente" });
    this.cancelar();
    this.obtenerUsuarios();
  }

  ejecutarBotonBorrar() {
    if (this.usuarioSeleccionado != null && this.usuarioSeleccionado.idUsuario != null) {
      this.confirmationService.confirm({
        message: '¿Está seguro de eliminar el Usuario ['+this.usuarioSeleccionado.idUsuario+'] '+this.usuarioSeleccionado.usuario+' ?',
        acceptLabel: 'Aceptar',
        rejectLabel: 'Cancelar',
        accept: () => {
          this.catalogoUsuariosService.eliminarUsuario({ idUsuario: this.usuarioSeleccionado.idUsuario, idColaborador: this.usuarioSeleccionado.idColaborador.idColaborador }).then(resultado => this.usuarioEliminado(), estatus => {
            this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al eliminar el Usuario ["+this.usuarioSeleccionado.idUsuario+"] " + this.usuarioSeleccionado.usuario });
          });
        }
      });
    } else {
      this.messageService.add({ severity: 'warn', summary: "Advertencia", detail: "Seleccione un Usuario de la tabla" });
    }
  }

  // Funciones formulario
  cancelar() {
    this.esNuevo = true;
    this.opcionCatalogo = this.comboService.limpiarCombo();

    this.usuarioGuarda = {
      idUsuario: null,
      usuario: null,
      clave: null,
      idColaborador: null
    };

    this.usuarioSeleccionado = {
      idUsuario: null,
      usuario: null,
      clave: null,
      colaborador: null,
      idColaborador: {
        idColaborador: null,
        isColaborador: null,
        usuario: null,
        nombre: null,
        apellidoPaterno: null,
        apellidoMaterno: null,
        at: null,
        atImporte: null,
        idGenero: null,
        rolNegocio:null,
        rolTL: null,
        rolPL:null,
        rolDM:null,
        rolADM:null,
        rolPXM:null,
        genero:null,
      }
    };
  }

  ejecutarBotonGuardar() {
    if (this.usuarioGuarda != null) {
      this.usuarioGuarda.idColaborador = this.comboService.obtenerValorCombo(this.opcionCatalogo);
      if (this.esNuevo) {
        this.usuarioGuarda.idUsuario = 0; 
        // Alta registro
        this.catalogoUsuariosService.registrarUsuario(this.usuarioGuarda).then(usuario => { this.obtenerUsuarios(); this.mostrarMensaje("registró", usuario) }, resultado => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al guardar el Usuario ["+this.usuarioGuarda.idUsuario+"] "+this.usuarioGuarda.usuario });
        });
      }
      else {
        // Edicion registro
        this.catalogoUsuariosService.editarUsuario(this.usuarioGuarda).then(usuario => { this.obtenerUsuarios(); this.mostrarMensaje("editó", usuario) }, resultado => {
          this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al editar el Usuario ["+this.usuarioGuarda.idUsuario+"] "+this.usuarioGuarda.usuario });
        });
      }
    }
  }

  mostrarMensaje(tipo: string, registro: CatalogoUsuario) {
    this.habilitarInputs = false;
    this.menuBarActionService.asignarEstatusApertura();
    this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Se "+tipo+" el Usuario ["+registro.idUsuario+"] "+registro.usuario+" correctamente" });
    this.cancelar();

  }

  obtenerUsuarios() {
    this.catalogoUsuariosService.obtenerUsuarios().then(usuarios => this.crearListaUsuarios(usuarios), resultado => {
      this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener los Usuarios" });
    });
  }

  crearListaUsuarios(lista: CatalogoUsuario[]) {
    for (var i = 0; i < lista.length; i++) {
      lista[i].colaborador = "[" + lista[i].idColaborador.idColaborador + "] " + lista[i].idColaborador.nombre + " " + lista[i].idColaborador.apellidoPaterno
    }
    this.usuarios = lista;
  }

  obtenerColaboradores() {
    this.catalogoColaboradoresService.obtenerColaboradores().then(colaboradores => this.crearListaColaboradores(colaboradores), resultado => {
      this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener los Colaboradores" });
    });
  }

  crearListaColaboradores(lista: any[]) {
    let listaAuxColaboradores: OpcionSelect[] = [];
    for (var i = 0; i < lista.length; i++) {
      listaAuxColaboradores.push({
        value: String(lista[i].idColaborador),
        name: "[" + lista[i].isColaborador + "] " + lista[i].nombre + " " + lista[i].apellidoPaterno
      });
    }
    this.listaColaboradores = listaAuxColaboradores;
  }

}
