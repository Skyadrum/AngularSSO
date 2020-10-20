import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDTO } from '../model/UserDTO';

@Injectable({ providedIn: 'root' })
export class AccountService {

    private userSubject: BehaviorSubject<UserDTO>;
    public user: Observable<UserDTO>;
    private refreshTokenTimeout;

    constructor(
        private router: Router,
        private http: HttpClient,
    ) {
        this.userSubject = new BehaviorSubject<UserDTO>(JSON.parse(localStorage.getItem('userSSO')));
        if (this.userSubject != null && this.userSubject.value != null) {
            this.userSubject.value.tiempoUltimaPeticion = new Date(this.userSubject.value.tiempoUltimaPeticion);
            //this.refreshToken();
        }
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): UserDTO {
        if (this.userSubject != null && this.userSubject.value != null) {
            let tiempoPeticion: Date = new Date();
            let milisegundosPermitidos = Number(`${environment.tiempoSesionMinutos}`) * 60000;
            if ((tiempoPeticion.getTime()) > (this.userSubject.value.tiempoUltimaPeticion.getTime() + milisegundosPermitidos)) {
                // Excede el tiempo maximo permitido
                this.logout();
                return null
            } else {
                // Esta dentro de tiempo, actualizo la variable del local storage
                this.actualizarUltimaPeticion(tiempoPeticion);
            }
        }
        return this.userSubject.value;
    }

    login(user: UserDTO) {
        return this.http.post<UserDTO>(`${environment.apiUrl}` + '/login-check', user)
            .toPromise()
            .then(data => {
                this.agregarUsuario(data);
                return
            });
    }

    private agregarUsuario(usuario: UserDTO) {
        usuario.tiempoUltimaPeticion = new Date();
        localStorage.setItem('userSSO', JSON.stringify(usuario));
        this.userSubject.next(usuario);
        this.startRefreshTokenTimer();
    }

    refreshToken() {
        if (this.userValue != null){
            return this.http.post<any>(`${environment.apiUrl}/refresh`, this.userValue.refreshToken.bearer)
            .toPromise()
            .then(token => {
                this.userValue.accessToken.bearer = token.bearer;
                this.refrescarTokenUsuario(this.userValue);
                return;
            });
        }
        return new Promise(function(resolve){   
            resolve(true);
        });
    }

    private refrescarTokenUsuario(usuario: UserDTO) {
        usuario.tiempoUltimaPeticion = new Date();
        localStorage.setItem('userSSO', JSON.stringify(usuario));
        this.startRefreshTokenTimer();
    }

    private actualizarUltimaPeticion(tiempo: Date) {
        this.userSubject.value.tiempoUltimaPeticion = tiempo;
        localStorage.setItem('userSSO', JSON.stringify(this.userSubject.value));
    }

    logout() {
        this.stopRefreshTokenTimer();
        localStorage.removeItem('userSSO');
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    getFullName() {
        if (this.userValue != null) {
            const { nombre, apellidoPaterno, apellidoMaterno } = this.userValue;
            return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`
        }
        return "";
    }

    private startRefreshTokenTimer() {
        // Refresca cuando el tiempo de expiracion esta al 90%
        if (this.userValue.accessToken.tiempo > 0) {
            const timeout = this.userValue.accessToken.tiempo * 0.9 * 60 * 1000;
            this.refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
        }
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

}