import Utilidades from './utilidades.js'

class LogAlertManager {
    constructor() {
        this.utilidades = new Utilidades()
        this.logs = [];
        //this.filename = filename;
    }

    async agregarLog(texto) {
        // this.logs.push(log);
        // this.writeLogsToFile();

        const fechaHoraActual = this.utilidades.obtenerFechaYHoraActual()
        let log = `${fechaHoraActual} ==> ${texto}`
        console.log(log)
    }

    // async writeLogsToFile() {
    //     const logString = this.logs.join('\n');

    //     try {
    //         const response = await fetch(`/writeLogs?filename=${encodeURIComponent(this.filename)}`, {
    //             method: 'POST',
    //             body: logString
    //         });

    //         if (response.ok) {
    //             console.log('Logs written to', this.filename);
    //         } else {
    //             console.error('Error writing logs to file:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('Error writing logs to file:', error);
    //     }
    // }

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
            position: "left",
            stopOnFocus: true,
            duration: 4000,
            close: true,
            offset: {
                x: '15rem',
                y: '16rem',
            },
        })

        notificacion.showToast()
    }
}

export default LogAlertManager;
