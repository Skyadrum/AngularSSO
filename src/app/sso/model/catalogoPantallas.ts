import { TreeNode } from 'primeng/api';

export interface PantallaDTO {
    idPantalla: number;
    idAmbiente: number;
    pantalla: string;
    dsPantalla: string;
    clase: string;
    compilado: string;
    rutaMenu: string;
    permisos: string;
    bolPantallaBloqueada:number;
    propietarioNegocio: string;
    propietarioSistemas: string;
    orden:number;
    urlHelp: string;
    routerLink: string;
    ambiente?: string;
    arbolData?: TreeNode;
}


export interface MenuPantallaDTO {
    id?: string;
    children?: TreeNode[];
    id_pantalla: number;
    id_ambiente:number;
    id_sistema:number;
    ambiente:string;
    name: string;
    label: string;
    items: MenuPantallaDTO[];
}

