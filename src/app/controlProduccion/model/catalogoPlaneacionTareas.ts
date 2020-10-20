import { OpcionSelect } from './catalogoGenerico';

export interface CatalogoTareaDTO {
    edit: boolean;
    idGridAutomatico: number;
    idTarea: number;
    idControlProduccion: number;
    tarea: string;
    descTarea: string;
    esfuerzoPlaneado: number;
    esfuerzoPlaneadoDesarrollo: number;
    etapa: string;
    idEtapa: number;
    agrupadorTarea: string;
    idAgrupadorTarea: number;
    orden: number;
    nota: string;
    responsable: string;
    responsableSelect: OpcionSelect;
    idResponsable: number;
    catPlaneacionList: CatalogoPlaneacionDTO[];
}

export interface CatalogoPlaneacionDTO {
	idPlaneacion: number;
    fechaInicioPlaneado: Date;
    fechaTerminoPlaneado: Date;
    esfuerzoPlaneado: number;
    asignadoASelect: OpcionSelect;
    asignadoAGrid: string;
    asignadoA: number;
    fechaAsignacion: Date;
    idEstatusTarea: number;
    actividad: string;
    idActividad: number;
    idTarea: number;
    porcentage: string;
    manual: number;
    manualBoolean: boolean;
}
