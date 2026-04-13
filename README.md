# 🛡️ CryptoGen - Generador de Contraseñas Seguro

CryptoGen es una aplicación web de alta seguridad diseñada con una estética Glassmorphism moderna. A diferencia de los generadores convencionales, CryptoGen utiliza la **Web Crypto API** nativa para garantizar que cada contraseña sea generada con entropía real y sea criptográficamente segura.

## ✨ Características Principales

- 🔒 **Seguridad de Grado Militar:** Generación de claves mediante `window.crypto.getRandomValues()`, evitando la predictibilidad de `Math.random()`.
- 📊 **Análisis de Fuerza en Tiempo Real:** Integración con la librería `zxcvbn` para una evaluación precisa de la robustez de la contraseña.
- 🌑 **Interfaz Glassmorphism:** Diseño visualmente atractivo con efectos de desenfoque, transparencias y acentos vibrantes.
- 🗄️ **Bóveda Local:** Guarda y gestiona tus contraseñas directamente en el navegador de forma privada mediante LocalStorage.
- 📤 **Exportación de Datos:** Permite descargar toda tu bóveda en un archivo portable `.json`.
- 📱 **Mobile First:** Optimizado para un copiado fluido en dispositivos Android e iOS.
- 🧩 **Arquitectura Modular:** Código organizado en módulos (Generación, Fuerza, Almacenamiento e Interfaz).

## 🚀 Instalación y Uso

Al ser una aplicación estática, no requiere servidores ni instalaciones complejas:

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Neymors/CryptoGen
   
Abre el archivo index.html en cualquier navegador moderno.

Configura la longitud, elige tus parámetros y genera una clave segura.

🛠️ Estructura del Proyecto
La estructura está diseñada para ser limpia y fácil de mantener:

index.html: Estructura base, controles de usuario y modales de interfaz.

css/style.css: Estilos visuales, variables de color y animaciones.

js/main.js: Controlador principal que gestiona los eventos del DOM y conecta los módulos.

js/crypto-core.js: El motor criptográfico de generación de caracteres.

vendor/zxcvbn.js: Librería externa para el cálculo de entropía de contraseñas.

🔐 Privacidad y Seguridad
Ejecución Local: Ninguna contraseña se envía a servidores externos. Todo el procesamiento ocurre en el cliente.

Sin Rastreo: No se utilizan cookies ni scripts de seguimiento.

Formato Abierto: Los datos se exportan en JSON estándar para que siempre seas dueño de tu información.

