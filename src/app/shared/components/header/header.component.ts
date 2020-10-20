import { Component, EventEmitter, Input, OnInit, Output, HostListener, ElementRef, ViewChild } from '@angular/core';
import { UserDTO } from '@app/shared/model/UserDTO';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { Subscription } from 'rxjs';
import { OpcionSelect } from '../../model/Combo';
import { AccountService } from '../../service/Account.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { VariableSistemaService } from '@app/shared/service/VariableSistema.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { MensajeService } from '@app/shared/service/Mensaje.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
    @Output() toogleMenu = new EventEmitter<any>();
    @Input() user: UserDTO;
    @ViewChild('buttonToogleHeader') buttonToogleHeader: ElementRef;
    nombrePantalla: string = "";
    subscription: Subscription;
    usrLog: string = '';
    subscriptionUsr: Subscription;
    listaAmbienteSelect: OpcionSelect[] = [];
    opcionSeleccionadaAmbiente: OpcionSelect;
    opcionInicialAmbiente: OpcionSelect;

    constructor(
        private accountService: AccountService,
        private menuHeaderService: MenuHeaderService,
        private bitacoraService: BitacoraService,
        private variableSistemaService: VariableSistemaService,
        private elementRef: ElementRef,
        private router: Router,
        private confirmationService: ConfirmationService,
        private mensajeService: MensajeService,
    ) {
        this.subscription = this.menuHeaderService.getMenuHeader()
            .subscribe(objeto => this.nombrePantalla = (objeto != null && objeto.label != null ? objeto.label : ""))

        this.subscriptionUsr = this.accountService.user.subscribe(x => {
            if (x != null) {
                this.usrLog = (this.accountService.getFullName());
                this.variableSistemaService.getAmbientesValidos().then(result => this.obtenerComboAmbientes(), error => {
                    this.mensajeService.mandarMensajeError("Ocurrió un error al obtener los Ambientes");
                });
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.subscriptionUsr.unsubscribe();
    }

    ngOnInit() {
    }

    obtenerComboAmbientes() {
        let listaAmbiente = this.variableSistemaService.getListaAmbientes();
        let listaAux = [];
        if (listaAmbiente != null && listaAmbiente.length != null) {
            for (let i = 0; i < listaAmbiente.length; i++) {
                listaAux.push({ value: listaAmbiente[i].idAmbiente, name: listaAmbiente[i].descripcionAmbiente });
                if (listaAmbiente[i].principal == 1) {
                    this.opcionInicialAmbiente = listaAux[listaAux.length - 1];
                    this.opcionSeleccionadaAmbiente = listaAux[listaAux.length - 1];
                }
            }
        }
        this.listaAmbienteSelect = listaAux;
    }

    handleClick() {
        this.cerrarMenuHeader();
        this.toogleMenu.emit();
    }

    cerrarSesion() {
        this.bitacoraService.guardarSesion("LOGOUT", "Botón Salir", "Usuario " + this.accountService.userValue.usuario + " salió del sistema");
        this.accountService.logout();
    }

    @HostListener('document:click', ['$event'])
    click(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            // Da click fuera del header
            this.cerrarMenuHeader();
        }
    }

    cerrarMenuHeader() {
        if (this.buttonToogleHeader != null) {
            let buttonElement: HTMLElement = this.buttonToogleHeader.nativeElement as HTMLElement;
            if (buttonElement.getAttribute("aria-expanded") == "true") {
                buttonElement.click();
            }
        }
    }

    onEvent(event) {
        event.stopPropagation();
    }

    cambiarAmbiente(event) {
        this.confirmationService.confirm({
            message: '¿Está seguro de cambiarse al Ambiente [' + this.opcionSeleccionadaAmbiente.name + ']?',
            acceptLabel: 'Aceptar',
            rejectLabel: 'Cancelar',
            accept: () => {
                // Cambio la variable del sistema, ese metodo ya se encarga de obtener otra vez el menu pero ahora por el ambiente seleccionado
                this.variableSistemaService.setAmbienteActual(this.opcionSeleccionadaAmbiente.value);
                this.opcionInicialAmbiente = this.opcionSeleccionadaAmbiente;

                // redirige al usuario a home
                this.router.navigate(['/home']);
            },
            reject: () => {
                this.opcionSeleccionadaAmbiente = this.opcionInicialAmbiente;
            }
        });
    }

}
