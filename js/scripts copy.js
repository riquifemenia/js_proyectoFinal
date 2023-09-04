class DOMManager {
    constructor() {
        this.tarjeta = document.getElementById("turnosCard");
        document.addEventListener("DOMContentLoaded", () => {
            const ingresarBtn = document.getElementById("ingresarBtn");
            ingresarBtn.addEventListener("click", () => {
                this.mainTurnos();
            });
        });
    }

    async mainTurnos() {
        try {
            await this.inicializar();
            await this.menu();
        } catch (error) {
            console.error(error);
        }
    }

    async inicializar() {
        try {
            datos = await this.obtenerDatos();
            await this.guardarEnLocalStorage('datos', JSON.stringify(datos));
            console.log('Guardado en localStorage');
            console.log(JSON.parse(localStorage.getItem('datos')));
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    }

    async obtenerDatos() {
        try {
            return await this.leerArchivoJSON('../data/datos.json');
        } catch (error) {
            console.error(error);
        }
    }

    async leerArchivoJSON(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Error al cargar el archivo');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async guardarEnLocalStorage(clave, valor) {
        try {
            localStorage.setItem(clave, valor);
        } catch (error) {
            console.error(error);
        }
    }

    async menu() {
        const pacientesExistentes = datos.pacientes.map(paciente => paciente.documento).join(', ');

        this.tarjeta.innerHTML = `<form class="my-5">
            <div class="form-group my-5 px-5">
                <input type="text" class="form-control" id="numeroDocumento"
                placeholder="Número de documento">
            </div>
            <button type="button" class="btn boton--ir" id="ingresarBtn">Ingresar</button>
        </form>
        <div class="fuente--chica">**nota para pruebas**: ya están registrados: ${pacientesExistentes}</div>`;
    }
}

//---GLOBALES---//















//--GLOBALES--//

let datos //usado para para recibir datos de un archuvo JSON, simulando una API
let tarjeta //usado para crear la interfaz de turnos en el DOM
let domManager = new DOMManager();

//---CLASES---//

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

    actualizar(nombre, apellido, fechaNacimiento, documento, obraSocial) {
        this.nombre = nombre
        this.apellido = apellido
        this.fechaNacimiento = fechaNacimiento
        this.documento = documento
        this.obraSocial = obraSocial
    }

    asignarTurno(idMedico, turno) {
        const fecha = turno.fecha
        const hora = turno.hora
        this.turnos.push({ idMedico, fecha, hora }) //asigna turno al array de turnos del paciente
        datos.turnosDisponibles[idMedico].find(t => t.id === turno.id).disponible = false //marca como no disponible el turno seleccionado

        console.log(datos.pacientes)
        console.log(datos.turnosDisponibles)
    }

}


//---FUNCIONES LECTURA ARCHIVO JSON simunlando API y localStorage-//

const leerArchivoJSON = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al cargar el archivo');
        }
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const obtenerDatos = async () => {
    try {
        return await leerArchivoJSON('../data/datos.json')
    } catch (error) {
        console.error(error)
    }
};

const guardarEnLocalStorage = async (clave, valor) => {
    try {
        localStorage.setItem(clave, valor)
    } catch (error) {
        console.error(error)
    }
}

const borrarDeLocalStorage = async (clave) => {
    try {
        localStorage.removeItem(clave)
    } catch (error) {
        console.error(error)
    }
}

//---FUNCIONES GENERALES---//

