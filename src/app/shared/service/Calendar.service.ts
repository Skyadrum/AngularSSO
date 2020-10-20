import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CalendarService {

    obtenerIdioma() : any{
        return {
            firstDayOfWeek: 1,
            dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            today: 'Hoy',
            clear: 'Borrar'
        }
    }

    // formato ejemplo "martes, 5 de mayo de 2020"
    obtenerFormatoFecha(): string{
        return "EEEE, d 'de' MMMM 'de' y";
    }

    // formato ejemplo "martes, 12 de mayo de 2020 3:06 a. m."
    obtenerFormatoFechaHora(): string{
        return "EEEE, d 'de' MMMM 'de' y h:mm a";
    }
    
    // texto ejemplo "2020-04-30"
    obtenerDatePorFecha(texto: Date): Date{
        let milisegundos = Date.parse(texto.toString() +" 00:00");
        if (!isNaN(milisegundos)){
            return new Date(milisegundos);
        }
        return null;
    }

    // texto ejemplo "2020-04-30T05:00:00.000+0000"
    obtenerDatePorFechaHora(texto: Date){
        let milisegundos = Date.parse(texto.toString());
        if (!isNaN(milisegundos)){
            return new Date(milisegundos);
        }
        return null;
    }

}