import { CatalogoActividades, CatalogoActividadesDTO } from './catalogoActividades';
import { CatalogoTareas, CatTareaEjecucionDTO } from './catalogoTareas';
import { CatalogoEstatusTarea } from './catalogoEstatusTarea';
import { TBRealDTO } from './transaccionReales';

export interface CatalogoPlaneacion {
    idplaneacion: number;
    fechainicioPlaneado: Date;
    fechaTerminoPlaneado: Date;
    esfuerzoPlaneado: number;
    asignadoA: number;
    asignado: string;
    fechaAsignacion: Date;
    estatusTarea: string;
    idEstatusTarea: CatalogoEstatusTarea;
    actividad: string;
    idactividad: CatalogoActividades;
    tarea: string;
    idtarea: CatalogoTareas;
}

export interface CatalogoPlaneacionGuarda {
    idPlaneacion: number;
	  fechainicioPlaneado: Date;
    fechaTerminoPlaneado: Date;
    esfuerzoPlaneado: number;
    asignadoA: number;
    fechaAsignacion: Date;
    idEstatusTarea: number;
    idActividad: number;
    idTarea: number;
}

export interface CatalogoPlaneacionEjecucion {
      idPlaneacion: number;
	  fechaInicioPlaneado: Date;
      fechaTerminoPlaneado : Date;
      esfuerzoPlaneado : number;
      manual: number;
      asignadoA: number;
      usuario:  string;
      fechaAsignacion: Date;
      idEstatusTarea: number;
      idActividad: CatalogoActividadesDTO;
      idTarea:CatTareaEjecucionDTO;
      esfuerzoTarea: number;
      realActivo:TBRealDTO;
}
