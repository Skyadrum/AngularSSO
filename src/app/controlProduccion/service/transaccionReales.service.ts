import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { TransaccionRealesBoton, TransaccionReales, TBRealDTO } from '../model/transaccionReales';
import { CatalogoPlaneacionEjecucion } from '../model/catalogoPlaneacion';

@Injectable({
  providedIn: 'root'
})
export class TransaccionRealesService {


  constructor(private http: HttpClient) { }

  /*  private baseUrl = this.httpService.getUrlBase()+'registroReales';
    private httpOptions = this.httpService.getHttpJson();*/


  obtenerDatosPorId(idPlaneacion: string){
    return this.http.get<any>(`${environment.apiControlProduccion}` + 'registroReales/campos/idPlaneacion/' + idPlaneacion)
        .toPromise()
        .then(res => <TransaccionReales>res)
        .then(data => { return data });
  }

  funcionBoton(origen: String, elemento: TransaccionRealesBoton) {
      return this.http.post<any>(`${environment.apiControlProduccion}` +'registroReales/'+ origen , elemento)
          .toPromise()
          .then(res => <TransaccionRealesBoton>res)
          .then(data => { return data });
  }

  inicializarBoton(inicializar: TransaccionRealesBoton) {
    return this.http.post<any>(`${environment.apiControlProduccion}` + 'registroReales/iniciar', inicializar)
      .toPromise()
      .then(res => <TransaccionRealesBoton>res)
      .then(data => { return data });
  }

  detenerBoton(detener: TransaccionRealesBoton) {
    return this.http.post<any>(`${environment.apiControlProduccion}` + 'registroReales/detener', detener)
      .toPromise()
      .then(res => <TransaccionRealesBoton>res)
      .then(data => { return data });
  }

  finzalizarBoton(inicializar: TransaccionRealesBoton) {
    return this.http.post<any>(`${environment.apiControlProduccion}` + 'registroReales/finalizar', inicializar)
      .toPromise()
      .then(res => <TransaccionRealesBoton>res)
      .then(data => { return data });
  }

  realActivo(idPlaneacion: string) {
      return this.http.get<any>(`${environment.apiControlProduccion}` + 'registroReales/realActivo/idPlaneacion/' + idPlaneacion)
          .toPromise()
          .then(res => <TBRealDTO>res)
          .then(data => { return data });
  }

  obtenerPlaneacionesPorId(idPlaneacion: string){
      return this.http.get<any>(`${environment.apiControlProduccion}` + 'catalogoPlaneacion/planeacion/idColaborador/' + idPlaneacion)
          .toPromise()
          .then(res => <CatalogoPlaneacionEjecucion[]>res)
          .then(data => { return data });
    }




}