const inicializar = async () => {

    try {
        datos = await obtenerDatos();
        await guardarEnLocalStorage('datos', JSON.stringify(datos));
        console.log('Guardado en localStorage');

        console.log(JSON.parse(localStorage.getItem('datos')))

    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

const dom = async () => {

    try {
        tarjeta = document.getElementById("turnosCard")
        document.addEventListener("DOMContentLoaded", () => {
            const ingresarBtn = document.getElementById("ingresarBtn");
            //const numeroDocumentoInput = document.getElementById("numeroDocumento");

            ingresarBtn.addEventListener("click", () => {
                mainTurnos();
            });
        });

    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

const generarIdPaciente = () => {
    const ids = datos.pacientes.map(objeto => Number(objeto.id))
    const maximo = Math.max(...ids)
    return maximo + 1
}

const validarPaciente = () => {
    const pacientesExistentes = datos.pacientes.map(paciente => paciente.documento).join(', ')
    let documento = prompt(`Ingresa tu número de documento\n(**nota para pruebas**: ya están registrados: ${pacientesExistentes})`);
    documento = documento.toUpperCase()
    const pacienteSeleccionado = datos.pacientes.find(paciente => paciente.documento === documento)
    return pacienteSeleccionado ? new Paciente(pacienteSeleccionado) : documento
}

const registrarPaciente = () => {
    const paciente = validarPaciente()

    if (typeof paciente === 'object') {
        alert(`Bienvenido ${paciente.nombre}`)
        solicitarTurno(paciente);
    } else {
        const pacienteACrear = {
            id: generarIdPaciente(),
            nombre: prompt("Ingresá tu nombre:"),
            apellido: prompt("Ingresá tu apellido:"),
            documento: paciente,
            fechaNacimiento: prompt("Ingresá tu fecha de nacimiento:"),
            obraSocial: prompt("Ingresá tu obra social:")
        }
        datos.pacientes.push(pacienteACrear) //Agrega el nuevo paciente al array de datos (simula API)
        return new Paciente(pacienteACrear)
    }
}

const solicitarTurno = (paciente) => {
    const listaMedicos = datos.medicos.map(medico => `${medico.id}: ${medico.nombre} ${medico.apellido}`).join('\n');
    let idMedico;
    let medicoSeleccionado;

    do {
        idMedico = Number(prompt(`Selecciona un médico:\n${listaMedicos}`));
        medicoSeleccionado = datos.medicos.find(medico => medico.id === idMedico);
        if (!medicoSeleccionado) {
            alert('El número de médico ingresado no es válido');
        }
    } while (!medicoSeleccionado);

    const listaTurnos = datos.turnosDisponibles[idMedico]
        .filter(turno => turno.disponible === true)
        .map(turno => `${turno.id}: Fecha: ${turno.fecha}, Hora: ${turno.hora}`)
        .join('\n');

    let idTurno;
    let turnoSeleccionado;
    do {
        idTurno = Number(prompt(`Selecciona un turno para el médico ${medicoSeleccionado.nombre} ${medicoSeleccionado.apellido}:\n${listaTurnos}`));
        turnoSeleccionado = datos.turnosDisponibles[idMedico].find(turno => turno.id === idTurno);
        if (!turnoSeleccionado) {
            alert('El número de turno ingresado no es válido');
        }
    } while (!idTurno || !turnoSeleccionado)

    const confirmacion = confirm(`Has seleccionado el turno:\nMédico: ${medicoSeleccionado.nombre} ${medicoSeleccionado.apellido}\nFecha: ${turnoSeleccionado.fecha}\nHora: ${turnoSeleccionado.hora}\n\n¿Confirmar el turno?`);

    if (confirmacion) {

        paciente.asignarTurno(idMedico, turnoSeleccionado)
        alert('¡Turno confirmado con éxito!')

    } else {
        alert('Turno no confirmado. Puedes seleccionar otro turno si lo deseas.');
    }
}


const menu = async () => {


    const pacientesExistentes = datos.pacientes.map(paciente => paciente.documento).join(', ')



    tarjeta.innerHTML = `<form class="my-5">
                                <div class="form-group my-5 px-5">
                                    <input type="text" class="form-control" id="numeroDocumento"
                                    placeholder="Número de documento">
                                 </div>
                                <button type="button" class="btn boton--ir" id="ingresarBtn">Ingresar</button>
                            </form>
                            <div class="fuente--chica">**nota para pruebas**: ya están registrados: ${pacientesExistentes}</div>`
}

const mainTurnos = async () => {
    try {
        await inicializar()
        await dom()
        await menu()
    } catch (error) {
        console.error(error);
    }
};

//--- Inicio---//

mainTurnos()


    // let opcion
    // let paciente

    // do {
    //     opcion = prompt("SISTEMA DE TURNOS. Seleccioná una opción:\n\n0. Borrar localStorage y cargar datos desde JSON\n------------\n1. Registro de pacientes\n2. Solicitar un turno\n3. Consultar o cancelar un turno\n9. Salir")
    // } while (opcion !== "0" && opcion !== "1" && opcion !== "2" && opcion !== "3" && opcion !== "9")

    // switch (opcion) {
    //     case "0":
    //         // Leer JSON
    //         await borrarDeLocalStorage('datos')
    //         //await guardarEnLocalStorage(datos)

    //         console.log(JSON.parse(localStorage.getItem('datos')))

    //         menu()
    //         break
    //     case "1":
    //         // Registro de pacientes
    //         paciente = registrarPaciente()
    //         alert(`Bienvenido ${paciente.nombre}`)
    //         solicitarTurno(paciente)

    //         break
    //     case "2":
    //         // Solicitar un turno
    //         paciente = validarPaciente()
    //         if (typeof paciente === 'object') {
    //             alert(`Bienvenido ${paciente.nombre}`)
    //             solicitarTurno(paciente)
    //         } else {
    //             alert(`No estás registrado.\nPara continuar debes darte de alta en el sistema`)
    //             paciente = registrarPaciente()
    //             solicitarTurno(paciente)
    //         }

    //         break
    //     case "3":
    //         // Consultar turno
    //         alert(`¡Próximamente! :)`)
    //         menu()
    //         break
    //     case "9":
    //         // Salir
    //         alert(`Hasta luego`)
    //         break
    // }
