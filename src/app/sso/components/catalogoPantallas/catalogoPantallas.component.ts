import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '@app/shared/model/BaseComponent';

// Services
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { BlockService } from '@app/shared/service/Block.service';
import { ConfirmationService } from 'primeng/api';
import { CatalogoPantallasService } from '@app/sso/service/catalogoPantallas.service';
import { CatalogoAmbienteService } from '@app/sso/service/catalogoAmbientes.service';
import { CatalogoUsuaiosService } from '../../service/catalogoUsuarios.service';
import { ComboService } from '@app/shared/service/Combo.service';


// Models
import { PantallaDTO, MenuPantallaDTO } from '@app/sso/model/catalogoPantallas';
import { OpcionSelect } from '../../../shared/model/Combo';
import { TreeNode } from 'primeng/api';
import { AmbientesDTO } from '@app/sso/model/catalogoAmbientes';



@Component({
    selector: 'app-catalogo-pantallas',
    templateUrl: './catalogoPantallas.component.html'
})

export class CatalogoPantallasComponent extends BaseComponent implements OnInit {

    @Output() openMenu = new EventEmitter<any>();
    
    cols: any[];
    esNuevo: boolean = true;
    habilitarInputs: boolean;
    elementoSeleccionado: PantallaDTO;
    elementoGuarda: PantallaDTO;
    pantallaDTO: PantallaDTO;
    elementos: PantallaDTO [] = [];
    comboAmbiente: OpcionSelect [] = [];
    comboUsuarios: OpcionSelect [] = [];
    comboPropSistema: OpcionSelect [] = [];
    listaAmbientes: OpcionSelect[] = [];
    
    opcionAmbiente: OpcionSelect;
    opcionPropNegocio: OpcionSelect;
    opcionPropSistema: OpcionSelect;

    elementosAmbiente: AmbientesDTO [] = [];

    listaPermisos: boolean[];
    files1: TreeNode[] = [];
    elementoSeleccionadoArbol: TreeNode;
    items:MenuPantallaDTO[];
    //items:TreeNode[];
    


    constructor( protected menuBarActionService: MenuBarActionService,
        protected menuHeaderService: MenuHeaderService,
        protected bitacoraService: BitacoraService,
        protected mensajeService: MensajeService,
        private blockService: BlockService,
        private catalogoAmbienteService: CatalogoAmbienteService,
        private confirmationService: ConfirmationService, 
        private catalogoPanatallasService: CatalogoPantallasService, 
        private catalogoUsuaiosService: CatalogoUsuaiosService, 
        private comboService: ComboService){
    super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
}


    
    ngOnInit(): void {
        this.cancelar();
        this.cols = [
            { field: "idPantalla", header: "ID"},
            { field: "idAmbiente", header: "Ambiente"},
            { field: "pantalla", header: "Pantalla"},
            { field: "clase", header: "Clase"},
            { field: "dsPantalla", header: "Descripción"},
            { field: "compilado", header: "Compilado"},
            { field: "rutaMenu", header: "Ruta Menú"},
            { field: "permisos", header: "Permisos"},
            { field: "bolPantallaBloqueada", header: "Pantalla Bloqueada"},
            { field: "propietarioNegocio", header: "Propietario Negocio"},
            { field: "propietarioSistemas", header: "Propietario Sistemas"},
            { field: "orden", header: "Orden"},
            { field: "urlHelp", header: "URL Help"},
            { field: "routerLink", header: "Router Link"}
        ];

        this.obtenerCatPantallas();
        this.obtenerPermisos();
        this.obtenerMenuArbol();

        this.files1 = [
            {
                data: {
                    idSistema: '1',
                    name:"SSO",
                    selected: true
                },
                //key: '1',
                expanded: true,

                children: [
                    {
                        data: {
                            idAmbiente: '1',
                            name:"Producción",
                            selected: true
                        },
                        //key: '2',
                        expanded: true,

                        children: [
                            {
                                data: {
                                    idPantalla: '1',
                                    name: 'Pantalla_1',
                                    permisos: '1111111111111111111000000000000000000',
                                    idAmbiente: '1',
                                    pantalla: 'Pantalla 1',
                                    dsPantalla: 'DS Pantalla 1',
                                    clase: 'Clase pantalla 1',
                                    compilado: 'Compilado 1',
                                    rutaMenu: '//RutaMenu',
                                    bolPantallaBloqueada: 1,
                                    propietarioNegocio: 'cesar.maza',
                                    propietarioSistemas: 'cesar.maza',
                                    orden: '4',
                                    urlHelp: 'www.urlhelp.com',
                                    routerLink: '/SSOPrueba',
                                    ambiente: 'Producción',
                                },
                                //key: '3',
                            }
                        ]
                    }
                ]
            },

            {
                data: {
                    idSistema: 2,
                    name:"FWK",
                    selected: true
                },
                expanded: true,
                //key: '4',

                children: [
                    {
                        data: {
                            idAmbiente: 3,
                            name:"Desarrollo",
                            selected: true
                        },
                        expanded: true,
                        //key: '5',

                        children: [
                            {
                                data: {
                                    idPantalla: 2,
                                    name: 'Pantalla_2',
                                    permisos: '0000000000000000001111111111111111111',
                                    idAmbiente: '3',
                                    pantalla: 'Pantalla 2',
                                    dsPantalla: 'DS Pantalla 2',
                                    clase: 'Clase pantalla 2',
                                    compilado: 'Compilado 2',
                                    rutaMenu: '//RutaMenu_2',
                                    bolPantallaBloqueada: 0,
                                    propietarioNegocio: 'jose.calvillo',
                                    propietarioSistemas: 'jose.calvillo',
                                    orden: '7',
                                    urlHelp: 'www.urlhelp.com',
                                    routerLink: '/SSOPrueba_2',
                                    ambiente: 'Desarrollo',

                                },
                                //key: '6',
                            },

                            {
                                data: {
                                    idPantalla: 3,
                                    name: 'Pantalla_2',
                                    permisos: '1111000000111100001111111111111110000',
                                    idAmbiente: '3',
                                    pantalla: 'Pantalla 2',
                                    dsPantalla: 'DS Pantalla 2',
                                    clase: 'Clase pantalla 2',
                                    compilado: 'Compilado 2',
                                    rutaMenu: '//RutaMenu_2',
                                    bolPantallaBloqueada: 0,
                                    propietarioNegocio: 'jose.calvillo',
                                    propietarioSistemas: 'jose.calvillo',
                                    orden: '7',
                                    urlHelp: 'www.urlhelp.com',
                                    routerLink: '/SSOPrueba_2',
                                    ambiente: 'Desarrollo',
                                },
                                //key: '7'
                            }

                        ]
                    }
                ]
            }
        ]
    }

