import { CatalogoColaborador } from './catalogoColaboradores';

export interface CatalogoUsuario {
    idUsuario: number;
    clave: string;
    usuario: string;
    colaborador: string;
    idColaborador: CatalogoColaborador;
}
