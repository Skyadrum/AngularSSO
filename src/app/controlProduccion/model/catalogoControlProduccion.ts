import { CatalogoEstatusControlProduccion } from './catalogoEstatusControlProduccion';
import { CatalogoProyecto } from './catalogoProyecto';
import { CatalogoTemplate } from './catalogoTemplate';

export interface CatalogoControlProduccion {
    idcontrolProduccion: number;
    controlProduccion: string;
    dscontrolProduccion: string;
    idestatusControProduccion: CatalogoEstatusControlProduccion;
    idProyecto: CatalogoProyecto;
    wbs: string;
    estatus: string;
    template: string;
    idTemplate: CatalogoTemplate;
}

export interface CatalogoControlProduccionGuarda {
    idControlProduccion: number;
    controlProduccion: string;
    descControlProduccion: string;
    idEstatusCtrlProd: number;
    idProyecto: number;
    idTemplate: number;
}

export interface CatalogoControlProduccionDTO {
    idControlProduccion: number;
    controlProduccion: string;
    descControlProduccion: string;
    idProyecto: number;
    idTemplate: number;
    template: string;
    idEstatusCtrlProd: number;
    estatusControlProduccion: string;
    proyectoColumna: string;
    templateColumna: string;
    estatusColumna: string;
}