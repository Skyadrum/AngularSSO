import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/model/BaseComponent';
import { ConfirmationService } from 'primeng/api';

// Services
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { CatalogoUsuaiosService } from '@app/sso/service/catalogoUsuarios.service';
import { EncryptService } from '@app/shared/service/Encrypt.service';

// Models
import { UsuarioDTO } from '../../model/catalogoUsuarios';
import { BlockService } from '@app/shared/service/Block.service';
import { ConfiguracionParametro, ConfiguracionRespuesta } from '../../model/configuracionParametro';

@Component({
    selector: 'app-catalogo-usuarios',
    templateUrl: './catalogoUsuarios.component.html'
})
export class CatalogoUsuariosComponentSSO extends BaseComponent implements OnInit {

    EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    habilitarInputs: boolean;
    habilitarInputsUsuario: boolean;
    cols: any[];
    esNuevo: boolean = true;
    elementoSeleccionado: UsuarioDTO;
    elementos: UsuarioDTO[];
    usuarioDTO: UsuarioDTO;
    elementoGuarda: UsuarioDTO;
    configuracionParametro: ConfiguracionParametro;
    configuracionRespuesta: ConfiguracionRespuesta;
    respaldoPassword: string;

    constructor(protected menuBarActionService: MenuBarActionService,
        protected menuHeaderService: MenuHeaderService,
        protected bitacoraService: BitacoraService,
        private blockService: BlockService,
        protected mensajeService: MensajeService,
        private confirmationService: ConfirmationService,
        private encryptService: EncryptService,
        private catalogoUsuariosService: CatalogoUsuaiosService) {
        super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }

    ngOnInit(): void {
        this.cancelar();
        this.inicializar();
        this.cols = [
            { field: "usuario", header: "Usuario" },
            { field: "isUsuario", header: "IS" },
            { field: "nombre", header: "Nombre" },
            { field: "apellidoPaterno", header: "Apellido Paterno" },
            { field: "apellidoMaterno", header: "Apellido Materno" },
            { field: "correoElectronico", header: "Correo Electrónico" },
            { field: "idColaborador", header: "ID Colaborador" },
            { field: "usuarioActivo", header: "Usuario Bloqueado" },
            { field: "envioNotificaciones", header: "Enviar Notificaciones" }
        ];
        this.obtenerCatalogoUsuarios();
        this.obtenerConfiguracionEncriptacion();
    }

    obtenerCatalogoUsuarios() {
        this.obtenerConfiguracionEncriptacion();
        this.catalogoUsuariosService.obtenerCatUsuario().then(listaUsuarios => this.crearTablaUsuarios(listaUsuarios),
            result => this.mensajeService.mandarMensajeError('Ocurrio un error al obtener CatUusarios'));
    }

    obtenerConfiguracionEncriptacion() {
        this.configuracionParametro.parametro = "MEncripcion"
        this.catalogoUsuariosService.obtenerConfiguracionEncriptacion(this.configuracionParametro).
            then(configuracion =>
                this.asignarValor(configuracion),
                result => this.mensajeService.mandarMensajeError('Ocurrio un error al obtener Configuracion de Encriptacion'));
    }

    asignarValor(configuracionRespuesta: any) {
        this.configuracionRespuesta = configuracionRespuesta;
    }

    crearTablaUsuarios(lista: UsuarioDTO[]) {
        for (let i = 0; i < lista.length; i++) {
            lista[i].envioNotificaciones = (lista[i].bolEnvioNotificaciones == 1 ? "Sí" : "No");
            lista[i].usuarioActivo = (lista[i].bolUsuarioActivo == 1 ? "Sí" : "No");
        }
        this.elementos = lista;
    }

