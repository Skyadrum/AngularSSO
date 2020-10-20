import { Component, Input } from '@angular/core';
import { MenuBarService } from '@app/shared/service/MenuBar.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { PermisosDTO } from '@app/shared/model/PermisosDTO';
import { HelpService } from '@app/shared/service/button/Help.service';

@Component({
    selector: 'app-menubar',
    templateUrl: './menubar.component.html'
})
export class MenuBarComponent {
    @Input() visible: boolean;
    items: MenuItem[] = [];
    subscription: Subscription;
    private iconos: MenuItem[];
    private permisos: string;

    importar = [
        {
            label: 'CSV',
            command: () => {
                this.menuBarActionService.setAction("IMPORTAR_CSV");
            }
        },
        {
            label: 'XLS',
            command: () => {
                this.menuBarActionService.setAction("IMPORTAR_XLS");
            }
        },
        {
            label: 'TXT',
            command: () => {
                this.menuBarActionService.setAction("IMPORTAR_TXT");
            }
        },
        {
            label: 'Archivo',
            command: () => {
                this.menuBarActionService.setAction("IMPORTAR_ARCHIVO");
            }
        }
    ];
    exportar = [
        {
            label: 'CSV',
            command: () => {
                this.menuBarActionService.setAction("EXPORTAR_CSV");
            }
        },
        {
            label: 'XLS',
            command: () => {
                this.menuBarActionService.setAction("EXPORTAR_XLS");
            }
        },
        {
            label: 'TXT',
            command: () => {
                this.menuBarActionService.setAction("EXPORTAR_TXT");
            }
        },
        {
            label: 'PDF',
            command: () => {
                this.menuBarActionService.setAction("EXPORTAR_PDF");
            }
        },
        {
            label: 'Archivo',
            command: () => {
                this.menuBarActionService.setAction("EXPORTAR_ARCHIVO");
            }
        }
    ];

    constructor(
        private menuBarService: MenuBarService,
        private menuHeaderService: MenuHeaderService,
        private menuBarActionService: MenuBarActionService,
        private mensajeService: MensajeService,
        private helpService: HelpService,
    ) {
        // Utilizado para crear los botones de cada pantalla
        this.subscription = this.menuHeaderService.getMenuHeader()
            .subscribe(objeto => this.crearMenuBar(objeto));
        
        // Utilizado para habilitar/deshabilitar los botones a partir del flujo del usuario
        this.subscription = this.menuBarActionService.getEstatus()
            .subscribe(estatus => {
                if (estatus == "asignaEstatusEditar"){
                    this.asignaEstatusEditar();
                } else if (estatus == "asignaEstatusApertura"){
                    this.asignaEstatusApertura();
                } else if (estatus == "asignaEstatusNuevo"){
                    this.asignaEstatusNuevo();
                } else if (estatus == "asignaEstatusRealesApertura"){
                    this.asignaEstatusRealesApertura();
                } else if (estatus == "asignaEstatusPlay"){
                    this.asignaEstatusPlay();
                } else if (estatus == "asignaEstatusPausa"){
                    this.asignaEstatusPausa();
                } else if (estatus == "asignaEstatusRealesDeshabilitado"){
                    this.asignaEstatusRealesDeshabilitado();
                }
            });
    }

