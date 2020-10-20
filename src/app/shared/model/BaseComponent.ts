import { Subscription } from 'rxjs';
import { MensajeService } from '../service/Mensaje.service';
import { MenuBarActionService } from '../service/MenuBarAction.service';
import { MenuHeaderService } from '../service/MenuHeader.service';
import { BitacoraService } from '../service/Bitacora.service';

export abstract class BaseComponent {
    hijo: any;
    subscription: Subscription;
    bitacora: any;

    constructor(
        protected menuHeaderService: MenuHeaderService,
        protected menuBarActionService: MenuBarActionService,
        protected mensajeService: MensajeService,
        protected bitacoraService: BitacoraService,
    ) {
        // El hijo es la pantalla que hereda esta clase Base
        this.hijo = this;
        // Se lanzan los botones 
        menuHeaderService.setMenuHeader();
        // Se escucha el menu de botones
        this.subscription = menuBarActionService.getAction()
            .subscribe(accion => this.ejecutarAccion(accion));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    private ejecutarAccion(accion: string) {
        // bitacora de boton seleccionado
        this.bitacoraService.guardarBitacora(accion, this.bitacoraService.obtenerPantallaActual(), "El usuario Seleccionó el Botón "+accion+" en el " + this.bitacoraService.obtenerPantallaActual());

        const acciones = {
            'NUEVO': function(hijo: any){
                if (typeof hijo.ejecutarBotonNuevo === "function"){
                    hijo.ejecutarBotonNuevo(); 
                    return true;
                } return "ejecutarBotonNuevo()";
            },
            'EDITAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonEditar === "function"){
                    hijo.ejecutarBotonEditar();
                    return true;
                } return "ejecutarBotonEditar()";
            },
            'BORRAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonBorrar === "function"){
                    hijo.ejecutarBotonBorrar(); 
                    return true;
                } return "ejecutarBotonBorrar()";
            },
            'CANCELAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonCancelar === "function"){
                    hijo.ejecutarBotonCancelar(); 
                    return true;
                } return "ejecutarBotonCancelar()";
            },
            'GUARDAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonGuardar === "function"){
                    hijo.ejecutarBotonGuardar(); 
                    return true;
                } return "ejecutarBotonGuardar()";
            },
            'ACEPTAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonAceptar === "function"){
                    hijo.ejecutarBotonAceptar(); 
                    return true;
                } return "ejecutarBotonAceptar()";
            },
            'EJECUTAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonEjecutar === "function"){
                    hijo.ejecutarBotonEjecutar(); 
                    return true;
                } return "ejecutarBotonEjecutar()";
            },
            'IMPORTAR_CSV': function(hijo: any){
                if (typeof hijo.ejecutarBotonImportarCSV === "function"){
                    hijo.ejecutarBotonImportarCSV(); 
                    return true;
                } return "ejecutarBotonImportarCSV()";
            },
            'IMPORTAR_XLS': function(hijo: any){
                if (typeof hijo.ejecutarBotonImportarXLS === "function"){
                    hijo.ejecutarBotonImportarXLS(); 
                    return true;
                } return "ejecutarBotonImportarXLS()";
            },
            'IMPORTAR_TXT': function(hijo: any){
                if (typeof hijo.ejecutarBotonImportarTXT === "function"){
                    hijo.ejecutarBotonImportarTXT(); 
                    return true;
                } return "ejecutarBotonImportarTXT()";
            },
            'IMPORTAR_ARCHIVO': function(hijo: any){
                if (typeof hijo.ejecutarBotonImportarArchivo === "function"){
                    hijo.ejecutarBotonImportarArchivo(); 
                    return true;
                } return "ejecutarBotonImportarArchivo()";
            },
            'EXPORTAR_CSV': function(hijo: any){
                if (typeof hijo.ejecutarBotonExportarCSV === "function"){
                    hijo.ejecutarBotonExportarCSV(); 
                    return true;
                } return "ejecutarBotonExportarCSV()";
            },
            'EXPORTAR_XLS': function(hijo: any){
                if (typeof hijo.ejecutarBotonExportarXLS === "function"){
                    hijo.ejecutarBotonExportarXLS(); 
                    return true;
                } return "ejecutarBotonExportarXLS()";
            },
            'EXPORTAR_TXT': function(hijo: any){
                if (typeof hijo.ejecutarBotonExportarTXT === "function"){
                    hijo.ejecutarBotonExportarTXT(); 
                    return true;
                } return "ejecutarBotonExportarTXT()";
            },
            'EXPORTAR_PDF': function(hijo: any){
                if (typeof hijo.ejecutarBotonExportarPDF === "function"){
                    hijo.ejecutarBotonExportarPDF(); 
                    return true;
                } return "ejecutarBotonExportarPDF()";
            },
            'EXPORTAR_ARCHIVO': function(hijo: any){
                if (typeof hijo.ejecutarBotonExportarArchivo === "function"){
                    hijo.ejecutarBotonExportarArchivo(); 
                    return true;
                } return "ejecutarBotonExportarArchivo()";
            },
            'COPIAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonCopiar === "function"){
                    hijo.ejecutarBotonCopiar(); 
                    return true;
                } return "ejecutarBotonCopiar()";
            },
            'ENVIAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonEnviar === "function"){
                    hijo.ejecutarBotonEnviar(); 
                    return true;
                } return "ejecutarBotonEnviar()";
            },
            'IMPRIMIR': function(hijo: any){
                if (typeof hijo.ejecutarBotonImprimir === "function"){
                    hijo.ejecutarBotonImprimir(); 
                    return true;
                } return "ejecutarBotonImprimir()";
            },
            'RECARGAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonRecargar === "function"){
                    hijo.ejecutarBotonRecargar(); 
                    return true;
                } return "ejecutarBotonRecargar()";
            },
            'BUSCAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonBuscar === "function"){
                    hijo.ejecutarBotonBuscar(); 
                    return true;
                } return "ejecutarBotonBuscar()";
            },
            'ENCRIPTAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonEncriptar === "function"){
                    hijo.ejecutarBotonEncriptar(); 
                    return true;
                } return "ejecutarBotonEncriptar()";
            },
            'DESENCRIPTAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonDesencriptar === "function"){
                    hijo.ejecutarBotonDesencriptar(); 
                    return true;
                } return "ejecutarBotonDesencriptar()";
            },
            'ARRIBA': function(hijo: any){
                if (typeof hijo.ejecutarBotonArriba === "function"){
                    hijo.ejecutarBotonArriba(); 
                    return true;
                } return "ejecutarBotonArriba()";
            },
            'ABAJO': function(hijo: any){
                if (typeof hijo.ejecutarBotonAbajo === "function"){
                    hijo.ejecutarBotonAbajo(); 
                    return true;
                } return "ejecutarBotonAbajo()";
            },
            'IZQUIERDA': function(hijo: any){
                if (typeof hijo.ejecutarBotonIzquierda === "function"){
                    hijo.ejecutarBotonIzquierda(); 
                    return true;
                } return "ejecutarBotonIzquierda()";
            },
            'DERECHA': function(hijo: any){
                if (typeof hijo.ejecutarBotonDerecha === "function"){
                    hijo.ejecutarBotonDerecha(); 
                    return true;
                } return "ejecutarBotonDerecha()";
            },
            'ANTERIOR': function(hijo: any){
                if (typeof hijo.ejecutarBotonAnterior === "function"){
                    hijo.ejecutarBotonAnterior(); 
                    return true;
                } return "ejecutarBotonAnterior()";
            },
            'SIGUIENTE': function(hijo: any){
                if (typeof hijo.ejecutarBotonSiguiente === "function"){
                    hijo.ejecutarBotonSiguiente(); 
                    return true;
                } return "ejecutarBotonSiguiente()";
            },
            'PAGINA_ANTERIOR': function(hijo: any){
                if (typeof hijo.ejecutarBotonPaginaAnterior === "function"){
                    hijo.ejecutarBotonPaginaAnterior(); 
                    return true;
                } return "ejecutarBotonPaginaAnterior()";
            },
            'PAGINA_SIGUIENTE': function(hijo: any){
                if (typeof hijo.ejecutarBotonPaginaSiguiente === "function"){
                    hijo.ejecutarBotonPaginaSiguiente(); 
                    return true;
                } return "ejecutarBotonPaginaSiguiente()";
            },
            'PRIMERA_PAGINA': function(hijo: any){
                if (typeof hijo.ejecutarBotonPrimeraPagina === "function"){
                    hijo.ejecutarBotonPrimeraPagina(); 
                    return true;
                } return "ejecutarBotonPrimeraPagina()";
            },
            'ULTIMA_PAGINA': function(hijo: any){
                if (typeof hijo.ejecutarBotonUltimaPagina === "function"){
                    hijo.ejecutarBotonUltimaPagina(); 
                    return true;
                } return "ejecutarBotonUltimaPagina()";
            },
            'INICIAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonIniciar === "function"){
                    hijo.ejecutarBotonIniciar(); 
                    return true;
                } return "ejecutarBotonIniciar()";
            },
            'DETENER': function(hijo: any){
                if (typeof hijo.ejecutarBotonDetener === "function"){
                    hijo.ejecutarBotonDetener(); 
                    return true;
                } return "ejecutarBotonDetener()";
            },
            'FINALIZAR': function(hijo: any){
                if (typeof hijo.ejecutarBotonFinalizar === "function"){
                    hijo.ejecutarBotonFinalizar(); 
                    return true;
                } return "ejecutarBotonFinalizar()";
            }
        };

        let respuesta = acciones[accion](this.hijo);
        if (typeof respuesta === "string"){
            this.mensajeService.mandarMensajeError("[Desarrollador]: No has programado el método " + respuesta);
            // bitacora de metodo no implementado
            this.bitacoraService.guardarError(accion, this.bitacoraService.obtenerPantallaActual(), "[Desarrollador]: No has programado el método " + respuesta + " para la pantalla " +  this.bitacoraService.obtenerPantallaActual());

        }
    }

}