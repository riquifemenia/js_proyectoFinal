//Utilidades varias

class Utilidades {

    constructor() {
        this.luxon = luxon.DateTime
    }

    obtenerFechaYHoraActual = () => {
        const fechaHoraActual = new Date()

        const dia = fechaHoraActual.getDate()
        const mes = fechaHoraActual.getMonth() + 1
        const año = fechaHoraActual.getFullYear()

        const horas = fechaHoraActual.getHours()
        const minutos = fechaHoraActual.getMinutes()
        const segundos = fechaHoraActual.getSeconds()

        const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`
        return fechaFormateada
    }

    darFormatoFecha = (texto) => {
        const fecha = this.luxon.fromISO(texto);

        const diaSemana = fecha.setLocale('es').toFormat('cccc');
        const dia = fecha.day;
        const mes = fecha.month;
        const año = fecha.year;

        const fechaFormateada = `${diaSemana} ${dia}/${mes}/${año}`;
        return fechaFormateada;
    }
}

export default Utilidades