    ngOnInit(): void {

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    crearListaMenu() {
        this.iconos = [
            {
                title: 'Nuevo',
                icon: 'pi pi-fw pi-file-o',
                label: 'Nuevo',
                command: () => {
                    this.asignaEstatusNuevo();
                    this.menuBarActionService.setAction("NUEVO");
                }
            },
            {
                title: 'Editar',
                icon: 'pi pi-fw pi-pencil',
                label: 'Editar',
                command: () => {
                    this.menuBarActionService.setAction("EDITAR");
                }
            },
            {
                title: 'Borrar',
                icon: 'pi pi-fw pi-trash',
                label: 'Borrar',
                command: () => {
                    this.menuBarActionService.setAction("BORRAR");
                }
            },
            {
                title: 'Cancelar',
                icon: 'pi pi-fw pi-times',
                label: 'Cancelar',
                command: () => {
                    this.asignaEstatusApertura();
                    this.menuBarActionService.setAction("CANCELAR");
                }
            },
            {
                title: 'Guardar',
                icon: 'pi pi-fw pi-save',
                label: 'Guardar',
                command: () => {
                    this.menuBarActionService.setAction("GUARDAR");
                }
            },
            {
                title: 'Aceptar',
                icon: 'pi pi-fw pi-check',
                label: 'Aceptar',
                command: () => {
                    this.menuBarActionService.setAction("ACEPTAR");
                },
            },
            {
                title: 'Ejecutar',
                icon: 'pi pi-fw pi-cog',
                label: 'Ejecutar',
                command: () => {
                    this.menuBarActionService.setAction("EJECUTAR");
                }
            },
            {
                title: 'Importar',
                label: 'Importar',
                icon: 'pi pi-fw pi-file-excel',
                items: []
            },
            {
                title: 'Exportar',
                label: 'Exportar',
                icon: 'pi pi-fw pi-file-excel',
                items: [],
            },
            {
                title: 'Copiar',
                icon: 'pi pi-fw pi-copy',
                label: 'Copiar',
                command: () => {
                    this.menuBarActionService.setAction("COPIAR");
                }
            },
            {
                title: 'Enviar',
                icon: 'pi pi-fw pi-envelope',
                label: 'Enviar',
                command: () => {
                    this.menuBarActionService.setAction("ENVIAR");
                }
            },
            {
                title: 'Imprimir',
                icon: 'pi pi-fw pi-print',
                label: 'Imprimir',
                command: () => {
                    this.menuBarActionService.setAction("IMPRIMIR");
                }
            },
            {
                title: 'Recargar',
                icon: 'pi pi-fw pi-refresh',
                label: 'Recargar',
                command: () => {
                    this.menuBarActionService.setAction("RECARGAR");
                }
            },
            {
                title: 'Buscar',
                icon: 'pi pi-fw pi-search',
                label: 'Buscar',
                command: () => {
                    this.menuBarActionService.setAction("BUSCAR");
                }
            },
            {
                title: 'Encriptar',
                icon: 'pi pi-fw pi-lock',
                label: 'Encriptar',
                command: () => {
                    this.menuBarActionService.setAction("ENCRIPTAR");
                }
            },
            {
                title: 'Desencriptar',
                icon: 'pi pi-fw pi-unlock',
                label: 'Desencriptar',
                command: () => {
                    this.menuBarActionService.setAction("DESENCRIPTAR");
                }
            },
            {
                title: 'Arriba',
                icon: 'pi pi-fw pi-arrow-up',
                label: 'Arriba',
                command: () => {
                    this.menuBarActionService.setAction("ARRIBA");
                }
            },
            {
                title: 'Abajo',
                icon: 'pi pi-fw pi-arrow-down',
                label: 'Abajo',
                command: () => {
                    this.menuBarActionService.setAction("ABAJO");
                }
            },
            {
                title: 'Izquierda',
                icon: 'pi pi-fw pi-arrow-left',
                label: 'Izquierda',
                command: () => {
                    this.menuBarActionService.setAction("IZQUIERDA");
                }
            },
            {
                title: 'Derecha',
                icon: 'pi pi-fw pi-arrow-right',
                label: 'Derecha',
                command: () => {
                    this.menuBarActionService.setAction("DERECHA");
                }
            },
            {
                title: 'Anterior',
                label: 'Anterior',
                icon: 'pi pi-fw pi-step-backward',
                command: () => {
                    this.menuBarActionService.setAction("ANTERIOR");
                }
            },
            {
                title: 'Siguiente',
                icon: 'pi pi-fw pi-step-forward',
                label: 'Siguiente',
                command: () => {
                    this.menuBarActionService.setAction("SIGUIENTE");
                }
            },
            {
                title: 'Página anterior',
                icon: 'pi pi-fw pi-angle-double-left ',
                label: 'Página anterior',
                command: () => {
                    this.menuBarActionService.setAction("PAGINA_ANTERIOR");
                }
            },
            {
                title: 'Página siguiente',
                icon: 'pi pi-fw pi-angle-double-right',
                label: 'Página siguiente',
                command: () => {
                    this.menuBarActionService.setAction("PAGINA_SIGUIENTE");
                }
            },
            {
                title: 'Primera página',
                icon: 'pi pi-fw pi-angle-left',
                label: 'Primera página',
                command: () => {
                    this.menuBarActionService.setAction("PRIMERA_PAGINA");
                }
            },
            {
                title: 'Última página',
                icon: 'pi pi-fw pi-angle-right',
                label: 'Última página',
                command: () => {
                    this.menuBarActionService.setAction("ULTIMA_PAGINA");
                }
            },
            {
                title: 'Ayuda',
                icon: 'pi pi-fw pi-question',
                label: 'Ayuda',
                command: () => {
                    this.helpService.lanzarVentanaNavegador();
                },
            },
            {
                title: 'Iniciar',
                icon: 'pi pi-fw pi-play',
                label: 'Iniciar',
                command: () => {
                    this.menuBarActionService.setAction("INICIAR");
                }
            },
            {
                title: 'Detener',
                icon: 'pi pi-fw pi-pause',
                label: 'Detener',
                command: () => {
                    this.menuBarActionService.setAction("DETENER");
                }
            },
            {
                title: 'Finalizar',
                icon: 'pi pi-fw pi-ban',
                label: 'Finalizar',
                command: () => {
                    this.menuBarActionService.setAction("FINALIZAR");
                }
            },

        ];
    }

    crearMenuBar(objeto: any) {
        this.crearListaMenu();
        if (objeto != null && objeto.routerLink != null) {
            this.menuBarService.obtenerMenuBar(objeto.id_pantalla).then(permisos => { this.seleccionarOpcionesMenuBar(permisos) }, error => {
                this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los permisos");
            });
        } else {
            this.items = [];
        }
    }

    private seleccionarOpcionesMenuBar(permisos: PermisosDTO) {
        let menuLista: MenuItem[] = [];
        if (permisos && permisos.permisos_calculado) {
          this.permisos = permisos.permisos_calculado;
            for (let i = 0; i < permisos.permisos_calculado.length; i++) {
                if (permisos.permisos_calculado[i] == '1') {
                    if (i < 7) {
                        menuLista.push(this.iconos[i]);
                    } else if (i >= 7 && i <= 10) {
                        let posicionElementoImportar = this.buscarTitle('Importar', menuLista);
                        if (posicionElementoImportar == null) {
                            menuLista.push(this.iconos[7]);
                        }
                        menuLista[menuLista.length - 1].items.push(this.importar[i - 7]);
                    } else if (i >= 11 && i <= 15) {
                        let posicionElementoExportar = this.buscarTitle('Exportar', menuLista);
                        if (posicionElementoExportar == null) {
                            menuLista.push(this.iconos[8]);
                        }
                        menuLista[menuLista.length - 1].items.push(this.exportar[i - 11]);
                    } else {
                        menuLista.push(this.iconos[i - 7]);
                    }
                }
            }
            this.items = menuLista;
            this.asignaEstatusApertura();
            this.asignaEstatusRealesDeshabilitado();

        }
    }

    private buscarTitle(titulo: string, menuItem: MenuItem[]): number {
        for (let i = 0; i < menuItem.length; i++) {
            if (menuItem[i].title == titulo) {
                return i;
            }
        }
        return null;
    }

    private habilitarBtn(indice: number, title: string, disabled: boolean) {
        if (this.permisos[indice] == '1') {
            let indiceMenu = this.buscarTitle(title, this.items);
            if (indiceMenu != null) {
                this.items[indiceMenu].disabled = disabled;
            }
        }
    }

    private asignaEstatusApertura(){
        this.habilitarBtn(0, 'Nuevo', false);
        this.habilitarBtn(1, 'Editar', false);
        this.habilitarBtn(2, 'Borrar', true);
        this.habilitarBtn(3, 'Cancelar', true);
        this.habilitarBtn(4, 'Guardar', true);
    }

    private asignaEstatusNuevo(){
      this.habilitarBtn(0, 'Nuevo', true);
      this.habilitarBtn(1, 'Editar', true);
      this.habilitarBtn(2, 'Borrar', true);
      this.habilitarBtn(3, 'Cancelar', false);
      this.habilitarBtn(4, 'Guardar', false);
    }

    public asignaEstatusEditar(){
      this.habilitarBtn(0, 'Nuevo', true);
      this.habilitarBtn(1, 'Editar', true);
      this.habilitarBtn(2, 'Borrar', false);
      this.habilitarBtn(3, 'Cancelar', false);
      this.habilitarBtn(4, 'Guardar', false);
    }

    // Funciones para la pantalla de Reales
    public asignaEstatusRealesDeshabilitado(){
        this.habilitarBtn(34, 'Iniciar', true);
        this.habilitarBtn(35, 'Detener', true);
        this.habilitarBtn(36, 'Finalizar', true);
    }
    public asignaEstatusRealesApertura(){
        this.habilitarBtn(34, 'Iniciar', false);
        this.habilitarBtn(35, 'Detener', true);
        this.habilitarBtn(36, 'Finalizar', true);
    }
    public asignaEstatusPlay(){
        this.habilitarBtn(34, 'Iniciar', false);
        this.habilitarBtn(35, 'Detener', true);
        this.habilitarBtn(36, 'Finalizar', false);
    }
    public asignaEstatusPausa(){
        this.habilitarBtn(34, 'Iniciar', true);
        this.habilitarBtn(35, 'Detener', false);
        this.habilitarBtn(36, 'Finalizar', false);
    }

}