    async ejecutarBotonGuardar() {
        if (this.elementoGuarda != null) {
            this.blockService.setBlock();
            let listaErrores = [];
            // Validacion
            if (this.elementoGuarda.usuario == null || this.elementoGuarda.usuario.trim() == "") {
                listaErrores.push("Usuario");
            }
            if (this.elementoGuarda.correoElectronico != null) {
                this.elementoGuarda.correoElectronico = this.elementoGuarda.correoElectronico.trim();
                if (this.elementoGuarda.correoElectronico == "") {
                    this.elementoGuarda.correoElectronico = null;
                }
            }
            if (this.elementoGuarda.correoElectronico != null && !this.EMAIL_REGEXP.test(this.elementoGuarda.correoElectronico)) {
                listaErrores.push("Correo Electrónico válido");
            }
            if (!this.mensajeService.validarCamposRequeridos(listaErrores)) {
                this.blockService.cleanBlock();
                return;
            }
            this.elementoGuarda.bolEnvioNotificaciones = (this.elementoGuarda.bolEnvioNotificaciones ? 1 : 0);
            this.elementoGuarda.bolUsuarioActivo = (this.elementoGuarda.bolUsuarioActivo ? 1 : 0);
            if (this.elementoGuarda.usrPWD != 'PASSWORD') {
                let objetoEncriptar = {
                    cadena: this.elementoGuarda.usrPWD,
                    key: "STK_AppDev_oper20",
                    encoder: this.configuracionRespuesta.valor,
                }
                try {
                    let response = await this.encryptService.encriptarTexto(objetoEncriptar);
                    this.respaldoPassword = response.cadena;
                } catch (error) {
                    this.mensajeService.mandarMensajeError("Ocurrió un error al encriptar texto");
                    this.blockService.cleanBlock();
                    return;
                }
                this.elementoGuarda.usrPWD = this.respaldoPassword;
            }
            if (this.esNuevo) {
                // Alta registro
                this.catalogoUsuariosService.crearCatUsuaio(this.elementoGuarda)
                    .then(elemento => { this.obtenerCatalogoUsuarios(); this.mostrarMensaje("Registró", elemento); }, resultado => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al guardar el elemento [" + this.elementoGuarda.usuario + "] "); this.blockService.cleanBlock();
                    });
            } else {
                // Edicion registro
                this.catalogoUsuariosService.editarCatUsuario(this.elementoGuarda)
                    .then(elemento => { this.obtenerCatalogoUsuarios(); this.mostrarMensaje("Editó", this.elementoGuarda); }, resultado => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al editar el elemento [" + this.elementoGuarda.usuario + "] "); this.blockService.cleanBlock();
                    });
            }
        }
    }

    mostrarMensaje(tipo: string, registro: UsuarioDTO) {
        this.habilitarInputs = false;
        this.habilitarInputsUsuario = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.blockService.cleanBlock();
        this.mensajeService.mandarMensajeSuccess("Se " + tipo + " el elemento [" + registro.usuario + "] " + " " + " correctamente")
        this.cancelar();
    }

    ejecutarBotonEditar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.usuario != null) {
            this.habilitarInputs = true;
            this.habilitarInputsUsuario = false;
            this.esNuevo = false;
            this.elementoSeleccionado.usrPWD = 'PASSWORD';
            this.elementoGuarda = { ...this.elementoSeleccionado };
            this.menuBarActionService.asignarEstatusEditar();
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un elemento de la tabla");
        }
    }

    ejecutarBotonBorrar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.usuario != null && !this.esNuevo) {
            this.confirmationService.confirm({
                message: '¿Está seguro de eliminar el registro [' + this.elementoSeleccionado.usuario + '] ' + ' ?',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () => {
                    this.blockService.setBlock();
                    this.catalogoUsuariosService.borrarCatUsuario(this.elementoGuarda)
                        .then(resultado => {
                            this.blockService.cleanBlock();
                            this.elementoEliminado()
                        }, estatus => { this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el elemento [" + this.elementoSeleccionado.usuario + "] "); this.blockService.cleanBlock(); });
                }
            });
        } else {
            this.mensajeService.mandarMensajeError("Debe estar editando un elemento para poder borrarlo");
        }
    }

    elementoEliminado() {
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputs = false;
        this.habilitarInputsUsuario = false;
        this.mensajeService.mandarMensajeSuccess("Registro [" + this.elementoSeleccionado.usuario + "] " + " eliminado correctamente");
        this.cancelar();
        this.obtenerCatalogoUsuarios();
    }

    ejecutarBotonNuevo() {
        this.habilitarInputs = true;
        this.habilitarInputsUsuario = true;
        this.cancelar();
    }

    ejecutarBotonCancelar() {
        this.habilitarInputs = false;
        this.habilitarInputsUsuario = false;
        this.cancelar();
    }

    cancelar() {
        this.esNuevo = true;
        this.elementoSeleccionado = {
            usuario: null,
            usrPWD: null,
            isUsuario: null,
            nombre: null,
            apellidoPaterno: null,
            apellidoMaterno: null,
            correoElectronico: null,
            idColaborador: null,
            bolEnvioNotificaciones: null,
            bolUsuarioActivo: null,
            envioNotificaciones: null,
            usuarioActivo: null
        }
        this.usuarioDTO = {
            usuario: null,
            usrPWD: null,
            isUsuario: null,
            nombre: null,
            apellidoPaterno: null,
            apellidoMaterno: null,
            correoElectronico: null,
            idColaborador: null,
            bolEnvioNotificaciones: null,
            bolUsuarioActivo: null,
            envioNotificaciones: null,
            usuarioActivo: null
        }
        this.elementoGuarda = {
            usuario: null,
            usrPWD: null,
            isUsuario: null,
            nombre: null,
            apellidoPaterno: null,
            apellidoMaterno: null,
            correoElectronico: null,
            idColaborador: null,
            bolEnvioNotificaciones: null,
            bolUsuarioActivo: null,
            envioNotificaciones: null,
            usuarioActivo: null

        }
    }

    inicializar() {
        this.configuracionParametro = {
            parametro: null,
        }
        this.configuracionRespuesta = {
            clave: null,
            valor: null
        }
    }

}