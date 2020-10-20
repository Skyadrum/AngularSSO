import { Injectable } from "@angular/core";
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { AmbienteDTO } from '../model/AmbienteDTO';
import { VariableSistemaDTO } from '../model/VariableSistemaDTO';
import { Subject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VariableSistemaService {

    private variables: VariableSistemaDTO;
    private ambienteActual: AmbienteDTO;
    private cambioAmbiente = new Subject<string>();

    constructor(
        private http: HttpClient,
    ) {
        this.limpiarVariables();
    }

    // Utilizado para saber cual boton es presionado
    getEscuchaCambioAmbiente(): Observable<string> {
        return this.cambioAmbiente.asObservable();
    }

    getIdSistema() {
        return ((this.variables) ? String(this.variables.idSistema) : "");
    }

    getIdAmbiente() {
        return ((this.ambienteActual) ? String(this.ambienteActual.idAmbiente) : null);
    }

    getListaAmbientes() {
        return (this.variables ? this.variables.ambientes : []);
    }
    setAmbienteActual(idAmbiente: string) {
        if (this.variables != null && this.variables.ambientes != null) {
            for (let i = 0; i < this.variables.ambientes.length; i++) {
                if (this.variables.ambientes[i].idAmbiente == idAmbiente) {
                    this.ambienteActual = this.variables.ambientes[i];
                    this.cambioAmbiente.next(this.variables.ambientes[i].idAmbiente);
                }
            }
        }
    }
    getAmbientesValidos() {
        return this.http.post<any>(`${environment.apiUrl}` + '/sistema/ambientes', null)
            .toPromise()
            .then(data => {
                this.variables = data;
                if (this.variables != null && this.variables.ambientes != null) {
                    for (let i = 0; i < this.variables.ambientes.length; i++) {
                        if (this.variables.ambientes[i].principal == 1) {
                            this.ambienteActual = this.variables.ambientes[i];
                        }
                    }
                } else {
                    this.ambienteActual = null;
                }
            });
    }

    limpiarVariables(){
        this.variables = null;
        this.ambienteActual = null;
    }

}