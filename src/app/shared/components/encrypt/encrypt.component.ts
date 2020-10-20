import { MenuHeaderService } from '@app/shared/service/MenuHeader.service';
import { MenuBarActionService } from '@app/shared/service/MenuBarAction.service';
import { MensajeService } from '@app/shared/service/Mensaje.service';
import { BitacoraService } from '@app/shared/service/Bitacora.service';
import { BaseComponent } from '@app/shared/model/BaseComponent';
import { OnInit, Component } from '@angular/core';
import { Encrypt } from '@app/shared/model/Encrypt';
import { OpcionSelect } from '@app/shared/model/Combo';
import { ComboService } from '@app/shared/service/Combo.service';
import { EncryptService } from '@app/shared/service/Encrypt.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-encrypt',
    templateUrl: './encrypt.component.html'
})
export class EncryptComponent extends BaseComponent implements OnInit {
    elementoFormulario: Encrypt;
    listaMetodosEncriptaTexto: OpcionSelect[] = [{ value: "1", name: "M5" }, { value: "2", name: "AES256" }, { value: "3", name: "BCRYPT" }];
    listaMetodosDesencriptaTexto: OpcionSelect[] = [{ value: "1", name: "M5" }, { value: "2", name: "AES256" }];
    listaMetodosEncriptaArchivo: OpcionSelect[] = [{ value: "1", name: "AES256" }];
    opcionSeleccionadaMetodoEncriptaTexto: OpcionSelect;
    opcionSeleccionadaMetodoDesencriptaTexto: OpcionSelect;
    opcionSeleccionadaMetodoEncriptaArchivo: OpcionSelect;

    form: FormGroup;
    error: string;
    uploadResponse = { status: '', message: '', filePath: '' };

    constructor(
        protected menuHeaderService: MenuHeaderService,
        protected menuBarActionService: MenuBarActionService,
        public mensajeService: MensajeService,
        protected bitacoraService: BitacoraService,
        private comboService: ComboService,
        private encryptService: EncryptService,
        private formBuilder: FormBuilder,
    ) {
        super(menuHeaderService, menuBarActionService, mensajeService, bitacoraService);
    }

    ngOnInit() {
        this.cancelar();
    }

    ejecutarBotonEncriptar() {
        // Valida formulario
        let camposRequeridos = [];
        if (this.opcionSeleccionadaMetodoEncriptaTexto == null || this.opcionSeleccionadaMetodoEncriptaTexto.value == null) {
            camposRequeridos.push("Método");
        }
        if (this.elementoFormulario.llaveMetodoEncriptaTexto == null || this.elementoFormulario.llaveMetodoEncriptaTexto.trim() == "") {
            camposRequeridos.push("Llave");
        }
        if (this.elementoFormulario.textoEncripta == null || this.elementoFormulario.textoEncripta.trim() == "") {
            camposRequeridos.push("Texto");
        }

        if (camposRequeridos.length > 0) {
            this.mensajeService.mandarMensajeError(camposRequeridos.length == 1 ? "El campo [" + camposRequeridos.toString() + "] es requerido" : "Los campos [" + camposRequeridos.toString() + "] son requeridos");
            return;
        }

        let objetoEncriptar = {
            cadena: this.elementoFormulario.textoEncripta,
            key: this.elementoFormulario.llaveMetodoEncriptaTexto,
            encoder: this.opcionSeleccionadaMetodoEncriptaTexto.name,
        }
        this.encryptService.encriptarTexto(objetoEncriptar).then(resultado => {
            this.mensajeService.mandarMensajeSuccess("Texto encriptado con éxito");
            this.elementoFormulario.resultadoTextoEncripta = resultado.cadena;
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al encriptar texto");
        });
    }

    ejecutarBotonDesencriptar() {
        // Valida formulario
        let camposRequeridos = [];
        if (this.opcionSeleccionadaMetodoDesencriptaTexto == null || this.opcionSeleccionadaMetodoDesencriptaTexto.value == null) {
            camposRequeridos.push("Método");
        }
        if (this.elementoFormulario.llaveMetodoDesencriptaTexto == null || this.elementoFormulario.llaveMetodoDesencriptaTexto.trim() == "") {
            camposRequeridos.push("Llave");
        }
        if (this.elementoFormulario.textoDesencripta == null || this.elementoFormulario.textoDesencripta.trim() == "") {
            camposRequeridos.push("Texto");
        }

        this.mensajeService.validarCamposRequeridos(camposRequeridos);

        let objetoDesencriptar = {
            cadena: this.elementoFormulario.textoDesencripta,
            key: this.elementoFormulario.llaveMetodoDesencriptaTexto,
            encoder: this.opcionSeleccionadaMetodoDesencriptaTexto.name,
        }
        this.encryptService.desencriptarTexto(objetoDesencriptar).then(resultado => {
            this.mensajeService.mandarMensajeSuccess("Texto desencriptado con éxito");
            this.elementoFormulario.resultadoTextoDesencripta = resultado.cadena;
        }, error => {
            this.mensajeService.mandarMensajeError("Ocurrió un error al desencriptar texto");
        });
    }

    cancelar() {
        this.elementoFormulario = {
            llaveMetodoEncriptaTexto: null,
            textoEncripta: null,
            resultadoTextoEncripta: null,
            llaveMetodoDesencriptaTexto: null,
            textoDesencripta: null,
            resultadoTextoDesencripta: null,
            llaveMetodoEncriptaArchivo: null,
        }

        this.opcionSeleccionadaMetodoEncriptaTexto = this.comboService.limpiarCombo();
        this.opcionSeleccionadaMetodoDesencriptaTexto = this.comboService.limpiarCombo();
        this.opcionSeleccionadaMetodoEncriptaArchivo = this.comboService.limpiarCombo();

        this.form = this.formBuilder.group({
            avatar: ['']
        });

    }


    onFileChange(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.form.get('avatar').setValue(file);
        }
    }

    onSubmit() {
        const formData = new FormData();
        formData.append('file', this.form.get('avatar').value);
        formData.append('codificador', 'AES256');
        formData.append('key', '1111111111111111');

        this.encryptService.upload(formData).subscribe(
            (res) => console.log(res),
            (err) => this.error = err,
            
        );
    }


}