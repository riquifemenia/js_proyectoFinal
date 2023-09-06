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

export default Paciente 