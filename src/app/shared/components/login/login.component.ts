import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDTO } from '@app/shared/model/UserDTO';
import { BlockService } from '@app/shared/service/Block.service';
import { AccountService } from '../../service/Account.service';
import { MensajeService } from '../../service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { VariableSistemaService } from '@app/shared/service/VariableSistema.service';

@Component({
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    returnUrl: string;
    showCaptcha: boolean = false;
    validateCaptcha: boolean = false;
    user: UserDTO = {
        id: null,
        usuario: null,
        password: null,
        nombre: null,
        apellidoPaterno: null,
        apellidoMaterno: null,
        accessToken: null,
        refreshToken: null,
        tiempoUltimaPeticion: null,
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private message: MensajeService,
        private blockService: BlockService,
        private bitacoraService: BitacoraService,
        private variableSistemaService: VariableSistemaService,
    ) { }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['/'] || '/home';
        this.accountService.logout();
        this.blockService.cleanBlock();
    }

    validarUsuario() {
        if (this.user && this.user.usuario && this.user.password && (this.validateCaptcha || !this.showCaptcha)) {
            this.blockService.setBlock();
            this.accountService.login(this.user).then(resultado => this.loggearUsuario(), error => {
                this.message.mandarMensajeError("Datos de acceso incorrectos");
                this.blockService.cleanBlock();
            });

        } else {
            this.message.mandarMensajeError("Llene todos los campos");
        }
    }

    loggearUsuario() {
        this.bitacoraService.guardarSesion("LOGIN", "Pantalla Login", "Usuario " + this.user.usuario + " firmado con éxito");
        this.blockService.cleanBlock();
        this.variableSistemaService.limpiarVariables();
        this.router.navigate([this.returnUrl]);
    }

    responseCaptcha(event) {
        this.validateCaptcha = true;
    }

    expireCaptcha() {
        this.validateCaptcha = false;
    }
}