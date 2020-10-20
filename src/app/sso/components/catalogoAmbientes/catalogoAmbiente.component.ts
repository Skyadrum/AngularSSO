import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/model/BaseComponent';

// Services
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { CatalogoAmbienteService } from '@app/sso/service/catalogoAmbientes.service';
import { CatalogoSistemaService } from '@app/sso/service/catalogoSistema.service';

// Models
import { OpcionSelect } from '@app/shared/model/Combo';
import { AmbientesDTO } from '@app/sso/model/catalogoAmbientes';
import { ComboService } from '@app/shared/service/Combo.service';
import { BlockService } from '@app/shared/service/Block.service';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-catalogo-ambiente',
    templateUrl: './catalogoAmbiente.component.html'
})
export class CatalogoAmbientesComponent extends BaseComponent implements OnInit {

    habilitarInputs: boolean;
    habilitarInputPrincipal: boolean;
    cols: any[];
    elementos: AmbientesDTO[] = [];
    elementoSeleccionado: AmbientesDTO;
    esNuevo: boolean = true;
    listaSistema: OpcionSelect[] = [];
    opcionSistema: OpcionSelect;
    inicio: OpcionSelect;
    principal: boolean;
    elementoGuarda: AmbientesDTO;

    constructor(protected menuBarActionService: MenuBarActionService,
        protected menuHeaderService: MenuHeaderService,
        protected bitacoraService: BitacoraService,
        protected mensajeService: MensajeService,
        private catalogoAmbientesService: CatalogoAmbienteService,
        private catalogoSistemaService: CatalogoSistemaService,
        private comboService: ComboService,
        private blockService: BlockService,
        private confirmationService: ConfirmationService,
    ) {
        super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }

    ngOnInit(): void {
        this.cancelar();
        this.cols = [
            { field: "idAmbiente", header: "Id" },
            { field: "sistema", header: "Sistema" },
            { field: "ambiente", header: "Ambiente" },
            { field: "ambientePrincipal", header: "Ambiente Principal" },
            { field: "ambienteBloqueado", header: "Ambiente Bloqueado" },
            { field: "dsAmbiente", header: "Descripción" },
        ];
        this.obtenerComboSistema();
    }

    obtenerComboSistema() {
        this.catalogoSistemaService.comboCatSistema().then(lista => {
            this.listaSistema = lista;
            this.obtenerCatalogoAmbiente();
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Sistemas");
        })
    }

    cambiarSistema(event) {
        if (event != null && event.value != null && event.value.value != null) {
            this.obtenerCatalogoAmbienteById(event.value);
        } else {
            this.obtenerCatalogoAmbiente();
        }
    }

    obtenerCatalogoAmbienteById(elemento: OpcionSelect) {
        let idSistema = elemento.value;
        this.catalogoAmbientesService.obtenerCatAmbienteById(idSistema).then(listaAmbiente => {
            for (let i = 0; i < listaAmbiente.length; i++) {
                for (let j = 0; j < this.listaSistema.length; j++) {
                    if (listaAmbiente[i].idSistema == Number(this.listaSistema[j].value)) {
                        listaAmbiente[i].sistema = this.listaSistema[j].name;
                        listaAmbiente[i].ambientePrincipal = (listaAmbiente[i].bolAmbientePrincipal == 1 ? "Sí" : "No");
                        if (listaAmbiente[i].bolAmbientePrincipal == 1) this.principal = true;
                        listaAmbiente[i].ambienteBloqueado = (listaAmbiente[i].bolAmbienteBloqueado == 1 ? "Sí" : "No");
                    }
                }
            }
            this.elementos = listaAmbiente;
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Ambientes");
        })
    }

    obtenerCatalogoAmbiente() {
        this.catalogoAmbientesService.obtenerCatAmbiente().then(listaAmbiente => {
            for (let i = 0; i < listaAmbiente.length; i++) {
                for (let j = 0; j < this.listaSistema.length; j++) {
                    if (listaAmbiente[i].idSistema == Number(this.listaSistema[j].value)) {
                        listaAmbiente[i].sistema = this.listaSistema[j].name;
                        listaAmbiente[i].ambientePrincipal = (listaAmbiente[i].bolAmbientePrincipal == 1 ? "Sí" : "No");
                        listaAmbiente[i].ambienteBloqueado = (listaAmbiente[i].bolAmbienteBloqueado == 1 ? "Sí" : "No");
                    }
                }
            }
            this.elementos = listaAmbiente;
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Ambientes");
        })
    }

