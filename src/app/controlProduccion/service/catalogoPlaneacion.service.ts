import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { TreeNode } from 'primeng/api';


@Injectable({ providedIn: 'root' })
export class CatalogoPlaneacionService {

    constructor(private http: HttpClient) { }

    obtenerMenuArbol(idProyecto: string){
        return this.http.get<TreeNode[]>(`${environment.apiControlProduccion}` + 'catalogoPlaneacion/menuPlaneacion/' + (idProyecto == null ? '' : idProyecto))
            .toPromise()
            .then(data => { return data });
    }
    /*
    obtenerMenuArbol(idProyecto: string): TreeNode[] {
        if (idProyecto == "1") {
            return [
                {
                    data: {
                        idPadre: '',
                        id: '1',
                        nombre: 'BOL - Plataforma Unica',
                        nivel: 0,
                    },
                    expanded: true,
                }
            ]
        }
        return [
            {
                data: {
                    idPadre: '',
                    id: '1',
                    nombre: 'BOL - Plataforma Unica',
                    nivel: 0,
                },
                expanded: true,
            },
            {
                data: {
                    idPadre: '',
                    id: '2',
                    nombre: 'Accimarket Mercado de dinero',
                    nivel: 0
                },
                expanded: true,
            },
            {
                data: {
                    idPadre: '',
                    id: '3',
                    nombre: '1-0000018917 MultiMoneda',
                    nivel: 0
                },
                expanded: true
            },
            {
                data: {
                    idPadre: '',
                    id: '4',
                    nombre: '1-0000018928-1 Clicon Bloque 2',
                    nivel: 0
                },
                expanded: true
            },
            {
                data: {
                    idPadre: '',
                    id: '5',
                    nombre: 'Migración Flex',
                    nivel: 0
                },
                expanded: true
            }
        ];
    }*/


}