// Lectura y escritura en JSON y localStore

class JsonManager {
    constructor() {
    }

    obtenerDatos = async () => {
        try {
            // Llamar al método para leer el archivo JSON
            return await this.leerArchivoJSON('../data/datos.json')
        } catch (error) {
            throw error
        }
    }

    // Leer un archivo JSON desde una URL
    leerArchivoJSON = async (url) => {
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON en ${url}.`)
            }
            return await response.json()
        } catch (error) {
            throw error
        }
    }

    // Leer un valor desde el localStorage
    leerDesdeLocalStorage = async (clave) => {
        const valor = localStorage.getItem(clave)
        if (valor !== null) {
            return valor
        } else {
            throw new Error(`El valor para la clave '${clave}' no existe en localStorage: ${error.message}.`)
        }
    }

    // Guardar un valor en el localStorage
    guardarEnLocalStorage = async (clave, valor) => {
        try {
            localStorage.setItem(clave, valor)
        } catch (error) {
            throw new Error(`Error al guardar en localStorage: ${error.message}. Comunicate con el administrador del sitio.`)
        }
    }
}

export default JsonManager