    obtenerCatPantallas(){
        this.catalogoPanatallasService.obtenerCatPantalla().then(pantallas => {
            this.elementos = pantallas;
            this.obtenerComboAmbiente();
            this.obtenerComboUsuario();
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Ambientes");
        })
    }

    limpiarPermisos(){
        let permisosAux: boolean[] = [];
        for(let i = 0; i <= 36; i++){
            permisosAux.push(false);
        }
        this.listaPermisos = permisosAux;
    }

    cargarPermisos(permisos: string) {
        let permisosActivos: boolean[] = [];
        for(let i = 0; i <= 36; i++){
            permisosActivos.push(permisos[i] == '1');
        }
        this.listaPermisos = permisosActivos;
    }

    obtenerPermisos():string {
        let permisosNuevos: string = '';
        for(let i = 0; i < this.listaPermisos.length; i++){
            permisosNuevos += (this.listaPermisos[i] == true ? '1' : '0');
        }
        return permisosNuevos;
    }

    obtenerComboAmbiente(){
        this.catalogoAmbienteService.comboCatAmbiente().then(ambientes => {
            this.comboAmbiente = ambientes;
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Ambientes");
        })
    }

    obtenerComboUsuario(){
        this.catalogoUsuaiosService.comboCatUsuario().then(usuarios => {
            this.comboUsuarios = usuarios;
            this.comboPropSistema = usuarios;
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener Usuarios");
        })
    }


    cambiarAmbiente(event){
        if(event != null && event.value != null && event.value.value != null) {
            this.obtenerCatalogoAmbienteById(event.value);
        } else {
            this.obtenerCatPantallas();
        }
    }

