import Utilidades from './utilidades.js'

class LogAlertManager {
    constructor() {
        this.utilidades = new Utilidades()
        this.logs = [];
    }

    async agregarLog(texto) {

        const fechaHoraActual = this.utilidades.obtenerFechaYHoraActual()
        let log = `LOG:\n${fechaHoraActual} ==> ${texto}`
        this.alertConsejo(log)
    }

    async alertConfirmacion(texto) {
        texto = `${texto}`
        const resultado = await Swal.fire({
            title: '¿Estás seguro?  ',
            html: texto,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal__custom-button',
                cancelButton: 'swal__custom-button2',
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
        return resultado
    }

    async alertMensaje(texto) {
        await Swal.fire({
            title: 'Aviso',
            html: texto,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal__custom-button',
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
    }
    async alertCancel(texto) {
        await Swal.fire({
            title: 'Cancelado',
            html: texto,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal__custom-button',
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
    }

    async alertError(texto) {
        texto = `${texto}. Comunicate con el administrador del sitio.`
        await Swal.fire({
            title: '¡Error!',
            html: texto,
            icon: 'error',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
            customClass: {
                confirmButton: 'swal__custom-button',
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
    }

    async alertConsejo(texto) {
        const notificacion = Toastify({
            className: 'toast__custom ',
            text: texto,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            duration: 12000,
            close: true,
            offset: {
                x: '4rem',
                y: '4rem',
            },
        })

        notificacion.showToast()
    }
}

export default LogAlertManager;
