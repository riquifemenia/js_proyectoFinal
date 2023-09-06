//INCLUYE
// Uso de clases
// Interacciòn con el DOM
// Bloque TRY-CATCH
// Funciones asíncronas e interacción con un archivo JSON
// Uso de localStorage
// Uso de la clase Date para el manejo de fechas

//Nota para uso: documentos de pacientes ya resgistrados: 12345678, 23456789, 34567890, 45678901, 56789012, 67890123


// FALTA PARA ENTREGA FINAL
// Módulos alta de paciente y consultas de turnos ya agendados
// Revisión de manejo de todos los errores
// Alerts "bonitos"
// Ajuste de la vista html

import Utilidades from './utilidades.js'
import JsonManager from './jsonManager.js'
import LogAlertManager from './logAlertManager.js'
import Paciente from './paciente.js'

//---CLASES---//    

class DomManager {
    constructor() {
        //elementos del DOM
        this.numeroDocumento = document.getElementById("numeroDocumento")
        this.ingresarBtn = document.getElementById("ingresarBtn")
        this.especialidadesSelect = document.getElementById("especialidades")
        this.medicosSelect = document.getElementById("medicos")
        this.horariosSelect = document.getElementById("horarios")
        this.reservarBtn = document.getElementById("reservarBtn")
        this.cancelarPacienteBtn = document.getElementById("cancelarPacienteBtn")
        this.registrarPacienteBtn = document.getElementById("registrarPacienteBtn")
        this.cancelarTurnoBtn = document.getElementById("cancelarTurnoBtn")
        this.formDatos = document.getElementById('formDatos')

        //Eventos
        this.ingresarBtn.addEventListener("click", this.iniciarTurnos.bind(this))
        this.especialidadesSelect.addEventListener("change", this.actualizarMedicos.bind(this))
        this.medicosSelect.addEventListener("change", this.actualizarHorarios.bind(this))
        this.horariosSelect.addEventListener("change", this.habilitarReserva.bind(this))
        this.reservarBtn.addEventListener("click", this.confirmarReserva.bind(this))
        this.cancelarPacienteBtn.addEventListener("click", this.cancelar.bind(this))
        this.registrarPacienteBtn.addEventListener("click", this.registrarPaciente.bind(this))
        this.cancelarTurnoBtn.addEventListener("click", this.cancelar.bind(this))
        this.formDatos.addEventListener("input", this.habilitarBotonRegistrarPaciente.bind(this))
    }

    inicio = async () => {
        // Ocultar formulario de turnos
        this.ocultarElemento(formDatos)
        this.ocultarElemento(formTurno)
        this.ocultarElemento(reservarBtn)
        this.ocultarElemento(registrarPacienteBtn)
        this.ocultarElemento(cancelarPacienteBtn)
        this.ocultarElemento(cancelarTurnoBtn)
        logAlertManager.agregarLog('Inicio de la aplicación')

        try {
            // Obtener datos y guardar en el localStorage
            datos = await jsonManager.obtenerDatos()
            await jsonManager.guardarEnLocalStorage('datos', JSON.stringify(datos))
            logAlertManager.agregarLog('Datos leídos de archivo JSON y cargados el localStore')

            // Mostrar los pacientes registrados en el cuadro de ayuda
            const pacientesExistentes = datos.pacientes.map(paciente => paciente.documento).join(', ')
            logAlertManager.alertConsejo(`AVISO PARA PRUEBAS:\nDNI de pacientes ya registrados: ${pacientesExistentes}`)

        } catch (error) {
            await logAlertManager.alertError(`${error.message}`)
            window.location.href = '../index.html'
        }
    }

    reinicio = async () => {
        // Ocultar formulario de turnos
        this.ocultarElemento(formDatos)
        this.ocultarElemento(formTurno)
        this.ocultarElemento(reservarBtn)
        this.ocultarElemento(registrarPacienteBtn)
        this.ocultarElemento(cancelarPacienteBtn)
        this.ocultarElemento(cancelarTurnoBtn)

        // Restablecer campos y elementos del formulario
        this.numeroDocumento.value = ''
        this.especialidadesSelect.selectedIndex = 0
        this.medicosSelect.selectedIndex = 0
        this.horariosSelect.selectedIndex = 0
        this.medicosSelect.disabled = true
        this.horariosSelect.disabled = true
        this.reservarBtn.disabled = true
        this.registrarPacienteBtn.disabled = true
        this.mostrarElemento(numeroDocumento)
        this.mostrarElemento(ingresarBtn)

        logAlertManager.agregarLog('Reinicio de la aplicación')

        try {
            // Leer datos desde el localStorage
            datos = JSON.parse(await jsonManager.leerDesdeLocalStorage('datos'))
            logAlertManager.agregarLog('Datos leídos desde localStore')

            // Mostrar los pacientes registrados en el cuadro de ayuda
            const pacientesExistentes = datos.pacientes.map(paciente => paciente.documento).join(', ')
            logAlertManager.alertConsejo(`AVISO PARA PRUEBAS:\nDNI de pacientes ya registrados: ${pacientesExistentes}`)

        } catch (error) {
            this.logAlertManager.alertError(`${error.message}`)
            window.location.href = '../index.html'
        }
    }

