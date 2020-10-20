import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { OpcionSelect } from '@app/shared/model/Combo';
import { TransaccionReales, TransaccionRealesBoton, TBRealDTO } from '@app/controlProduccion/model/transaccionReales';
import { TransaccionRealesService } from '@app/controlProduccion/service/transaccionReales.service';
import { CatalogoGenericoService } from '@app/controlProduccion/service/catalogoGenerico.service';
import { ComboService } from 'src/app/shared/service/Combo.service';
import { CatalogoColaboradoresService } from '../../service/catalogoColaboradores.service';
import { CalendarService } from 'src/app/shared/service/Calendar.service';
import { CatalogoPlaneacionEjecucion } from '@app/controlProduccion/model/catalogoPlaneacion';
import { formatDate } from '@angular/common';
import { BaseComponent } from '@app/shared/model/BaseComponent';
import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-transaccion-reales',
  templateUrl: './transaccionReales.component.html'
})
export class TransaccionalRealesComponent extends BaseComponent implements OnInit {

  boton: boolean = false;
  play: boolean = true;
  pause: boolean = true;
  stop: boolean = true;

  planeacionCombo: boolean = false;
  reales: TransaccionReales;
  realActivo: any;
  iDPlaneacion: number;
  iDAsignado: number;
  idRealActivo: number;
  issuSave: string;
  riesgoSave: string;
  notaSave: string;
  subscription: Subscription;
  controlProducion:string;
  notaReal:string;
  habilitarInputs: boolean;





  listaColaboradores: OpcionSelect[] = [];
  opccionColaboradores: OpcionSelect;
  opccionPlaneaciones: OpcionSelect;
  colaboradoresLista: OpcionSelect[] = [];
  listaPlaneaciones: OpcionSelect[] = [];
  transaccionReales: TransaccionReales[] = [];
  listaPlaneacionesCampos: TransaccionReales;
  iniciarBoton: TransaccionRealesBoton;


  transaccionRealesGuarda: TransaccionReales = {
    realActivo: {
      idReale: null,
      idPlaneacion: null,
      asignadoA: null,
      fechaRealInicio: null,
      esfuerzo: null,
      fechaRealTermino: null,
      issue: null,
      riesgo: null,
      nota: null,
      idEstatusTarea: null,
    },
    idPlaneacion: null,
    fechaInicioPlaneado: null,
    fechaTerminoPlaneado: null,
    esfuerzoPlaneado: null,
    nanual: null,
    asignadoA: null,
    usuario: null,
    fechaHoy: null,
    idEstatusTarea: null,
    idActividad: null,
    idTarea: null,
    esfuerzoTarea: null,
    esfuerzoHoy: null,
    issue: null,
    riesgo: null,
    nota: null,
    controlProd:null,
  }

  transaccionesBoton: TransaccionRealesBoton = {
    idReale: null,
    idPlaneacion: null,
    esfuerzo: 0,
    asignadoA: null,
    issue: null,
    riesgo: null,
    nota: null,
  }

  transaccionRealCampos: TBRealDTO = {
    idReale: null,
    idPlaneacion: null,
    asignadoA: null,
    fechaRealInicio: null,
    esfuerzo: null,
    fechaRealTermino: null,
    issue: null,
    riesgo: null,
    nota: null,
    idEstatusTarea: null,
  }



  constructor(
    protected menuHeaderService: MenuHeaderService,
    protected menuBarActionService: MenuBarActionService,
    protected mensajeService: MensajeService,
    protected bitacoraService: BitacoraService,
    private realesService: TransaccionRealesService,
    private catalogoColaboradoresService: CatalogoColaboradoresService,
    private catalogoGenericoService: CatalogoGenericoService,
    private messageService: MessageService,
    private comboService: ComboService,
    private calendarService: CalendarService) {
    super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
  }


  ngOnInit() {
    this.obtenerColaboradores();
  }


  limpiarActividad() {
    this.listaPlaneaciones = null;
    this.menuBarActionService.asignaEstatusRealesDeshabilitado();
  }

  limpiar() {
    this.transaccionRealesGuarda = {
      realActivo: null,
      idPlaneacion: null,
      fechaInicioPlaneado: null,
      fechaTerminoPlaneado: null,
      esfuerzoPlaneado: null,
      nanual: null,
      asignadoA: null,
      usuario: null,
      fechaHoy: null,
      idEstatusTarea: null,
      idActividad: null,
      idTarea: null,
      esfuerzoTarea: null,
      esfuerzoHoy: null,
      issue: null,
      riesgo: null,
      nota: null,
      controlProd:null,
    };
    this.transaccionesBoton = {
      idReale: null,
      idPlaneacion: null,
      esfuerzo: 0,
      asignadoA: null,
      issue: null,
      riesgo: null,
      nota: null,
    };
    this.transaccionRealCampos = {
      idReale: null,
      idPlaneacion: null,
      asignadoA: null,
      fechaRealInicio: null,
      esfuerzo: null,
      fechaRealTermino: null,
      issue: null,
      riesgo: null,
      nota: null,
      idEstatusTarea: null,
    }
  }


