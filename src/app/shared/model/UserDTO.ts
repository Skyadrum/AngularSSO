export class UserDTO {
    id: string;
    usuario: string;
    password: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    accessToken: BearerDTO;
    refreshToken: BearerDTO;
    tiempoUltimaPeticion: Date;
}
class BearerDTO {
    bearer: string;
    tiempo: number;
}