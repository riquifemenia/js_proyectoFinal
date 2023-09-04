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
import LogManager from './logManager.js'

//---CLASES---//    

class Configuracion {

    inicio = async () => {
        // Ocultar formulario de turnos
        domManager.ocultarElemento(formDatos)
        domManager.ocultarElemento(formTurno)
        domManager.ocultarElemento(reservarBtn)
        domManager.ocultarElemento(registrarPacienteBtn)
        domManager.ocultarElemento(cancelarPacienteBtn)
        logManager.addLog('Inicio de la aplicación')

        try {
            // Obtener datos y guardar en el localStorage
            datos = await jsonManager.obtenerDatos()
            jsonManager.guardarEnLocalStorage('datos', JSON.stringify(datos))
            domManager.actualizarAyuda('Datos leídos de archivo JSON y cargados el localStore')

            // Mostrar los pacientes registrados en el cuadro de ayuda
            const pacientesExistentes = datos.pacientes.map(paciente => paciente.documento).join(', ')
            domManager.actualizarAyuda(`Nota para pruebas: pacientes ya registrados: ${pacientesExistentes}`)
        } catch (error) {
            console.error('Error al obtener los datos:', error)
        }
    }


    reinicio = async () => {
        // Ocultar formulario de turnos
        domManager.ocultarElemento(formDatos)
        domManager.ocultarElemento(formTurno)
        domManager.ocultarElemento(reservarBtn)
        domManager.ocultarElemento(registrarPacienteBtn)
        domManager.ocultarElemento(cancelarPacienteBtn)

        // Restablecer campos y elementos del formulario
        domManager.numeroDocumento.value = ''
        domManager.especialidadesSelect.selectedIndex = 0
        domManager.medicosSelect.selectedIndex = 0
        domManager.horariosSelect.selectedIndex = 0
        domManager.medicosSelect.disabled = true
        domManager.horariosSelect.disabled = true
        domManager.reservarBtn.disabled = true
        domManager.registrarPacienteBtn.disabled = true
        domManager.mostrarElemento(numeroDocumento)
        domManager.mostrarElemento(ingresarBtn)

        try {
            // Leer datos desde el localStorage
            datos = JSON.parse(await jsonManager.leerDesdeLocalStorage('datos'))
            domManager.actualizarAyuda('Datos leídos desde localStore')

            // Mostrar los pacientes registrados
            const pacientesExistentes = datos.pacientes.map(paciente => paciente.documento).join(', ')
            domManager.actualizarAyuda(`Nota para pruebas: pacientes ya registrados: ${pacientesExistentes}`)
        } catch (error) {
            console.error('Error al obtener los datos:', error)
        }
    }
}

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
        this.ayuda = document.getElementById("ayudaTexto")
        this.formDatos = document.getElementById('formDatos')

        //Eventos
        this.ingresarBtn.addEventListener("click", this.iniciarTurnos.bind(this))
        this.especialidadesSelect.addEventListener("change", this.actualizarMedicos.bind(this))
        this.medicosSelect.addEventListener("change", this.actualizarHorarios.bind(this))
        this.horariosSelect.addEventListener("change", this.habilitarReserva.bind(this))
        this.reservarBtn.addEventListener("click", this.confirmarReserva.bind(this))
        this.cancelarPacienteBtn.addEventListener("click", this.cancelarPaciente.bind(this))
        this.registrarPacienteBtn.addEventListener("click", this.registrarPaciente.bind(this))

        // Habilitar o deshabilitar el botón "Registrar" si están los datos del paciente completos
        this.formDatos.addEventListener('input', () => {
            if (this.verificarDatosCompletos()) {
                registrarPacienteBtn.removeAttribute('disabled');
            } else {
                registrarPacienteBtn.setAttribute('disabled', 'true');
            }
        })
    }

    //Actualizar DOM según eventos (*4)
    iniciarTurnos = async () => {
        const documento = this.numeroDocumento.value
        this.ocultarElemento(this.numeroDocumento)
        this.ocultarElemento(this.ingresarBtn)
        this.deshabilitarInputs(formDatos)
        this.mostrarElemento(formDatos)
        turno.inicioTurnos(documento)
    }

    actualizarMedicos = async () => {
        const especialidadSeleccionada = this.especialidadesSelect.value
        const medicosOptions = this.generarOpcionesMedicos(especialidadSeleccionada)
        this.medicosSelect.innerHTML = medicosOptions
        this.medicosSelect.disabled = false
    }

    actualizarHorarios = async () => {
        const medicoSeleccionado = this.medicosSelect.value
        const horariosOptions = this.generarOpcionesHorarios(medicoSeleccionado)
        this.horariosSelect.innerHTML = horariosOptions
        this.horariosSelect.disabled = false
    }

    habilitarReserva = async () => {
        this.reservarBtn.disabled = false
    }


    confirmarReserva = async () => {
        //tomar datos del DOM
        const especialidad = this.especialidadesSelect.selectedOptions[0].textContent
        const medico = this.medicosSelect.selectedOptions[0].textContent
        const horario = this.horariosSelect.selectedOptions[0].textContent
        const textoConfirma = `
        Estás por solicitar un turno para:
        Especialiad: ${especialidad}
        Médico: ${medico}
        Fecha y hora: ${horario}

        ¿Estás seguro?`
        const confirmacion = confirm(textoConfirma)

        if (confirmacion) {
            //Utilizar la instancia de la clase turnos con los datos ingresados
            turno.solicitarTurno(this.medicosSelect.value, this.horariosSelect.value)
        } else {
            alert('Turno no confirmado. Puedes seleccionar otro turno si lo deseas.')
        }

        domManager.borrarInputs(formDatos)
    }

    generarFormulario(paciente) {
        //Tomar datos ya registrados del paciente y los muestra
        document.getElementById("nombre").value = paciente.nombre
        document.getElementById("apellido").value = paciente.apellido
        document.getElementById("fechaNacimiento").value = paciente.fechaNacimiento
        document.getElementById("documento").value = paciente.documento
        document.getElementById("obraSocial").value = paciente.obraSocial

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


    //Formar select de médicos según la especialidad seleccionada
    generarOpcionesMedicos = (especialidadSeleccionada) => {
        const medicosOptions = datos.medicos
            .filter(medico => medico.especialidad === especialidadSeleccionada)
            .map(medico => `<option value="${medico.id}">${medico.nombre} ${medico.apellido}</option>`)
            .join('')

        return '<option value="" disabled selected>Seleccioná un médico</option>' + medicosOptions
    }

    //Formar select de horarios según el médico seleccionado
    generarOpcionesHorarios = (idMedico) => {
        if (idMedico in datos.turnosDisponibles) {
            const listaDeTurnos = datos.turnosDisponibles[idMedico]
            const horariosOptions = listaDeTurnos
                .filter(turno => turno.disponible)
                .map(turno => `<option value="${turno.id}">${utilidades.darFormatoFecha(turno.fecha)} ${turno.hora}</option>`)
                .join('')

            return ('<option value="" disabled selected>Seleccioná un horario</option>' + horariosOptions)
        } else {
            alert(`El médico seleccionado no tiene actualmente turnos disponibles`)
            return '<option value="" disabled selected>Seleccioná un horario</option>'
        }
    }

    //Verificar si todos los campos están completos
    verificarDatosCompletos() {
        const inputs = this.formDatos.querySelectorAll('input');
        let todosCompletos = true;

        inputs.forEach(input => {
            if (input.value.trim() === '') {
                todosCompletos = false;
            }
        });

        return todosCompletos
    }

    generarIdPaciente = () => {
        const ids = datos.pacientes.map(objeto => Number(objeto.id))
        const maximo = Math.max(...ids)
        return maximo + 1
    }

    registrarPaciente = () => {
        const pacienteACrear = {
            id: this.generarIdPaciente(),
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            documento: document.getElementById("documento").value,
            fechaNacimiento: document.getElementById("fechaNacimiento").value,
            obraSocial: document.getElementById("obraSocial").value,
            turnos: []

        }
        datos.pacientes.push(pacienteACrear) //Agrega el nuevo paciente al array de datos (simula API)
        //return new Paciente(pacienteACrear)
        domManager.actualizarAyuda(`Datos del paciente actualizados en localStorage`)
        alert('¡Paciente registrado con éxito!')
        configuracion.reinicio()
    }

    cancelarPaciente = () => {
        this.borrarInputs(this.formDatos)
        configuracion.reinicio()
    }

    //Agregar texto al cuadro de ayuda
    actualizarAyuda = (texto) => {
        const fechaHoraActual = utilidades.obtenerFechaYHoraActual()
        this.ayuda.innerHTML = `${fechaHoraActual} ==> ${texto}<br>${this.ayuda.innerHTML}`
    }

    mostrarElemento = (id) => {
        id.style.display = 'block'
    }

    ocultarElemento = (id) => {
        id.style.display = 'none'
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

class Paciente {
    constructor(paciente) {
        this.id = paciente.id
        this.nombre = paciente.nombre
        this.apellido = paciente.apellido
        this.fechaNacimiento = paciente.fechaNacimiento
        this.documento = paciente.documento
        this.obraSocial = paciente.obraSocial
        this.turnos = paciente.turnos || []
    }

    actualizarDatos = (nombre, apellido, fechaNacimiento, documento, obraSocial) => {
        this.nombre = nombre
        this.apellido = apellido
        this.fechaNacimiento = fechaNacimiento
        this.documento = documento
        this.obraSocial = obraSocial
    }


}

class Turnos {

    constructor() {
        this.paciente = null
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

            //Si el paciente existe voy a generar turno
            if (typeof this.paciente === 'object') {
                const pacienteNombre = `${this.paciente.nombre} ${this.paciente.apellido}`
                domManager.generarFormulario(this.paciente)
                domManager.ocultarElemento(registrarPacienteBtn)
                domManager.mostrarElemento(formTurno)
                domManager.mostrarElemento(reservarBtn)
                domManager.actualizarAyuda(`Datos del paciente ${pacienteNombre} leídos correctamente del localStorage`)
                logManager.addLog(`Inicio de turnos para el paciente ${pacienteNombre}`)

                //Si no existe voy a crear paciente
            } else {
                alert(`El paciente con documento ${documento} no existe. Aquí se abre el módulo de alta de pacientes (en la próxima entrega)`)
                domManager.habilitarInputs(formDatos)
                domManager.mostrarElemento(formDatos)
                domManager.mostrarElemento(cancelarPacienteBtn)
                domManager.mostrarElemento(registrarPacienteBtn)
                domManager.registrarPacienteBtn.disabled = true


            }
        } catch (error) {
            console.error("Error al validar paciente:", error)
        }
    }

    // Solicitar un nuevo turno
    solicitarTurno = async (idMedico, idTurno) => {
        //Agregar en el array turnos del paciente el turno solicitado
        datos.pacientes.find(p => p.id === this.paciente.id).turnos.push({ "idMedico": idMedico, "idTurno": idTurno })
        //marca como no disponible el turno solicitado en el array de turnos del médico
        datos.turnosDisponibles[idMedico].find(t => t.id == idTurno).disponible = false
        //Mostrar en cuadro de ayuda
        const pacienteNombre = `${this.paciente.nombre} ${this.paciente.apellido}`
        domManager.actualizarAyuda(`Turno para el paciente ${pacienteNombre} correctamente agendado`)

        try {
            //Guardar en localStorage los cambios
            await jsonManager.guardarEnLocalStorage('datos', JSON.stringify(datos))
            domManager.actualizarAyuda(`Datos actualizados en localStorage`)
            alert('¡Turno confirmado con éxito!')
            //Volver al inicio
            configuracion.reinicio()
        } catch (error) {
            console.error("Error al guardar datos en localStorage:", error)
        }
    }
}
//---GLOBALES E INICIO---//

let datos

const configuracion = new Configuracion()
const utilidades = new Utilidades()
const jsonManager = new JsonManager()
const logManager = new LogManager('../data/logs.txt')
const domManager = new DomManager()
const turno = new Turnos()

configuracion.inicio()