// db-manager.js - Versión 2.0 con soporte para múltiples usuarios

export const dbManager = {
    dbName: "CryptoGenDB",
    version: 2,

    /**
     * Inicializa la conexión con IndexedDB y crea las tablas si no existen.
     */
    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            // Este evento se dispara si la versión cambia o la DB es nueva
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                
                // Almacén para las credenciales de la bóveda
                if (!db.objectStoreNames.contains("vault")) {
                    db.createObjectStore("vault", { keyPath: "id" });
                }
                
                // Almacén para los usuarios registrados (Nuevo en v2)
                if (!db.objectStoreNames.contains("users")) {
                    db.createObjectStore("users", { keyPath: "username" });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Error al abrir la base de datos");
        });
    },

    // ==================== GESTIÓN DE CREDENCIALES ====================

    /**
     * Guarda o actualiza una credencial en la bóveda.
     */
    async saveCredential(entry) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("vault", "readwrite");
            const store = tx.objectStore("vault");
            const request = store.put(entry); // put inserta o actualiza
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Obtiene todas las credenciales, opcionalmente filtradas por usuario.
     */
    async getAll(currentUser = null) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("vault", "readonly");
            const store = tx.objectStore("vault");
            const request = store.getAll();

            request.onsuccess = () => {
                let results = request.result;
                // Si hay un usuario logueado, filtramos para que no vea claves ajenas
                if (currentUser) {
                    results = results.filter(item => item.userId === currentUser);
                }
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * Borra una credencial por su ID.
     */
    async deleteCredential(id) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("vault", "readwrite");
            const store = tx.objectStore("vault");
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    // ==================== GESTIÓN DE USUARIOS ====================

    /**
     * Busca un usuario por su nombre.
     */
    async getUser(username) {
        const db = await this.init();
        return new Promise((resolve) => {
            const tx = db.transaction("users", "readonly");
            const store = tx.objectStore("users");
            const request = store.get(username);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => resolve(null);
        });
    },

    /**
     * Registra un nuevo usuario en el sistema.
     */
    async saveUser(user) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const tx = db.transaction("users", "readwrite");
            const store = tx.objectStore("users");
            const request = store.add(user);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }
};