  obtenerColaboradores() {

    if (this.listaColaboradores != null) {
      this.catalogoColaboradoresService.obtenerColaboradores().then(controlProduccion => { this.listaColaboradores = this.crearListaColaboradores(controlProduccion) }, resultado => {
        this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener los Colaboradores" });
      });
    }
  }

  crearListaColaboradores(lista: any[]) {
    let listaAuxColaboradores: OpcionSelect[] = [];
    for (var i = 0; i < lista.length; i++) {
      listaAuxColaboradores.push({
        value: String(lista[i].idColaborador),
        name: "[" + lista[i].isColaborador + "] " + lista[i].nombre + " " + lista[i].apellidoPaterno
      });
    }
    return listaAuxColaboradores;
  }

  cambiarColaboradores(event) {
    if (event != null && event.value != null && event.value.value != null) {
      this.obtenerCatalogoPlaneacion(event.value);
      this.limpiarActividad();
      this.limpiar();
    } else {
      this.limpiarActividad();
      this.limpiar();
      this.menuBarActionService.asignaEstatusRealesDeshabilitado();
    }
  }

  /*refreshCatalogoPlaneacion(idPlaneacion: number) {
    this.realesService.obtenerPlaneacionesPorId(String(idPlaneacion)).then(planeaciones => { this.listaPlaneaciones = this.crearListaPlaneacion(planeaciones) }, resultado => {
      this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener las Planeaciones" });
    });
  }*/


  obtenerCatalogoPlaneacion(elemento: OpcionSelect) {
    let idPlaneacion = elemento.value;
    this.realesService.obtenerPlaneacionesPorId(idPlaneacion).then(planeaciones => { this.listaPlaneaciones = this.crearListaPlaneacion(planeaciones) }, resultado => {
      this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener las Planeaciones" });
    });
  }

  crearListaPlaneacion(lista: CatalogoPlaneacionEjecucion[]) {
    let listaAuxPlaneacion: OpcionSelect[] = [];
    for (var i = 0; i < lista.length; i++) {
      let objetoPlaneacion: OpcionSelect = {
        value: String(lista[i].idPlaneacion),
        name:  lista[i].idTarea.idControlProduccion.controlProduccion + "/" +  lista[i].idActividad.actividad + "/" + " " + lista[i].idTarea.tarea + "/" + " " + lista[i].fechaInicioPlaneado + "/" + " " + lista[i].fechaTerminoPlaneado
      };
     
      this.controlProducion=lista[i].idTarea.idControlProduccion.controlProduccion;
      this.notaReal=lista[i].idTarea.nota;
     
      if (lista[i].idEstatusTarea == 3) {
        this.opccionPlaneaciones = objetoPlaneacion
        //this.playBoton(true, false, false, true);
        this.planeacionCombo=true;
        this.menuBarActionService.asignarEstatusPausa();
        this.obtenerCamposPlaneacionId(lista[i].idPlaneacion);
      }
      listaAuxPlaneacion.push(objetoPlaneacion);
    }
    return listaAuxPlaneacion;
  }

  playBoton(play: boolean, pause: boolean, stop: boolean, planeacionCombo: boolean) {
    this.play = play;
    this.pause = pause;
    this.stop = stop;

    if (this.play && !this.pause && !this.stop) {
      this.menuBarActionService.asignarEstatusPausa();//Inicio
    }
    if (!this.play && this.pause && !this.stop) {
      this.menuBarActionService.asignarEstatusPausa();//Detener
    }
    if (!this.play && this.pause && this.stop) {
      this.menuBarActionService.asignarEstatusPlay();//Finalizar
    }

    this.planeacionCombo = planeacionCombo;
  }


  cambiarPlaneaciones(event) {
    this.limpiar();

    if (event != null && event.value != null && event.value.value != null) {
      this.obtenerCamposPlaneacion(event.value);
      // this.playBoton(false, true, true, false);
      this.menuBarActionService.asignaEstatusRealesApertura();
    }
    else {
      this.menuBarActionService.asignaEstatusRealesDeshabilitado();
      this.habilitarInputs=false;
      
    }

  }

  obtenerCamposPlaneacionId(idPlaneacion: number) {
    let idPlaneacionCadena = String(idPlaneacion);
    this.realesService.obtenerDatosPorId(idPlaneacionCadena).then(planeacionesCampos => { this.listaPlaneacionesCampos = planeacionesCampos; this.crearDatosFormulario(planeacionesCampos, idPlaneacionCadena) }, resultado => {
      this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener las Planeaciones" });
    });
  }


  obtenerCamposPlaneacion(elemento: OpcionSelect) {
    let idPlaneacion = elemento.value;
    this.realesService.obtenerDatosPorId(idPlaneacion).then(planeacionesCampos => { this.listaPlaneacionesCampos = planeacionesCampos; this.crearDatosFormulario(planeacionesCampos, idPlaneacion) }, resultado => {
      this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener las Planeaciones" });
    });
    this.habilitarInputs=true;
  }

