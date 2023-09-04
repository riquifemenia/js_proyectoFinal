//Utilidades varias

class Utilidades {
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
        const fecha = new Date(texto)

        const dia = fecha.getDate()
        const mes = fecha.getMonth() + 1
        const año = fecha.getFullYear()

        const fechaFormateada = `${dia}/${mes}/${año}`
        return fechaFormateada
    }
}

export default Utilidades