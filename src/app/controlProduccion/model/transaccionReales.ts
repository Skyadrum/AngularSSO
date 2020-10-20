
import { CatalogoActividades } from './catalogoActividades';
import { CatalogoTareas } from './catalogoTareas';

export interface TransaccionReales {
    realActivo:TBRealDTO;
    idPlaneacion: number;
    fechaInicioPlaneado: Date;
    fechaTerminoPlaneado:Date;
    esfuerzoPlaneado: number;
    nanual:number;
    asignadoA:number;
    usuario:string;
    fechaHoy:String;
    idEstatusTarea:number;
    idActividad:CatalogoActividades;
    idTarea:CatalogoTareas;
    esfuerzoTarea:number;
    esfuerzoHoy:number;
    issue:string;
    riesgo:string;
    nota:string;
    controlProd:string;
}

export interface TransaccionRealesBoton {
    idReale:number;
    idPlaneacion:number;
	  asignadoA:number;
    esfuerzo:number;
    issue:string;
    riesgo:string;
    nota:string;
}

export interface TBRealDTO {
    idReale:number;
    idPlaneacion:number;
    asignadoA:number;
   fechaRealInicio:Date;
    esfuerzo:number;
   fechaRealTermino: Date;
    issue: string;
    riesgo: string;
    nota:string;
   idEstatusTarea:number;
}
