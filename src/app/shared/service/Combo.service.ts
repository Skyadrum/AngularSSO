import { Injectable } from '@angular/core';
import { ElementoCatalogo, OpcionSelect } from '../model/Combo';

@Injectable({ providedIn: 'root' })
export class ComboService {

    limpiarCombo() {
        return { value: null, name: "" };
    }

    asignarValorCombo(valor: number, listaCombo: OpcionSelect[]) {
        let valorString = String(valor);
        for (var i = 0; i < listaCombo.length; i++) {
            if (listaCombo[i].value == valorString) {
                return { value: String(valor), name: listaCombo[i].name };
            }
        }
        return { value: null, name: "" };
    }

    asignarValorComboString(valor: string, listaCombo: OpcionSelect[]) {
        for (var i = 0; i < listaCombo.length; i++) {
            if (listaCombo[i].value == valor) {
                return { value: valor, name: listaCombo[i].name };
            }
        }
        return { value: null, name: "" };
    }

    obtenerValorCombo(combo: OpcionSelect) {
        if (combo != null && combo.value != null) {
            return parseInt(combo.value);
        } return null;
    }

    obtenerValorComboString(combo: OpcionSelect) {
        if (combo != null && combo.value != null) {
            return combo.value;
        } return null;
    }
    
    // Creado para los catalogos simples
    crearListaComboBase(listaDatos: ElementoCatalogo[]) {
        let listaAux: OpcionSelect[] = [];
        for (var i = 0; i < listaDatos.length; i++) {
            listaAux.push({
                value: String(listaDatos[i].id),
                name: "[" + listaDatos[i].id + "] " + listaDatos[i].nombre
            });
        }
        return listaAux;
    }

}