    // Inicio al presionar el botón "Ingresar"
    iniciarTurnos = async () => {
        const documento = this.numeroDocumento.value
        this.ocultarElemento(this.numeroDocumento)
        this.ocultarElemento(this.ingresarBtn)
        this.deshabilitarInputs(formDatos)
        this.mostrarElemento(formDatos)
        turno.inicioTurnos(documento)
    }

    //Tomar datos ya registrados del paciente y los muestra
    generarFormulario(paciente) {
        document.getElementById("nombre").value = paciente.nombre
        document.getElementById("apellido").value = paciente.apellido
        document.getElementById("fechaNacimiento").value = paciente.fechaNacimiento
        document.getElementById("documento").value = paciente.documento
        document.getElementById("obraSocial").value = paciente.obraSocial

        domManager.ocultarElemento(registrarPacienteBtn)
        domManager.mostrarElemento(formTurno)
        domManager.mostrarElemento(reservarBtn)
        domManager.mostrarElemento(cancelarTurnoBtn)

        this.generarOpcionesEspecialidades()
    }

    //Formar select de especialidades
    generarOpcionesEspecialidades = () => {
        const especialidades = new Set()

        datos.medicos.forEach(medico => {
            especialidades.add(medico.especialidad)
        })

        const especialidadesOptions = `
            <option value="" disabled selected>Seleccioná una especialidad</option>
            ${Array.from(especialidades).map(especialidad => `<option value="${especialidad}">${especialidad}</option>`)
                .join('')}`
        this.especialidadesSelect.innerHTML = especialidadesOptions
    }

    // Actualiza lista de medicos de acuerdo a la especialidad seleccionada
    actualizarMedicos = async () => {
        const especialidadSeleccionada = this.especialidadesSelect.value
        const medicosOptions = datos.medicos
            .filter(medico => medico.especialidad === especialidadSeleccionada)
            .map(medico => `<option value="${medico.id}">${medico.nombre} ${medico.apellido}</option>`)
            .join('')

        this.medicosSelect.innerHTML = '<option value="" disabled selected>Seleccioná un médico</option>' + medicosOptions
        this.medicosSelect.disabled = false
    }

    // Actualiza lista de horarios de acuerdo al medico seleccionado
    actualizarHorarios = async () => {
        const medicoSeleccionado = this.medicosSelect.value;

        if (medicoSeleccionado in datos.turnosDisponibles) {
            const listaDeTurnos = datos.turnosDisponibles[medicoSeleccionado]
            const horariosOptions = listaDeTurnos
                .filter(turno => turno.disponible)
                .map(turno => `<option value="${turno.id}">${utilidades.darFormatoFecha(turno.fecha)} ${turno.hora}</option>`)
                .join('');

            this.horariosSelect.innerHTML = '<option value="" disabled selected>Seleccioná un horario</option>' + horariosOptions;
            this.horariosSelect.disabled = false
        } else {
            alert(`El médico seleccionado no tiene actualmente turnos disponibles`)
            this.horariosSelect.innerHTML = '<option value="" disabled selected>Seleccioná un horario</option>'
            this.horariosSelect.disabled = true;
        }
    }

    // Habilitar o deshabilitar el botón "Reservar" si están los datos del turno completos
    habilitarReserva = async () => {
        this.reservarBtn.disabled = false
    }

    // Confirmar reserva de turno
    confirmarReserva = async () => {
        //tomar datos del DOM
        const especialidad = this.especialidadesSelect.selectedOptions[0].textContent
        const medico = this.medicosSelect.selectedOptions[0].textContent
        const horario = this.horariosSelect.selectedOptions[0].textContent
        const textoConfirma = `
        <p>Estás por solicitar un turno para:<p>
        Especialiad: ${especialidad}<br>
        Médico: ${medico}<br>
        Fecha y hora: ${horario}`

        let resultado = await logAlertManager.alertConfirmacion(textoConfirma)

        if (resultado.isConfirmed) {
            let confirmado = await turno.solicitarTurno(this.medicosSelect.value, this.horariosSelect.value)
            if (confirmado) {
                await logAlertManager.alertMensaje('¡Turno confirmado con éxito!')
                logAlertManager.agregarLog(`Turno confirmado con éxito`)
                domManager.reinicio()
            }
        } else if (resultado.isDismissed) {
            await logAlertManager.alertCancel('Turno no confirmado. Puedes seleccionar otro turno si lo deseas.')
            this.reinicio()
        }
    }

    habilitarRegistroPaciente = (documento) => {
        this.habilitarInputs(this.formDatos)
        this.mostrarElemento(this.formDatos)
        this.mostrarElemento(this.cancelarPacienteBtn)
        this.mostrarElemento(this.registrarPacienteBtn)
        document.getElementById("documento").value = documento
        this.deshabilitarElemento(document.getElementById("documento"))
        this.registrarPacienteBtn.disabled = true
    }

