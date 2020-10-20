import { CatalogoTiposTarea } from './catalogoTiposTarea';
import { CatalogoTemplate } from './catalogoTemplate';

export interface CatalogoActividades {
    idactividad: number;
    actividad: string;
    dsactividad: string;
    peso: number;
    tipoTarea: string;
    idtipoTarea: CatalogoTiposTarea;
    actividadPredecesor: string;
    idActividadPredecesor: number;
    trabajoParaleloString: string;
    trabajoParalelo: number;
    template: string;
    idTemplate: CatalogoTemplate;
}

export interface CatalogoActividadesGuarda {
    idActividad: number;
    actividad: string;
    descActividad: string;
    peso: number;
    idTipoTarea: number;
    idActividadPredecesor: number;
    trabajoParalelo: number;
    idTemplate: number;
}

export interface CatalogoActividadesDTO{
  idActividad :number;
  actividad: string;
   descActividad: string;
   peso : number;
  idTipoTarea:number;
   idActividadPredecesor:number;
   trabajoParalelo:number;
   idTemplate:number;
}
