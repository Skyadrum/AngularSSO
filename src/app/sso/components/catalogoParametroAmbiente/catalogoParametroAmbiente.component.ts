import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/model/BaseComponent';

// Services
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { CatalogoParametroAmbienteService } from '@app/sso/service/catalogoParametroAmbiente.service';
import { CatalogoParametroService } from '@app/sso/service/catalogoParametros.service';
import { BlockService } from '@app/shared/service/Block.service';
import { ComboService } from '@app/shared/service/Combo.service';
import { CatalogoAmbienteService } from '@app/sso/service/catalogoAmbientes.service';

// Models
import { OpcionSelect } from '@app/shared/model/Combo';
import { ConfirmationService } from 'primeng/api';
import { ParametroAmbienteDTO } from '@app/sso/model/catalogoParametroAmbiente';
import { ParametroDTO } from '@app/sso/model/catalogoParametros';
import { AmbientesDTO } from '@app/sso/model/catalogoAmbientes';


@Component({
    selector: 'app-catalogo-parametro-ambiente',
    templateUrl: './catalogoParametroAmbiente.component.html'
})

export class CatalogoParametroAmbienteComponent extends BaseComponent implements OnInit {

  elementoGuarda: ParametroAmbienteDTO;
  elementoSeleccionado: ParametroAmbienteDTO;
  parametroDTO: ParametroDTO;
  ambienteDTO:AmbientesDTO;
  listaParametroSelect: OpcionSelect[] = [];
  listaAmbienteSelect: OpcionSelect[] = [];
  cols: any[];
  elementoSeleccionadoParametro: ParametroAmbienteDTO;
  elementosParametroAmbiente: ParametroAmbienteDTO[] = [];
  elementosParametro: ParametroDTO[] = [];
  elementosAmbiente: AmbientesDTO[] = [];
  opcionParametro: OpcionSelect;
  opcionAmbiente: OpcionSelect;
  flagGuardar: boolean = false;
  valor: string = '';
  esNuevo: boolean = true;
  opcionSeguridad: OpcionSelect;
  elementos: ParametroAmbienteDTO[] = [];

  constructor(protected menuBarActionService: MenuBarActionService,
    protected menuHeaderService: MenuHeaderService,
    protected bitacoraService: BitacoraService,
    protected mensajeService: MensajeService,
    private catalogoParametroAmbienteService: CatalogoParametroAmbienteService,
    private catalogoParametroService: CatalogoParametroService,
    private catalogoAmbienteService: CatalogoAmbienteService,
    private blockService: BlockService,
    private confirmationService: ConfirmationService,
    private comboService: ComboService,) {
        super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }

    
  ngOnInit(): void {
      this.cancelar();
        this.cols = [
            { field: "idParametro", header: "ID Parametro" },
            { field: "idAmbiente", header: "ID Ambiente" },
            { field: "valor", header: "Valor Parámetro" },
            { field: "descAmbiente", header: "Ambiente" },
            { field: "descParametro", header: "Parámetro" },
        ];
        this.obtenerCatalogoParametros();
  }

  obtenerCatalogoParametrosAmbiente() {
      this.catalogoParametroAmbienteService.obtenerCatParametro().then(listaParametros => {
        let gridAuxiliar: ParametroAmbienteDTO [] = [];
        for(let i=0;i<listaParametros.length;i++){
          listaParametros[i].id=i;
          for(let j=0; j<this.listaAmbienteSelect.length; j++){
            if(listaParametros[i].idAmbiente==Number(this.listaAmbienteSelect[j].value)){
              listaParametros[i].descAmbiente=this.listaAmbienteSelect[j].name;
              j=this.listaAmbienteSelect.length;
            }
          }
          for(let j=0; j<this.listaParametroSelect.length; j++){
            if(listaParametros[i].idParametro==Number(this.listaParametroSelect[j].value)){
              listaParametros[i].descParametro=this.listaParametroSelect[j].name;
              j=this.listaParametroSelect.length;
            }
          }
          
          gridAuxiliar.push(listaParametros[i])
        }
          this.elementos = gridAuxiliar
      }, error => {
          this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Parametros de Ambiente");
      })
  }