    // Habilitar o deshabilitar el botón "Registrar" si están los datos del paciente completos
    habilitarBotonRegistrarPaciente() {
        if (this.verificarDatosCompletos()) {
            registrarPacienteBtn.removeAttribute('disabled')
        } else {
            registrarPacienteBtn.setAttribute('disabled', 'true')
        }
    }

    //Verificar si todos los campos están completos
    verificarDatosCompletos() {
        const inputs = this.formDatos.querySelectorAll('input')
        let todosCompletos = true

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                todosCompletos = false
            }
        });
        return todosCompletos
    }

    // Registrar un nuevo paciente
    registrarPaciente = async () => {
        try {
            const pacienteACrear = {
                id: turno.generarIdPaciente(),
                nombre: document.getElementById("nombre").value,
                apellido: document.getElementById("apellido").value,
                documento: document.getElementById("documento").value,
                fechaNacimiento: document.getElementById("fechaNacimiento").value,
                obraSocial: document.getElementById("obraSocial").value,
                turnos: []
            };

            datos.pacientes.push(pacienteACrear);

            // Guardar datos en el localStorage
            try {
                await jsonManager.guardarEnLocalStorage('datos', JSON.stringify(datos))
                logAlertManager.agregarLog(`Datos del paciente actualizados en localStorage`)
                await logAlertManager.alertMensaje('¡Paciente registrado con éxito!')
                domManager.reinicio()
            } catch (error) {
                throw error
            }


        } catch (error) {
            await logAlertManager.alertError(`Error al registar el nuevo paciente: ${error.message}.`)
        }
    }

    // Botón cancelar 
    cancelar = () => {
        this.borrarInputs(this.formDatos)
        domManager.reinicio()
    }

    mostrarElemento = (id) => {
        id.style.display = 'block'
    }

    ocultarElemento = (id) => {
        id.style.display = 'none'
    }

    deshabilitarElemento = (id) => {
        id.disabled = true
    }

    borrarInputs = (id) => {
        let inputElements = id.querySelectorAll('input')

        inputElements.forEach((input) => {
            input.value = ''
        })
    }

    habilitarInputs = (id) => {
        let inputElements = id.querySelectorAll('input')

        inputElements.forEach((input) => {
            input.disabled = false
        })
    }

    deshabilitarInputs = (id) => {
        let inputElements = id.querySelectorAll('input')

        inputElements.forEach((input) => {
            input.disabled = true
        })
    }
}


class Turnos {

    constructor() {
        this.paciente = null
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
        datos = JSON.parse(await jsonManager.leerDesdeLocalStorage('datos'))
        const pacienteSeleccionado = datos.pacientes.find(paciente => paciente.documento === documento)
        return pacienteSeleccionado ? new Paciente(pacienteSeleccionado) : documento
    }

    inicioTurnos = async (documento) => {
        try {
            this.paciente = await this.validarPaciente(documento)

            //Generar turno si el paciente existe
            if (typeof this.paciente === 'object') {
                domManager.generarFormulario(this.paciente)
                await logAlertManager.agregarLog(`Datos del paciente ${this.paciente.nombre} ${this.paciente.apellido} leídos correctamente del localStorage`)
                await logAlertManager.agregarLog(`Inicio de turnos para el paciente ${this.paciente.nombre} ${this.paciente.apellido}`)

                //Si no existe, darlo de alta
            } else {
                domManager.habilitarRegistroPaciente(documento)
                await logAlertManager.alertMensaje(`El paciente con documento ${documento} no existe. Seguidamente podrás darte de alta.`)
                await logAlertManager.agregarLog(`Inicio de alta para el paciente con documento ${documento}`)
            }
        } catch (error) {
            await logAlertManager.alertError(`Error al iniciar turnos: ${error.message}.`)
        }
    }

    // Solicitar un nuevo turno
    solicitarTurno = async (idMedico, idTurno) => {
        //Agregar en el array turnos del paciente el turno solicitado
        datos.pacientes.find(p => p.id === this.paciente.id).turnos.push({ "idMedico": idMedico, "idTurno": idTurno })
        //Marcar como no disponible el turno solicitado en el array de turnos del médico
        datos.turnosDisponibles[idMedico].find(t => t.id == idTurno).disponible = false
        //Log
        const pacienteNombre = `${this.paciente.nombre} ${this.paciente.apellido}`
        logAlertManager.agregarLog(`Turno para el paciente ${pacienteNombre} correctamente agendado`)

        try {
            //Guardar en localStorage los cambios
            await jsonManager.guardarEnLocalStorage('datos', JSON.stringify(datos))
            logAlertManager.agregarLog(`Datos actualizados en localStorage`)
            return true
        } catch (error) {
            logAlertManager.alertError(`Error al guardar datos en localStorage: ${error.message}.`)
        }
    }
}

//---GLOBALES E INICIO---//

let datos

const utilidades = new Utilidades()
const jsonManager = new JsonManager()
const logAlertManager = new LogAlertManager()
const domManager = new DomManager()
const turno = new Turnos()

domManager.inicio()