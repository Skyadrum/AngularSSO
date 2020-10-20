export interface IncidenciaDTO {
    idIncidencia: number;
    idTipoIncidencia: number;
    idSistema: number; 
    idAmbiente: number;
    idPantalla: number;
    usuario: string;
    ipUsuario: string;
    nombreEquipo: string;
    ubicacion: string;
    accion: string;
    valor_anterior: string;
    valor_actual: string;
    dsIncidencia: string;
    fechaIncidencia: string;
}