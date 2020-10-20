import { CatalogoCliente } from './catalogoCliente';
import { CatalogoColaborador } from './catalogoColaboradores';

export interface CatalogoProyecto {
      idProyecto: number;
      wbs: string;
      proyecto: string;
      projectLeaderGrid: string;
      projectLeader: CatalogoColaborador;
      deliveryManagerGrid:string;
      deliveryManager: CatalogoColaborador;
      admGrid:string;
      adm: CatalogoColaborador;
      practiceManagerGrid:string;
      practiceManager: CatalogoColaborador;
      clientes: string;
      idCliente: CatalogoCliente;
}

export interface CatalogoProyectoGuarda {
      idProyecto: number;
      wbs: string;
      proyecto: string;
      projectLeader: number;
      deliveryManager: number;
      adm: number;
      practiceManager: number;
      idCliente: number;
}
