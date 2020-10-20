
import { CatalogoGenero } from './catalogoGenero';


export interface CatalogoColaborador {
    idColaborador: number;
	  isColaborador: string;
    usuario: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    at: string;
    atImporte: number;
    genero: string;
    idGenero: CatalogoGenero;
    rolNegocio:string;
    rolTL: number;
    rolPL:number;
    rolDM:number;
    rolADM:number;
    rolPXM:number;
}

export interface CatalogoColaboradoresGuarda {
    idColaborador: number;
	  isColaborador: string;
    usuario: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    at: string;
    atImporte: number;
    idGenero: number;
    rolTL: number;
    rolPL:number;
    rolDM:number;
    rolADM:number;
    rolPXM:number;
};
