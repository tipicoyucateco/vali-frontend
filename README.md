# Bedrock Claude Frontend

Interfaz de chat moderna desarrollada con Vue 3, Vite y Tailwind CSS para interactuar con Claude a través de AWS Bedrock.

## Stack

- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite 4
- **Styling:** Tailwind CSS 3
- **HTTP Client:** Axios
- **Backend:** NestJS API (http://localhost:3000)

## Características

- ✅ Chat interface moderna y responsiva
- ✅ Historial de conversación en tiempo real
- ✅ Soporte para formateo de mensajes (markdown básico)
- ✅ Copiar mensajes al portapapeles
- ✅ Contador de tokens (input/output)
- ✅ Loading states y error handling
- ✅ Dark/Light theme ready
- ✅ Animaciones suaves
- ✅ UI optimizada para UX

## Requisitos

- Node.js 20+
- npm
- Backend NestJS corriendo en http://localhost:3000

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env si es necesario
```

## Ejecución

```bash
# Desarrollo (hot reload)
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview
```

El frontend estará disponible en `http://localhost:5173`

## Uso

1. Asegúrate de que el backend NestJS esté corriendo en `http://localhost:3000`
2. Inicia el frontend con `npm run dev`
3. Abre `http://localhost:5173` en tu navegador
4. Escribe tu pregunta en el campo de texto
5. Presiona Enter o clic en "Send"
6. Claude responderá a través del backend

## Funcionalidades del Chat

### Envío de Mensajes
- **Enter**: Enviar mensaje
- **Shift + Enter**: Nueva línea en el mensaje

### Controles
- **Clear**: Limpiar todo el historial del chat
- **Copy**: Copiar contenido de cualquier mensaje

### Formateo de Texto
El chat soporta formateo básico de markdown:
- \`código inline\`
- **texto en negrita**
- *texto en itálica*
- Bloques de código con syntax highlighting

## Estructura del Proyecto

```
bedrock-claude-frontend/
├── src/
│   ├── components/
│   │   ├── ChatInterface.vue    # Componente principal del chat
│   │   └── ChatMessage.vue      # Componente para renderizar mensajes
│   ├── App.vue                  # Componente raíz
│   ├── main.js                  # Entry point
│   └── style.css                # Tailwind imports
├── public/                      # Assets estáticos
├── .env                         # Variables de entorno (no commitear)
├── .env.example                 # Ejemplo de configuración
├── tailwind.config.js           # Configuración Tailwind
├── vite.config.js               # Configuración Vite
└── README.md                    # Documentación
```

## Personalización

### Colores y Estilos

Edita `tailwind.config.js` para personalizar el tema:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        // ... más colores
      }
    }
  }
}
```

### API Endpoint

Cambia la URL del backend en `.env`:

```env
VITE_API_URL=http://tu-backend.com
```

## Componentes Principales

### ChatInterface.vue
- Gestiona el estado del chat
- Maneja el envío de mensajes al backend
- Controla el scroll automático
- Muestra información de tokens

### ChatMessage.vue
- Renderiza mensajes individuales
- Soporta diferentes tipos de mensajes (user, assistant, error)
- Formateo de markdown
- Función copy-to-clipboard

## Próximas Mejoras

- [ ] Streaming de respuestas (SSE)
- [ ] Configuración de parámetros (temperature, max tokens)
- [ ] Persistencia del historial (localStorage)
- [ ] Exportar conversación (JSON, Markdown)
- [ ] Modo oscuro manual
- [ ] Soporte para imágenes
- [ ] Múltiples conversaciones (tabs)
- [ ] Búsqueda en historial

## Troubleshooting

### Error: "Network Error"

Verifica que:
1. El backend esté corriendo en `http://localhost:3000`
2. CORS esté habilitado en el backend
3. La URL en `.env` sea correcta

### Tailwind no aplica estilos

```bash
# Reinstalar dependencias
rm -rf node_modules
npm install
```

### El chat no hace scroll automático

Verifica que el contenedor tenga la clase `overflow-y-auto` y que el ref `messagesContainer` esté correctamente asignado.

## Licencia

MIT

## Autor

Luis Villanueva - The Palace Company
