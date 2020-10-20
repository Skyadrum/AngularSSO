import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/model/BaseComponent';

// Services
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { CatalogoParametroService } from '@app/sso/service/catalogoParametros.service';
import { CatalogoSistemaService } from '@app/sso/service/catalogoSistema.service';
import { BlockService } from '@app/shared/service/Block.service';
import { ComboService } from '@app/shared/service/Combo.service';

// Models
import { OpcionSelect } from '@app/shared/model/Combo';
import { ConfirmationService } from 'primeng/api';
import { ParametroDTO } from '@app/sso/model/catalogoParametros';

@Component({
    selector: 'app-catalogo-parametros',
    templateUrl: './catalogoParametros.component.html'
})
export class CatalogoParametrosComponent extends BaseComponent implements OnInit {

    habilitarInputs: boolean;
    cols: any[];
    esNuevo: boolean = true;
    elementoSeleccionado: ParametroDTO;
    elementos: ParametroDTO[] = [];
    parametroDTO: ParametroDTO;
    elementoGuarda: ParametroDTO;
    listaSistema: OpcionSelect[] = [];
    opcionSistema: OpcionSelect;

    constructor(protected menuBarActionService: MenuBarActionService,
        protected menuHeaderService: MenuHeaderService,
        protected bitacoraService: BitacoraService,
        protected mensajeService: MensajeService,
        private catalogoParametroService: CatalogoParametroService,
        private catalogoSistemaService: CatalogoSistemaService,
        private blockService: BlockService,
        private confirmationService: ConfirmationService,
        private comboService: ComboService) {
        super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }

    ngOnInit(): void {
        this.cancelar();
        this.cols = [
            { field: "idParametro", header: "ID" },
            { field: "sistema", header: "Sistema" },
            { field: "parametro", header: "Parámetro" },
            { field: "dsParametro", header: "Descripción" },
        ];
        this.obtenerComboSistema();
    }

    obtenerComboSistema() {
        this.catalogoSistemaService.comboCatSistema().then(lista => {
            this.listaSistema = lista;
            this.obtenerCatalogoParametros();
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Sistemas");
        })
    }

    cambiarSistema(event) {
        if (event != null && event.value != null && event.value.value != null) {
            this.obtenerCatParametroById(event.value);
        } else {
            this.obtenerCatalogoParametros();
        }
    }

    obtenerCatParametroById(elemento: OpcionSelect) {
        let idSistema = elemento.value;
        this.catalogoParametroService.obtenerCatParametroById(idSistema).then(listaParametros => {
            for (let i = 0; i < listaParametros.length; i++) {
                for (let j = 0; j < this.listaSistema.length; j++) {
                    if (listaParametros[i].idSistema == Number(this.listaSistema[j].value)) {
                        listaParametros[i].sistema = this.listaSistema[j].name;
                    }
                }
            }
            this.elementos = listaParametros
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Parametros por Sistema");
        })
    }

    obtenerCatalogoParametros() {
        this.catalogoParametroService.obtenerCatParametro().then(listaParametros => {
            for (let i = 0; i < listaParametros.length; i++) {
                for (let j = 0; j < this.listaSistema.length; j++) {
                    if (listaParametros[i].idSistema == Number(this.listaSistema[j].value)) {
                        listaParametros[i].sistema = this.listaSistema[j].name;
                    }
                }
            }
            this.elementos = listaParametros
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Parametros");
        })
    }

    ejecutarBotonGuardar() {
        if (this.elementoGuarda != null) {
            this.blockService.setBlock();
            this.elementoGuarda.idSistema = this.comboService.obtenerValorCombo(this.opcionSistema);
            // Validaciones
            let listaErrores = []
            if (this.elementoGuarda.parametro == null || this.elementoGuarda.parametro.trim() == '') {
                listaErrores.push('Parámetro')
            }
            if (this.elementoGuarda.idSistema == null) {
                listaErrores.push('Sistema')
            }
            if (!this.mensajeService.validarCamposRequeridos(listaErrores)) {
                this.blockService.cleanBlock();
                return;
            }
            if (this.esNuevo) {
                // Alta registro
                this.catalogoParametroService.crearCatParametro(this.elementoGuarda).then(elemento => {
                    this.obtenerCatParametroById(this.opcionSistema);
                    this.mostrarMensaje("Registró", elemento);
                }, error => {
                    this.mensajeService.mandarMensajeError("Ocurrió un error al guardar el elemento [" + this.elementoGuarda.idParametro + "] " + this.elementoGuarda.parametro); this.blockService.cleanBlock();
                });
            } else {
                this.catalogoParametroService.editarCatParametro(this.elementoGuarda)
                    .then(elemento => {
                        this.obtenerCatParametroById(this.opcionSistema);
                        this.mostrarMensaje("Editó", this.elementoGuarda)
                    }, error => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al editar el elemento [" + this.elementoGuarda.idParametro + "] " + this.elementoGuarda.parametro); this.blockService.cleanBlock();
                    })
            }
        }
    }

    mostrarMensaje(tipo: string, registro: ParametroDTO) {
        this.habilitarInputs = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.blockService.cleanBlock();
        this.mensajeService.mandarMensajeSuccess("Se " + tipo + " el elemento [" + registro.idParametro + "] " + registro.parametro + " correctamente")
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
            idParametro: null,
            idSistema: null,
            parametro: null,
            dsParametro: null,
            sistema: null
        }
        this.parametroDTO = {
            idParametro: null,
            idSistema: null,
            parametro: null,
            dsParametro: null,
            sistema: null
        }
        this.elementoGuarda = {
            idParametro: null,
            idSistema: null,
            parametro: null,
            dsParametro: null,
            sistema: null
        }
    }

    ejecutarBotonEditar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.idParametro != null) {
            this.habilitarInputs = true;
            this.esNuevo = false;
            this.elementoGuarda = { ...this.elementoSeleccionado };
            this.opcionSistema = this.comboService.asignarValorCombo(this.elementoGuarda.idSistema, this.listaSistema);
            this.cambiarSistema({ value: this.opcionSistema });
            this.menuBarActionService.asignarEstatusEditar();
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un elemento de la tabla");
        }
    }

    elementoEliminado() {
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputs = false;
        this.mensajeService.mandarMensajeSuccess("Registro [" + this.elementoSeleccionado.idParametro + "] " + this.elementoSeleccionado.parametro + " eliminado correctamente");
        this.cancelar();
        this.obtenerCatParametroById(this.opcionSistema);
    }

    ejecutarBotonBorrar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.idParametro != null && !this.esNuevo) {
            this.confirmationService.confirm({
                message: '¿Está seguro de eliminar el registro [' + this.elementoSeleccionado.idParametro + '] ' + this.elementoSeleccionado.parametro + ' ?',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () => {
                    this.blockService.setBlock();
                    this.catalogoParametroService.borrarCatParametro(this.elementoSeleccionado)
                        .then(resultado => {
                            this.blockService.cleanBlock();
                            this.elementoEliminado()
                        }, error => {
                            this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el elemento [" + this.elementoSeleccionado.idParametro + "] " + this.elementoSeleccionado.parametro); this.blockService.cleanBlock();
                        });
                }
            });
        } else {
            this.mensajeService.mandarMensajeError("Debe estar editando un elemento para poder borrarlo");
        }
    }

}