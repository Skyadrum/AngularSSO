import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/model/BaseComponent';

// Services
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { CatalogoConexionService } from '@app/sso/service/catalogoConexiones.service';
import { CatalogoSistemaService } from '@app/sso/service/catalogoSistema.service';
import { ComboService } from '@app/shared/service/Combo.service';
import { BlockService } from '../../../shared/service/Block.service';
import { ConfirmationService } from 'primeng/api';

// Models
import { ConexionDTO } from '@app/sso/model/catalogoConexiones';
import { OpcionSelect } from '@app/shared/model/Combo';




@Component({
    selector: 'app-catalogo-conexiones',
    templateUrl: './catalogoConexiones.component.html'
})

export class CatalogoConexionesComponent extends BaseComponent implements OnInit {
    
    habilitarInputs: boolean;
    cols: any[];
    esNuevo: boolean = true;
    elementos: ConexionDTO[] = [];
    elementoSeleccionado: ConexionDTO;
    elementoGuarda: ConexionDTO;
    conexionDTO: ConexionDTO;
    listaSistema: OpcionSelect[] = [];
    opcionSistema: OpcionSelect

    constructor( protected menuBarActionService: MenuBarActionService,
                 protected menuHeaderService: MenuHeaderService,
                 protected bitacoraService: BitacoraService,
                 protected mensajeService: MensajeService,
                 private catalogoConexionService: CatalogoConexionService,
                 private catalogoSistemaService: CatalogoSistemaService,
                 private blockService: BlockService,
                 private comboService: ComboService,
                 private confirmationService: ConfirmationService){
        super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }
    
    ngOnInit(): void {
        this.cancelar()
        this.cols = [
            { field: "idConexion", header: "ID" },
            { field: "sistema", header: "Sistema" },
            { field: "conexion", header: "Conexión" },
            { field: "dsConexion", header: "Descripción" },
        ];
        this.obtenerComboSistema();
    }
    
    obtenerComboSistema(){
        this.catalogoSistemaService.comboCatSistema().then(lista => {            
            this.listaSistema = lista
            this.obtenerCatConexiones()
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Sistemas");
        })
    }

    cambiarSistema(event) {
        if (event != null && event.value != null && event.value.value != null) {
            this.obtenerCatConexionesById(event.value);
        }else{
            this.obtenerCatConexiones();
        }
    }

    obtenerCatConexionesById(elemento: OpcionSelect){
        let idSistema = elemento.value;

        this.catalogoConexionService.obtenerCatConexionById(idSistema).then(listaConexiones => {
            for (let i = 0; i < listaConexiones.length; i++) {
                for (let j = 0; j < this.listaSistema.length; j++) {
                    if (listaConexiones[i].idSistema == Number(this.listaSistema[j].value)) {
                        listaConexiones[i].sistema = this.listaSistema[j].name;
                    }
                }
            }
            this.elementos = listaConexiones
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Parametros por Sistema");
        })
    }

    obtenerCatConexiones(){
        this.catalogoConexionService.obtenerCatConexion()
            .then(conexiones => {
                for (let i = 0; i < conexiones.length; i++) {
                    for (let j = 0; j < this.listaSistema.length; j++) {
                        if (conexiones[i].idSistema == Number(this.listaSistema[j].value)) {
                            conexiones[i].sistema = this.listaSistema[j].name;
                        }
                    }
                }
                this.elementos = conexiones
            }, error => {
                this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Parametros por Sistema");
            })
    }

    ejecutarBotonGuardar(){
        if (this.elementoGuarda != null) {
            this.blockService.setBlock();

            this.elementoGuarda.idSistema = this.comboService.obtenerValorCombo(this.opcionSistema)

            // Valiaciones
            let listaErrores = []

            if(this.elementoGuarda.conexion == null || this.elementoGuarda.conexion.trim() == ''){
                listaErrores.push('Conexión')
            }

            if(this.elementoGuarda.idSistema == null){
                listaErrores.push('Sistema')
            }

            if (!this.mensajeService.validarCamposRequeridos(listaErrores)){
                this.blockService.cleanBlock();
                return;
            }

            if (this.esNuevo) {
                // Alta de registro
                this.catalogoConexionService.crearCatConexion(this.elementoGuarda)
                    .then(elemento => {
                        this.obtenerCatConexionesById(this.opcionSistema);
                        this.mostrarMensaje("Registró", elemento);
                    }, error => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al guardar el elemento [" + this.elementoGuarda.idConexion + "] " + this.elementoGuarda.conexion); this.blockService.cleanBlock();
                    });
            } else {
                this.catalogoConexionService.editarCatConexion(this.elementoGuarda)
                    .then(elemento => {
                        this.obtenerCatConexionesById(this.opcionSistema);
                        this.mostrarMensaje("Editó", this.elementoGuarda);
                    }, error => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al editar el elemento [" + this.elementoGuarda.idConexion + "] " + this.elementoGuarda.conexion); this.blockService.cleanBlock();
                    });
            }
        }
    }

    ejecutarBotonEditar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.idConexion != null) {
            this.habilitarInputs = true;
            this.esNuevo = false;
            this.elementoGuarda = { ...this.elementoSeleccionado };
            this.opcionSistema = this.comboService.asignarValorCombo(this.elementoGuarda.idSistema, this.listaSistema);
            this.cambiarSistema({value: this.opcionSistema});
            this.menuBarActionService.asignarEstatusEditar();
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un elemento de la tabla");
        }
    }

    elementoEliminado() {
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputs = false;
        this.mensajeService.mandarMensajeSuccess("Registro [" + this.elementoSeleccionado.idConexion + "] " + this.elementoSeleccionado.conexion + " eliminado correctamente");
        this.cancelar();
        this.obtenerCatConexionesById(this.opcionSistema);
    }

    ejecutarBotonBorrar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.idConexion != null && !this.esNuevo) {
            this.confirmationService.confirm({
                message: '¿Está seguro de eliminar el registro [' + this.elementoSeleccionado.idConexion + '] ' + this.elementoSeleccionado.conexion + ' ?',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () => {
                    this.blockService.setBlock();
                    this.catalogoConexionService.borrarCatConexion(this.elementoSeleccionado)
                        .then(resultado => {
                            this.blockService.cleanBlock();
                            this.elementoEliminado()
                        }, error => {
                            this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el elemento [" + this.elementoSeleccionado.idConexion + "] " + this.elementoSeleccionado.conexion); 
                            this.blockService.cleanBlock();
                        });
                }
            });
        } else {
            this.mensajeService.mandarMensajeError("Debe estar editando un elemento para poder borrarlo");
        }
    }

    mostrarMensaje(tipo: string, registro: ConexionDTO) {
        this.habilitarInputs = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.blockService.cleanBlock();
        this.mensajeService.mandarMensajeSuccess("Se " + tipo + " el elemento [" + registro.idConexion + "] " + registro.conexion + " correctamente")
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

    cancelar() {
        this.esNuevo = true;
        this.elementoSeleccionado = {
            idConexion: null,
            idSistema: null,
            conexion: null,
            dsConexion: null,
            sistema: null
        }
        this.conexionDTO = {
            idConexion: null,
            idSistema: null,
            conexion: null,
            dsConexion: null,
            sistema: null
        }
        this.elementoGuarda={
            idConexion: null,
            idSistema: null,
            conexion: null,
            dsConexion: null,
            sistema: null
        }
    }

}