  obtenerCatalogoParametros() {
    this.catalogoParametroService.comboCatParametro().then(listaParametros => {
      this.listaParametroSelect = listaParametros;
      this.obtenerCatalogoAmbiente();
    }, error=>{this.mensajeService.mandarMensajeError("Error al obtener catalogo de PARAMETROS");
    })
  }
  
  obtenerCatalogoAmbiente() {
    this.catalogoAmbienteService.comboCatAmbiente().then(listaAmbientes => {
      this.listaAmbienteSelect = listaAmbientes;
      this.obtenerCatalogoParametrosAmbiente();
    }, error=>{this.mensajeService.mandarMensajeError("Error al obtener catalogo de AMBIENTES");
    })
  }

  ejecutarBotonGuardar(){
    this.blockService.setBlock();
    this.elementoGuarda.idAmbiente = this.comboService.obtenerValorCombo(this.opcionAmbiente)
    this.elementoGuarda.idParametro = this.comboService.obtenerValorCombo(this.opcionParametro)
        

    // Validaciones
    let listaErrores = [];

    if(this.elementoGuarda.idAmbiente == null){
        listaErrores.push('Ambiente')
    }

    if( this.elementoGuarda.idParametro == null ){
        listaErrores.push('Parametro')
    }

    if( this.valor.trim() == '' ){
      listaErrores.push('Valor')
    }

    if (!this.mensajeService.validarCamposRequeridos(listaErrores)){
        this.blockService.cleanBlock();
        return;
    }
    
    this.elementoGuarda.idAmbiente = this.comboService.obtenerValorCombo(this.opcionAmbiente)
    this.elementoGuarda.idParametro = this.comboService.obtenerValorCombo(this.opcionParametro)
    this.elementoGuarda.valor = (this.valor);
        // Nuevo registro
        if (this.esNuevo) {
            // Alta de registro
            this.catalogoParametroAmbienteService.crearCatParametro(this.elementoGuarda)
                .then(elemento => {
                    this.mostrarMensaje("Registró exitoso");
                    this.blockService.cleanBlock();
                    this.reinicializar();
                }, error => {
                    this.mensajeService.mandarMensajeError("Ocurrió un error al guardar el elemento [" + this.elementoGuarda.idAmbiente + "] :" + this.elementoGuarda.valor+" POSIBLEMENTE VALOR DUPLICADO"); 
                    this.blockService.cleanBlock();
                });
        } else {
            this.catalogoParametroAmbienteService.editarCatParametro(this.elementoGuarda)
                .then(elemento => {
                    this.mostrarMensaje("Editó correctamente");
                    this.reinicializar();
                }, error => {
                    this.mensajeService.mandarMensajeError("Ocurrió un error al editar el elemento [" + this.elementoGuarda.idAmbiente + "] " + this.elementoGuarda.valor); 
                    this.blockService.cleanBlock();
                }); 
        }
  }

  ejecutarBotonNuevo() {
      this.flagGuardar = true;
      this.inicializar();
  }
  ejecutarBotonCancelar() {
    this.cancelar();
  }

  inicializar() {
    this.esNuevo = true;
    this.elementoSeleccionado = {
      idParametro: null,
      idAmbiente: null,
      valor: null,
      descAmbiente: null,
      descParametro: null,
      id: null    
    };
    this.elementoGuarda = this.elementoSeleccionado = {
      idParametro: null,
      idAmbiente: null,
      valor: null,
      descAmbiente: null,
      descParametro: null,
      id: null    
    };
    this.valor = '';
    this.opcionSeguridad = this.comboService.limpiarCombo();
  }

  cancelar() {
    this.flagGuardar = false;
    this.esNuevo = true;
    this.elementoSeleccionado = this.elementoSeleccionado = {
      idParametro: null,
      idAmbiente: null,
      valor: null,
      descAmbiente: null,
      descParametro: null,
      id: null    
    }
    this.elementoGuarda = this.elementoSeleccionado = {
      idParametro: null,
      idAmbiente: null,
      valor: null,
      descAmbiente: null,
      descParametro: null,
      id: null    
    }
    this.opcionSeguridad = this.comboService.limpiarCombo();
  }
  mostrarMensaje(tipo: string) {
    this.flagGuardar = false;
    this.menuBarActionService.asignarEstatusApertura();
    this.blockService.cleanBlock();
    this.mensajeService.mandarMensajeSuccess("Se  registro correctamente ")
    this.cancelar();
  }

