import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { SideBarService } from '@app/shared/service/SideBar.service';
import { MenuItem } from 'primeng/api';
import { MenuDTO } from '@app/shared/model/MenuDTO';
import { VariableSistemaService } from '@app/shared/service/VariableSistema.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html'
})

export class SideBarComponent implements OnInit {
    @Input() visible: boolean = false;
    @Output() closeMenu = new EventEmitter<any>();
    @Output() openMenu = new EventEmitter<any>();
    items: MenuItem[];
    subscription: Subscription;

    constructor(
        private sideBarService: SideBarService,
        private elementRef: ElementRef,
        private mensajeService: MensajeService,
        private variableSistemaService: VariableSistemaService,
    ) {
        this.subscription = variableSistemaService.getEscuchaCambioAmbiente()
            .subscribe(idAmbiente => this.obtenerMenu());
     }

    ngOnInit() {
        this.obtenerMenu();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    obtenerMenu(){
        this.sideBarService.obtenerMenu().then(listaMenu => { this.agregarIdLista(listaMenu); setTimeout(() => { this.openMenu.emit(); }, 500); }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al obtener el Menú");
        });
    }

    private agregarIdLista(lista: MenuDTO[]){
        for (let i = 0; i < lista.length; i++){
            lista[i].id = String(lista[i].id_pantalla);
        }
        this.items = lista;
    }

    @HostListener('document:click', ['$event'])
    click(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            // Entra cuando hace click Fuera del sideBar
            // Si da click en el boton toggle del header bloqueo el cerrar menu
            let aprietaBotonHeader = event.target.parentElement != null && event.target.parentElement.id == "botonToggleMenu";
            let aprietaSpanBotonHeader = event.target.parentElement != null && event.target.parentElement.parentElement != null && event.target.parentElement.parentElement.id == "botonToggleMenu";
            if (!aprietaBotonHeader && !aprietaSpanBotonHeader) {
                this.closeMenu.emit();
            }
        } else {
            // Entra cuando hace click Dentro del sidebar
            // Si da click en un link del menu lo mando cerrar
            let aprietaLinkMenu = (event.target.className).includes("ui-menuitem-link") && event.target.hash != null && event.target.hash != "";
            let aprietaSpanLinkMenu = (event.target.className).includes("ui-menuitem-text") && event.target.nodeName == "SPAN" && event.target.parentElement.hash != null && event.target.parentElement.hash != "";
            if (aprietaLinkMenu || aprietaSpanLinkMenu) {
                this.closeMenu.emit();
            }
        }
    }

}
