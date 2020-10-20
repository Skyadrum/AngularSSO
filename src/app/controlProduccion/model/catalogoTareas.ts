import { CatalogoControlProduccion } from './catalogoControlProduccion';

export interface CatalogoTareas {
    idtarea: number;
    tarea: string;
    dstarea: string;
    esfuerzoPlaneado: number;
    controlProduccion: string;
    idControlProduccion: number;
    etapa: string;
    idetapa: number;
    agrupadorTarea: string;
    idagrupadorTarea: number;
    orden: number;
    nota: string;
}

export interface CatalogoTareasGuarda {
    idTarea: number;
    idControlProduccion: number;
    tarea: string;
    descTarea: string;
    esfuerzoPlaneado: number;
    idEtapa: number;
    idAgrupadorTarea: number;
    orden: number;
    nota: string;
}

export interface CatTareaEjecucionDTO{
    idTarea:number;
     idControlProduccion:CatalogoControlProduccion;
     tarea: string;
     descTarea: string;
     esfuerzoPlaneado:number;
     idEtapa:number;
     idAgrupadorTarea:number;
     orden:number;
     nota:string;

}