  ejecutarBotonEditar() {
    if (this.elementoSeleccionado != null && this.elementoSeleccionado.idParametro != null) {
        this.flagGuardar = true;
        this.esNuevo = false;
        this.elementoGuarda = { ...this.elementoSeleccionado };
        this.opcionParametro = this.comboService.asignarValorCombo(this.elementoGuarda.idParametro, this.listaParametroSelect);
        this.cambiarParametro({ value: this.opcionParametro });
        this.opcionAmbiente = this.comboService.asignarValorCombo(this.elementoGuarda.idAmbiente, this.listaAmbienteSelect);
        this.cambiarAmbiente({ value: this.opcionAmbiente });
        this.menuBarActionService.asignarEstatusEditar();
        this.valor = this.elementoSeleccionado.valor;
    } else {
        this.mensajeService.mandarMensajeWarn("Seleccione un elemento de la tabla");
    }
}
cambiarParametro(event) {
  if (event != null && event.value != null && event.value.value != null) {
      this.obtenerCatParametroById(event.value);
  } else {
      this.obtenerCatalogoParametros();
  }
}
obtenerCatParametroById(elemento: OpcionSelect) {
  let idParametro = elemento.value;
  this.catalogoParametroService.obtenerCatParametroById(idParametro).then(listaParametros => {
      for (let i = 0; i < listaParametros.length; i++) {
          for (let j = 0; j < this.listaParametroSelect.length; j++) {
              if (listaParametros[i].idParametro == Number(this.listaParametroSelect[j].value)) {
                  listaParametros[i].parametro = this.listaParametroSelect[j].name;
              }
          }
      }
      this.elementosParametro = listaParametros
  }, error => {
      this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los valores de Parametros");
  })
}
cambiarAmbiente(event) {
  if (event != null && event.value != null && event.value.value != null) {
      this.obtenerCatAmbienteById(event.value);
  } else {
      this.obtenerCatalogoAmbiente();
  }
}
obtenerCatAmbienteById(elemento: OpcionSelect) {
  let idAmbiente = elemento.value;
  this.catalogoAmbienteService.obtenerCatAmbienteById(idAmbiente).then(listaAmbientes => {
      for (let i = 0; i < listaAmbientes.length; i++) {
          for (let j = 0; j < this.listaAmbienteSelect.length; j++) {
              if (listaAmbientes[i].idAmbiente == Number(this.listaAmbienteSelect[j].value)) {
                listaAmbientes[i].ambiente = this.listaAmbienteSelect[j].name;
              }
          }
      }
      this.elementosAmbiente = listaAmbientes
  }, error => {
      this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los valores de Ambiente");
  })
}
ejecutarBotonBorrar() {
  if (this.elementoSeleccionado != null && this.elementoSeleccionado.idParametro != null && !this.esNuevo) {
      this.confirmationService.confirm({
          message: '¿Está seguro de eliminar el registro [' + this.elementoSeleccionado.idParametro + '] ' + this.elementoSeleccionado.valor + ' ?',
          acceptLabel: 'Aceptar',
          rejectLabel: 'Cancelar',
          accept: () => {
              this.blockService.setBlock();
              this.catalogoParametroAmbienteService.borrarCatParametro(this.elementoSeleccionado)
                  .then(resultado => {
                      this.reinicializar();
                  }, error => {
                      this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el elemento [" + this.elementoSeleccionado.idParametro + "] " + this.elementoSeleccionado.valor); this.blockService.cleanBlock();
                  });
          }
      });
  } else {
      this.mensajeService.mandarMensajeError("Debe estar editando un elemento para poder borrarlo");
  }
}
reinicializar(){
  this.blockService.cleanBlock();
  this.inicializar();
  this.obtenerCatalogoParametrosAmbiente();
  this.flagGuardar = false;
}




    
}
