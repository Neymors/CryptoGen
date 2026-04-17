// crypto-core.js - Versión mejorada con opciones avanzadas y zxcvbn

/**
 * Genera una contraseña criptográficamente segura con las opciones dadas.
 * @param {number} length - Longitud de la contraseña (mínimo 4)
 * @param {Object} options - Opciones de generación
 * @param {boolean} [options.uppercase=true] - Incluir letras mayúsculas
 * @param {boolean} [options.lowercase=true] - Incluir letras minúsculas
 * @param {boolean} [options.numbers=true] - Incluir números
 * @param {boolean} [options.symbols=true] - Incluir símbolos
 * @param {boolean} [options.excludeAmbiguous=false] - Evitar caracteres ambiguos (O,0,I,l,1, etc.)
 * @param {number} [options.minNumbers=0] - Número mínimo de dígitos (obligatorio)
 * @param {number} [options.minSymbols=0] - Número mínimo de símbolos (obligatorio)
 * @returns {string} Contraseña generada
 */
export function generatePassword(length, options = {}) {
    // Valores por defecto
    const opts = {
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
        excludeAmbiguous: false,
        minNumbers: 0,
        minSymbols: 0,
        ...options
    };

    // Validar longitud mínima
    const minLength = Math.max(opts.minNumbers + opts.minSymbols, 4);
    if (length < minLength) {
        throw new Error(`La longitud debe ser al menos ${minLength} para cumplir los requisitos mínimos.`);
    }

    // Definir conjuntos de caracteres
    let lower = "abcdefghijklmnopqrstuvwxyz";
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    // Eliminar caracteres ambiguos si se solicita
    if (opts.excludeAmbiguous) {
        lower = lower.replace(/[il]/g, '');
        upper = upper.replace(/[IO]/g, '');
        numbers = numbers.replace(/[01]/g, '');
        symbols = symbols.replace(/[|\\[\]{}()]/g, '');
    }

    let charset = "";
    if (opts.lowercase) charset += lower;
    if (opts.uppercase) charset += upper;
    if (opts.numbers) charset += numbers;
    if (opts.symbols) charset += symbols;

    if (charset.length === 0) {
        throw new Error("Debes seleccionar al menos un tipo de caracteres.");
    }

    // Generar contraseña garantizando los mínimos requeridos
    let password = "";
    const requiredChars = [];

    // Añadir números obligatorios
    if (opts.numbers && opts.minNumbers > 0) {
        for (let i = 0; i < opts.minNumbers; i++) {
            requiredChars.push(getRandomChar(numbers));
        }
    }
    // Añadir símbolos obligatorios
    if (opts.symbols && opts.minSymbols > 0) {
        for (let i = 0; i < opts.minSymbols; i++) {
            requiredChars.push(getRandomChar(symbols));
        }
    }

    // Completar el resto de la longitud con caracteres del conjunto completo
    const remainingLength = length - requiredChars.length;
    for (let i = 0; i < remainingLength; i++) {
        requiredChars.push(getRandomChar(charset));
    }

    // Mezclar los caracteres para que los obligatorios no estén siempre al inicio
    password = shuffleArray(requiredChars).join('');

    return password;
}

/**
 * Obtiene un carácter aleatorio criptográficamente seguro de un string.
 * @param {string} characters - Cadena de caracteres permitidos
 * @returns {string} Carácter aleatorio
 */
function getRandomChar(characters) {
    const randomValue = getRandomInt(0, characters.length - 1);
    return characters[randomValue];
}

/**
 * Genera un entero aleatorio en un rango [min, max] usando crypto.
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
function getRandomInt(min, max) {
    const range = max - min + 1;
    const maxValid = Math.floor(256 / range) * range - 1;
    let randomValue;
    const array = new Uint8Array(1);
    
    do {
        crypto.getRandomValues(array);
        randomValue = array[0];
    } while (randomValue > maxValid);
    
    return min + (randomValue % range);
}

/**
 * Mezcla un array usando Fisher-Yates con aleatoriedad criptográfica.
 * @param {Array} array 
 * @returns {Array} Nuevo array mezclado
 */
function shuffleArray(array) {
    const a = [...array];
    for (let i = a.length - 1; i > 0; i--) {
        const j = getRandomInt(0, i);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Evalúa la fortaleza de una contraseña usando zxcvbn (si está cargado).
 * @param {string} password 
 * @returns {Object} Resultado con score (0-4), feedback y entropía
 */
export function checkStrength(password) {
    // Si zxcvbn está disponible (cargado desde CDN), úsalo
    if (typeof zxcvbn === 'function') {
        const result = zxcvbn(password);
        return {
            score: result.score,               // 0-4
            feedback: result.feedback,
            crackTime: result.crack_times_display,
            entropy: result.entropy,
            isStrong: result.score >= 3
        };
    } else {
        // Fallback básico si no está zxcvbn
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        score = Math.min(score, 4);
        return {
            score,
            isStrong: score >= 3,
            feedback: { warning: score < 3 ? "Contraseña débil" : "", suggestions: [] }
        };
    }
}

/**
 * Genera múltiples contraseñas de una sola vez (útil para sugerencias).
 * @param {number} count - Número de contraseñas
 * @param {number} length - Longitud de cada una
 * @param {Object} options - Mismas opciones que generatePassword
 * @returns {string[]} Array de contraseñas
 */
export function generateMultiplePasswords(count, length, options = {}) {
    const passwords = [];
    for (let i = 0; i < count; i++) {
        passwords.push(generatePassword(length, options));
    }
    return passwords;
}

/**
 * Calcula la entropía aproximada de una contraseña (bits).
 * @param {string} password 
 * @returns {number} Entropía en bits
 */
export function calculateEntropy(password) {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32; // aprox símbolos comunes
    
    if (charsetSize === 0) return 0;
    return Math.log2(Math.pow(charsetSize, password.length));
}