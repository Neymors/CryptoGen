import { dbManager } from "../database/db-manager.js";

export const authService = {
    async login(username, password) {
        const user = await dbManager.getUser(username);
        if (user && user.password === password) {
            sessionStorage.setItem("is_auth", "true");
            sessionStorage.setItem("current_user", username);
            return true;
        }
        return false;
    },

    async register(username, password) {
        try {
            const existingUser = await dbManager.getUser(username);
            if (existingUser) return { success: false, message: "El usuario ya existe" };
            await dbManager.saveUser({ username, password });
            return { success: true };
        } catch (error) {
            return { success: false, message: "Error al registrar usuario" };
        }
    },

    logout() {
        sessionStorage.clear();
        window.location.reload();
    }
};