    ejecutarBotonGuardar() {
        if (this.elementoGuarda != null) {
            this.blockService.setBlock();
            this.elementoGuarda.idSistema = this.comboService.obtenerValorCombo(this.opcionSistema);
            // Validacion
            let listaErrores = []
            if (this.elementoGuarda.ambiente == null || this.elementoGuarda.ambiente.trim() == '') {
                listaErrores.push('Ambiente')
            }
            if (this.elementoGuarda.idSistema == null) {
                listaErrores.push('Sistema')
            }
            if (!this.mensajeService.validarCamposRequeridos(listaErrores)) {
                this.blockService.cleanBlock();
                return;
            }
            this.elementoGuarda.bolAmbienteBloqueado = (this.elementoGuarda.bolAmbienteBloqueado ? 1 : 0);
            this.elementoGuarda.bolAmbientePrincipal = (this.elementoGuarda.bolAmbientePrincipal ? 1 : 0);

            if (this.esNuevo) {
                // Alta registro
                this.catalogoAmbientesService.crearCatAmbiente(this.elementoGuarda).then(elemento => {
                    this.obtenerCatalogoAmbienteById(this.opcionSistema);
                    this.mostrarMensaje("Registró", elemento);
                }, error => {
                    this.mensajeService.mandarMensajeError("Ocurrió un error al guardar el elemento [" + this.elementoGuarda.idAmbiente + "] " + this.elementoGuarda.ambiente); this.blockService.cleanBlock();
                });
            } else {
                // Edicion registro
                this.catalogoAmbientesService.editarCatAmbiente(this.elementoGuarda)
                    .then(elemento => {
                        this.obtenerCatalogoAmbienteById(this.opcionSistema);
                        this.mostrarMensaje("Editó", this.elementoGuarda);
                    }, error => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al editar el elemento [" + this.elementoGuarda.idAmbiente + "] " + this.elementoGuarda.ambiente); this.blockService.cleanBlock();
                    });
            }
        }
    }

    mostrarMensaje(tipo: string, registro: AmbientesDTO) {
        this.habilitarInputs = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.blockService.cleanBlock();
        this.mensajeService.mandarMensajeSuccess("Se " + tipo + " el elemento [" + registro.idAmbiente + "] " + registro.ambiente + " correctamente")
        this.cancelar();
    }

    ejecutarBotonNuevo() {
        this.habilitarInputs = true;
        this.obtenerCatalogoAmbiente();
        this.cancelar();
    }

    ejecutarBotonCancelar() {
        this.habilitarInputs = false;
        this.cancelar();
    }

    ejecutarBotonEditar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.idAmbiente != null) {
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
        this.mensajeService.mandarMensajeSuccess("Registro [" + this.elementoSeleccionado.idAmbiente + "] " + this.elementoSeleccionado.ambiente + " eliminado correctamente");
        this.cancelar();
        this.obtenerCatalogoAmbienteById(this.opcionSistema);
    }

    ejecutarBotonBorrar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.idAmbiente != null && !this.esNuevo) {
            this.confirmationService.confirm({
                message: '¿Está seguro de eliminar el registro [' + this.elementoSeleccionado.idAmbiente + '] ' + this.elementoSeleccionado.ambiente + ' ?',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () => {
                    this.blockService.setBlock();
                    this.catalogoAmbientesService.borrarCatAmbiente(this.elementoSeleccionado)
                        .then(resultado => {
                            this.blockService.cleanBlock();
                            this.elementoEliminado()
                        }, error => {
                            this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el elemento [" + this.elementoSeleccionado.idAmbiente + "] " + this.elementoSeleccionado.ambiente); this.blockService.cleanBlock();
                        });
                }
            });
        } else {
            this.mensajeService.mandarMensajeError("Debe estar editando un elemento para poder borrarlo");
        }
    }

    cancelar() {
        this.esNuevo = true;
        this.elementoSeleccionado = {
            idAmbiente: null,
            ambiente: null,
            idSistema: null,
            sistema: null,
            dsAmbiente: null,
            bolAmbientePrincipal: null,
            ambientePrincipal: null,
            bolAmbienteBloqueado: null,
            ambienteBloqueado: null,
        };
        this.elementoGuarda = {
            idAmbiente: null,
            ambiente: null,
            idSistema: null,
            sistema: null,
            dsAmbiente: null,
            bolAmbientePrincipal: null,
            ambientePrincipal: null,
            bolAmbienteBloqueado: null,
            ambienteBloqueado: null,
        };
    }

}