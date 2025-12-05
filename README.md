# Omnia 3.0 Plan Maestro

Simulador estratégico para negocios de hostelería y retail con integración de gamificación y automatización.

## 🚀 Inicio Rápido

### Instalación

```bash
cd omnia-app
npm install
```

### Configuración

1. Crea un archivo `.env` en la raíz del proyecto:
```bash
VITE_GEMINI_API_KEY=tu_api_key_de_gemini
```

2. Obtén tu API key de Gemini:
   - Visita [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Crea una nueva API key
   - Cópiala en el archivo `.env`

### Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

### Build de Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`

## 📦 Tecnologías

- **Vite** - Build tool
- **React 19** - Framework UI
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos
- **Gemini API** - IA generativa

## 🔒 Seguridad

- ✅ API keys en variables de entorno
- ✅ TypeScript para validación de tipos
- ✅ Validación de inputs numéricos
- ⚠️ **Importante**: No commitees el archivo `.env` al repositorio

## 📝 Uso

1. **Perfil del Negocio**: Define tipo de negocio y métricas base
2. **Catálogo de Productos**: Añade tus productos clave
3. **Estrategia**: Configura gamificación y automatización
4. **Premios**: Define incentivos y probabilidades
5. **Dashboard**: Visualiza ROI y métricas proyectadas

## 🌐 Deployment

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

Configura la variable de entorno `VITE_GEMINI_API_KEY` en el dashboard de Vercel.

### Netlify

```bash
npm run build
```

Sube la carpeta `dist/` a Netlify y configura la variable de entorno.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados
