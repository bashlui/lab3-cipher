import CryptoJS from 'crypto-js';

// Pepper almacenado en variable de entorno (no va a la BD)
const PEPPER = import.meta.env.VITE_APP_PEPPER || 'DefaultPepper123!';
// Llave secreta para cifrado AES (32 chars)
const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY || 'MiLlaveSecreta32Caracteres123456';

// ─── CIFRADO AES (texto reversible) ──────────────────────────────────────────

/**
 * Cifra un texto con AES usando la llave secreta.
 * @param {string} texto - Texto plano a cifrar
 * @returns {string} Texto cifrado en Base64
 */
export const cifrar = (texto) => {
  const textoCifrado = CryptoJS.AES.encrypt(texto, SECRET_KEY).toString();
  return textoCifrado;
};

/**
 * Descifra un texto cifrado con AES.
 * @param {string} textoCifrado - Texto cifrado en Base64
 * @returns {string} Texto original descifrado
 */
export const descifrar = (textoCifrado) => {
  try {
    const bytes = CryptoJS.AES.decrypt(textoCifrado, SECRET_KEY);
    const textoDescifrado = bytes.toString(CryptoJS.enc.Utf8);
    return textoDescifrado || 'Error al descifrar';
  } catch {
    return 'Error: texto cifrado inválido';
  }
};

// ─── HASH SHA-256 CON SALT + PEPPER (contraseñas en BD) ─────────────────────

/**
 * Genera un salt aleatorio de 16 bytes en hex.
 * @returns {string} Salt aleatorio
 */
export const generarSalt = () => {
  return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
};

/**
 * Hashea una contraseña usando SHA-256 con Salt y Pepper.
 * El resultado se guarda como "salt:hash" en la BD.
 * @param {string} password - Contraseña en texto plano
 * @returns {{ salt: string, hash: string, almacenado: string }}
 */
export const hashearPassword = (password) => {
  const salt = generarSalt();
  // Fórmula: SHA256(salt + password + pepper)
  const contenido = salt + password + PEPPER;
  const hash = CryptoJS.SHA256(contenido).toString(CryptoJS.enc.Hex);
  // Lo que se almacena en la BD: "salt:hash"
  const almacenado = `${salt}:${hash}`;
  return { salt, hash, almacenado };
};

/**
 * Verifica si una contraseña ingresada coincide con el hash almacenado.
 * @param {string} passwordIngresada - Contraseña en texto plano del login
 * @param {string} almacenado - Valor "salt:hash" guardado en la BD
 * @returns {boolean} true si la contraseña es correcta
 */
export const verificarPassword = (passwordIngresada, almacenado) => {
  try {
    const [salt, hashOriginal] = almacenado.split(':');
    const contenido = salt + passwordIngresada + PEPPER;
    const hashVerificacion = CryptoJS.SHA256(contenido).toString(CryptoJS.enc.Hex);
    return hashVerificacion === hashOriginal;
  } catch {
    return false;
  }
};