    obtenerCatalogoAmbienteById(elemento: OpcionSelect){
        let idAmbiente = elemento.value;

        this.catalogoAmbienteService.obtenerCatAmbienteById(idAmbiente)
            .then(listaAmbiente => {
                for(let i = 0; i < listaAmbiente.length; i++) {
                    for(let j = 0; j < this.listaAmbientes.length; j++) {
                        if (listaAmbiente[i].idAmbiente == Number(this.listaAmbientes[j].value)) {
                            listaAmbiente[i].ambiente = this.listaAmbientes[j].name;
                        }
                    }
                }
                this.elementosAmbiente = listaAmbiente
            }, error => {
                this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Ambientes");
        })
    }

    
    ejecutarBotonGuardar(){
        if (this.elementoGuarda != null) {
            
            this.blockService.setBlock();
            this.elementoGuarda.idAmbiente = this.comboService.obtenerValorCombo(this.opcionAmbiente)

            // Validaciones
            let listaErrores = [];

            if(this.elementoGuarda.idAmbiente == null){
                listaErrores.push('Ambiente')
            }

            if( this.elementoGuarda.pantalla == null || this.elementoGuarda.pantalla.trim() == '' ){
                listaErrores.push('Pantalla')
            }

            if (!this.mensajeService.validarCamposRequeridos(listaErrores)){
                this.blockService.cleanBlock();
                return;
            }

            
            this.elementoGuarda.propietarioNegocio = this.comboService.obtenerValorComboString(this.opcionPropNegocio)
            this.elementoGuarda.propietarioSistemas = this.comboService.obtenerValorComboString(this.opcionPropSistema)
            this.elementoGuarda.bolPantallaBloqueada = (this.elementoGuarda.bolPantallaBloqueada ? 1 : 0);

            // Permisos
            this.elementoGuarda.permisos = this.obtenerPermisos();
            
            
            // Nuevo registro
            if (this.esNuevo) {
                // Alta de registro
                this.catalogoPanatallasService.crearCatPantalla(this.elementoGuarda)
                    .then(elemento => {
                        this.obtenerCatPantallas();
                        this.mostrarMensaje("Registró", elemento);
                    }, error => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al guardar el elemento [" + this.elementoGuarda.idPantalla + "] " + this.elementoGuarda.pantalla); 
                        this.blockService.cleanBlock();
                    });
            } else {
                this.catalogoPanatallasService.editarCatPantalla(this.elementoGuarda)
                    .then(elemento => {
                        this.obtenerCatPantallas();
                        this.mostrarMensaje("Editó", this.elementoGuarda);
                    }, error => {
                        this.mensajeService.mandarMensajeError("Ocurrió un error al editar el elemento [" + this.elementoGuarda.idPantalla + "] " + this.elementoGuarda.pantalla); 
                        this.blockService.cleanBlock();
                    }); 
            }
        }
    }

    ejecutarBotonEditar() { 
        /* Esto es nuevo */
        if(this.elementoSeleccionadoArbol != null && this.elementoSeleccionadoArbol.data.idPantalla != null) {  
            this.habilitarInputs = true;
            this.esNuevo = false;
            this.cargarPermisos( this.elementoSeleccionadoArbol.data.permisos )
            this.elementoGuarda = { ...this.elementoSeleccionadoArbol.data };

            /* Cargamos combos */
            this.opcionAmbiente = this.comboService.asignarValorCombo(this.elementoGuarda.arbolData.data.idAmbiente, this.comboAmbiente);
            this.opcionPropNegocio = this.comboService.asignarValorComboString(this.elementoGuarda.arbolData.data.propietarioNegocio , this.comboUsuarios);
            this.opcionPropSistema = this.comboService.asignarValorComboString(this.elementoGuarda.arbolData.data.propietarioSistemas, this.comboPropSistema);

            /* Cargamos data en formualario */
            this.elementoGuarda.bolPantallaBloqueada = (this.elementoGuarda.bolPantallaBloqueada ? 1 : 0);
            this.menuBarActionService.asignarEstatusEditar();
        } else {
            if(this.elementoSeleccionadoArbol != null && this.elementoSeleccionadoArbol.data.idSistema != null) {
                this.mensajeService.mandarMensajeWarn("Solo se pueden editar pantallas");
                return
            }
    
            if(this.elementoSeleccionadoArbol != null && this.elementoSeleccionadoArbol.data.idAmbiente != null) {
                this.mensajeService.mandarMensajeWarn("Solo se pueden editar pantallas");
                return
            }
        } 
        /* Fin */

        if(this.elementoSeleccionado != null && this.elementoSeleccionado.idPantalla != null){
            this.habilitarInputs = true;
            this.esNuevo = false;
            this.cargarPermisos( this.elementoSeleccionado.permisos )
            this.elementoGuarda = { ...this.elementoSeleccionado };
            this.opcionAmbiente = this.comboService.asignarValorCombo(this.elementoGuarda.idAmbiente, this.comboAmbiente);
            this.opcionPropNegocio = this.comboService.asignarValorComboString(this.elementoGuarda.propietarioNegocio , this.comboUsuarios);
            this.opcionPropSistema = this.comboService.asignarValorComboString(this.elementoGuarda.propietarioSistemas, this.comboPropSistema);
            this.menuBarActionService.asignarEstatusEditar();
        } else {
            this.mensajeService.mandarMensajeWarn("Seleccione un elemento de la tabla");
        }
    }

    ejecutarBotonBorrar() {
        if (this.elementoSeleccionado != null && this.elementoSeleccionado.idPantalla != null && !this.esNuevo) {
            this.confirmationService.confirm({
                message: '¿Está seguro de eliminar el registro [' + this.elementoSeleccionado.idPantalla + '] ' + this.elementoSeleccionado.pantalla + ' ?',
                acceptLabel: 'Aceptar',
                rejectLabel: 'Cancelar',
                accept: () => {
                    this.blockService.setBlock();
                    this.catalogoPanatallasService.borrarCatPantalla(this.elementoSeleccionado)
                        .then(resultado => {
                            this.blockService.cleanBlock();
                            this.elementoEliminado()
                        }, error => {
                            this.mensajeService.mandarMensajeError("Ocurrió un error al eliminar el elemento [" + this.elementoSeleccionado.idPantalla + "] " + this.elementoSeleccionado.pantalla); 
                            this.blockService.cleanBlock();
                        });
                }
            });
        } else {
            this.mensajeService.mandarMensajeError("Debe estar editando un elemento para poder borrarlo");
        }
    }

    elementoEliminado(){
        this.menuBarActionService.asignarEstatusApertura();
        this.habilitarInputs = false;
        this.mensajeService.mandarMensajeSuccess("Registro [" + this.elementoSeleccionado.idPantalla + "] " + this.elementoSeleccionado.pantalla + " eliminado correctamente");
        this.cancelar();
        this.obtenerCatPantallas();
    }

    mostrarMensaje(tipo: string, registro: PantallaDTO) {
        this.habilitarInputs = false;
        this.menuBarActionService.asignarEstatusApertura();
        this.blockService.cleanBlock();
        this.mensajeService.mandarMensajeSuccess("Se " + tipo + " el elemento [" + registro.idPantalla + "] " + registro.pantalla + " correctamente")
        this.cancelar();
    }

    ejecutarBotonNuevo() {
        if (this.elementoSeleccionadoArbol != null && this.elementoSeleccionadoArbol.data.idSistema != null) {
            //  carga ambiente del sistema
            let idAmbienteAux = this.elementoSeleccionadoArbol.data.idSistema;
            this.opcionAmbiente = this.comboService.asignarValorCombo(idAmbienteAux, this.comboAmbiente);
        } else if (this.elementoSeleccionadoArbol != null && this.elementoSeleccionadoArbol.data.idAmbiente != null){
            //  carga ambiente
            let idAmbienteAux = this.elementoSeleccionadoArbol.data.idAmbiente;
            this.opcionAmbiente = this.comboService.asignarValorCombo(idAmbienteAux, this.comboAmbiente);
        } else {
            this.habilitarInputs = true;
            this.cancelar();
        }
    }


    ejecutarBotonCancelar() {
        this.habilitarInputs = false;
        this.cancelar();
    }

    cancelar() {
        this.limpiarPermisos();
        this.opcionPropNegocio = this.comboService.limpiarCombo();
        this.opcionPropSistema = this.comboService.limpiarCombo();
        this.elementoSeleccionadoArbol = null;
        this.esNuevo = true;
        this.elementoSeleccionado = {
            idPantalla: null,
            idAmbiente: null,
            pantalla: null,
            dsPantalla: null,
            clase: null,
            compilado: null,
            rutaMenu: null,
            permisos: null,
            bolPantallaBloqueada:null,
            propietarioNegocio: null,
            propietarioSistemas: null,
            orden:null,
            urlHelp: null,
            routerLink: null
        }
        this.pantallaDTO = {
            idPantalla: null,
            idAmbiente: null,
            pantalla: null,
            dsPantalla: null,
            clase: null,
            compilado: null,
            rutaMenu: null,
            permisos: null,
            bolPantallaBloqueada:null,
            propietarioNegocio: null,
            propietarioSistemas: null,
            orden:null,
            urlHelp: null,
            routerLink: null
        }
        this.elementoGuarda = {
            idPantalla: null,
            idAmbiente: null,
            pantalla: null,
            dsPantalla: null,
            clase: null,
            compilado: null,
            rutaMenu: null,
            permisos: null,
            bolPantallaBloqueada:null,
            propietarioNegocio: null,
            propietarioSistemas: null,
            orden:null,
            urlHelp: null,
            routerLink: null
        };
    }


    obtenerMenuArbol(){
        this.catalogoPanatallasService.obtenerMenuArbol().then(listaMenu => { 
            this.agregarIdLista(listaMenu); 
            setTimeout(() => { this.openMenu.emit(); }, 500); 
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el Menú");
        });
    }

    private agregarIdLista(lista: MenuPantallaDTO[]){
        for (let i = 0; i < lista.length; i++){
            lista[i].id = String(lista[i].id_sistema);
        }
        this.items = lista;
    }


    nodeSelect(event) {
        if(this.elementoSeleccionadoArbol != null){
            this.menuBarActionService.asignarEstatusApertura();
        }
    }
}