  crearDatosFormulario(list: TransaccionReales, idPlaneacion: string) {
    this.transaccionRealesGuarda.idPlaneacion = Number(idPlaneacion);
    this.transaccionRealesGuarda.fechaInicioPlaneado = list.fechaInicioPlaneado;
    this.transaccionRealesGuarda.fechaTerminoPlaneado = list.fechaTerminoPlaneado;
    this.transaccionRealesGuarda.esfuerzoPlaneado = list.esfuerzoPlaneado;
    this.transaccionRealesGuarda.esfuerzoTarea = list.esfuerzoTarea;
    this.transaccionRealesGuarda.esfuerzoHoy = list.esfuerzoHoy;
    this.transaccionRealesGuarda.usuario = list.usuario;
    this.transaccionRealesGuarda.fechaHoy = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.transaccionRealesGuarda.controlProd =this.controlProducion;
    this.transaccionRealesGuarda.asignadoA = list.asignadoA;
    this.transaccionRealCampos.nota=this.notaReal;
    this.iDAsignado = list.asignadoA;
    this.iDPlaneacion = Number(idPlaneacion);
    this.transaccionRealesGuarda.realActivo = list.realActivo;


    if (list.realActivo != null) {
      this.idRealActivo = list.realActivo.idReale;
      console.log(this.idRealActivo);

    } else {
      this.idRealActivo = 0;
      console.log('vacio');

    }
    

  }


  recuperarId(lista: TransaccionRealesBoton) {
    this.iniciarBoton = lista;

  }

  ejecutarBotonIniciar() {
    if (this.iDPlaneacion != null) {
      this.transaccionesBoton.idReale = 0;
      this.transaccionesBoton.idPlaneacion = this.iDPlaneacion;
      this.transaccionesBoton.asignadoA = this.iDAsignado;
      this.transaccionesBoton.issue = this.transaccionRealCampos.issue;
      this.transaccionesBoton.riesgo = this.transaccionRealCampos.riesgo;
      this.transaccionesBoton.nota = this.transaccionRealCampos.nota;

      this.realesService.inicializarBoton(this.transaccionesBoton).then(iniciar => { this.recuperarId(iniciar) }, resultado => {
        this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al inicializar  la planeacion" });
      });
    }
    //this.playBoton(true, false, false, false);
    this.menuBarActionService.asignarEstatusPausa();

    this.mostrarMensajeEdicion("inicializacion")
  }


  ejecutarBotonDetener() {

    this.realesService.obtenerDatosPorId(String(this.iDPlaneacion)).then(planeacionesCampos => {
      this.listaPlaneacionesCampos = planeacionesCampos; this.crearDatosFormulario(planeacionesCampos, String(this.iDPlaneacion)
      );
      this.transaccionesBoton.idPlaneacion = this.iDPlaneacion;
      this.transaccionesBoton.asignadoA = this.iDAsignado;
      this.transaccionesBoton.idReale = this.idRealActivo;
      this.transaccionesBoton.issue = this.transaccionRealCampos.issue;
      this.transaccionesBoton.riesgo = this.transaccionRealCampos.riesgo;
      this.transaccionesBoton.nota = this.transaccionRealCampos.nota;

      this.realesService.detenerBoton(this.transaccionesBoton).then(detener => { this.recuperarId(detener) }, resultado => {
      });

    }, resultado => {
      this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al Detener las Planeaciones" }); this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al obtener las Planeaciones" });
    });

    //this.playBoton(false, true, false, false);
    this.menuBarActionService.asignarEstatusPlay();
    this.mostrarMensajeEdicion("Detuvo")
  }

  ejecutarBotonFinalizar() {

    this.realesService.obtenerDatosPorId(String(this.iDPlaneacion)).then(planeacionesCampos => {
      this.listaPlaneacionesCampos = planeacionesCampos; this.crearDatosFormulario(planeacionesCampos, String(this.iDPlaneacion)
      );
      this.transaccionesBoton.idPlaneacion = this.iDPlaneacion;
      this.transaccionesBoton.asignadoA = this.iDAsignado;
      this.transaccionesBoton.idReale = this.idRealActivo;
      this.transaccionesBoton.issue = this.transaccionRealCampos.issue;
      this.transaccionesBoton.riesgo = this.transaccionRealCampos.riesgo;
      this.transaccionesBoton.nota = this.transaccionRealCampos.nota;

      this.realesService.finzalizarBoton(this.transaccionesBoton).then(finalizar => {
        this.recuperarId(finalizar); 
        this.cambiarColaboradores({ value: this.opccionColaboradores });
      }, resultado => {
        this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al recuperar Colaboradores" });
      });

    }, resultado => {
      this.messageService.add({ severity: 'error', summary: "Error", detail: "Ocurrió un error al Finalizar  las Planeaciones" }); 
    });

    this.mostrarMensajeEdicion("Finalizo")

    this.menuBarActionService.asignarEstatusApertura();
    this.limpiarActividad();
    this.limpiar();

  }


  mostrarMensajeEdicion(tipo: string) {
    this.messageService.add({ severity: 'success', summary: "Resultado", detail: "Se " + tipo + " la planeacion  " + " " + " correctamente" });
  }


}
