import JsonManager from './jsonManager.js'
import LogAlertManager from './logAlertManager.js'

const jsonManager = new JsonManager()
const logAlertManager = new LogAlertManager()

class Paciente {
    constructor() {

    }

    generarIdPaciente = async () => {
        try {
            const ids = datos.pacientes.map(objeto => Number(objeto.id))
            const maximo = Math.max(...ids)
            return maximo + 1
        } catch (error) {
            await logAlertManager.alertError(`Error al generar ID del nuevo paciente: ${error.message}.`)
        }
    }

    //Validad si el paciente existe según número de documento
    validarPaciente = async (documento) => {
        documento = documento.toUpperCase()
        let datos = JSON.parse(await jsonManager.leerDesdeLocalStorage('datos'))
        const pacienteSeleccionado = datos.pacientes.find(paciente => paciente.documento === documento)
        return pacienteSeleccionado
    }

    registrarPaciente = async (datos, pacienteACrear) => {
        datos.pacientes.push(pacienteACrear);

        // Guardar datos en el localStorage
        try {
            await jsonManager.guardarEnLocalStorage('datos', JSON.stringify(datos))
            await logAlertManager.agregarLog(`Datos del paciente actualizados en localStorage`)
            await logAlertManager.alertMensaje('¡Paciente registrado con éxito!')

        } catch (error) {
            await logAlertManager.alertError(`Error al registar el nuevo paciente: ${error.message}.`)
        }
    }
}

export default Paciente 