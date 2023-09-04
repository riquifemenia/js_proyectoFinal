// Lectura y escritura en JSON y localStore

class JsonManager {

    obtenerDatos = async () => {
        // Llamar al método para leer el archivo JSON
        return this.leerArchivoJSON('../data/datos.json')
    }

    // Método asincrónico para leer un archivo JSON desde una URL
    leerArchivoJSON = async (url) => {
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON en ${url}`)
            }
            const data = await response.json()
            return data
        } catch (error) {
            throw new Error(`Error al leer el archivo JSON en ${url}: ${error.message}`)
        }
    }

    // Guardar un valor en el localStorage
    guardarEnLocalStorage = async (clave, valor) => {
        try {
            localStorage.setItem(clave, valor)
        } catch (error) {
            throw new Error(`Error al guardar en localStorage: ${error.message}`)
        }
    }

    // Leer un valor desde el localStorage
    leerDesdeLocalStorage = async (clave) => {
        const valor = localStorage.getItem(clave)
        if (valor !== null) {
            return valor
        } else {
            throw new Error(`El valor para la clave '${clave}' no existe en localStorage`)
        }
    }
}

export default JsonManager