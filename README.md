# ⚡ LuzFinia - Sistema de Gestión de Consumo Eléctrico

Frontend desarrollado con React + Vite para el sistema LuzFinia, una plataforma de gestión y monitoreo de consumo eléctrico en tiempo real.

![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite)
![Material-UI](https://img.shields.io/badge/Material--UI-5.x-007FFF?logo=mui)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?logo=socket.io)

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roles y Funcionalidades](#-roles-y-funcionalidades)
- [Socket.io en Tiempo Real](#-socketio-en-tiempo-real)
- [Scripts Disponibles](#-scripts-disponibles)
- [Despliegue](#-despliegue)

---

## ✨ Características

- 🔐 **Autenticación JWT** - Sistema de login y registro con persistencia de sesión
- 👥 **Sistema de Roles** - Administradores y Clientes con diferentes permisos
- 🏠 **Gestión de Casas** - Compra y administración de propiedades virtuales
- ⚡ **Electrodomésticos** - Control de encendido/apagado de dispositivos
- 📊 **Estadísticas en Tiempo Real** - Monitoreo de consumo eléctrico con Socket.io
- 📈 **Gráficas Interactivas** - Visualización de perfiles de consumo con Chart.js
- 🔔 **Alertas de Picos** - Notificaciones cuando hay consumos anormales
- 🎨 **UI Moderna** - Interfaz atractiva con Material-UI y gradientes personalizados
- 📱 **Responsive** - Adaptable a dispositivos móviles y tablets

---

## 🛠️ Tecnologías

### Core
- **React 18** - Biblioteca de UI
- **Vite 6** - Build tool y dev server ultra rápido
- **React Router 7** - Navegación y rutas

### UI/UX
- **Material-UI (MUI) 5** - Componentes de interfaz
- **Chart.js 4** - Gráficas y visualizaciones
- **Notistack** - Sistema de notificaciones tipo toast

### Comunicación
- **Axios** - Cliente HTTP para APIs REST
- **Socket.io Client** - Comunicación en tiempo real con WebSockets

### Estado y Contexto
- **React Context API** - Gestión de estado global (Auth, Socket)

---

## 📦 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Backend de LuzFinia** corriendo (ver repositorio backend)

---

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd luzfinia-frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Crear archivo `.env`**
   ```bash
   cp .env.example .env
   ```

---

## ⚙️ Configuración

Edita el archivo `.env` con la URL de tu backend:

```env
# URL del backend API (sin /api al final para Socket.io)
VITE_API_URL=http://localhost:4000/api
```

**Importante:**
- Para desarrollo local: `http://localhost:4000/api`
- Para producción en Render: `https://tu-backend.onrender.com/api`

El sistema automáticamente eliminará el `/api` para las conexiones Socket.io.

---

## ▶️ Ejecución

### Modo Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: `http://localhost:5173`

### Build de Producción
```bash
npm run build
```

### Preview del Build
```bash
npm run preview
```

---

## 📁 Estructura del Proyecto

```
luzfinia-frontend/
├── src/
│   ├── api/                    # Configuración de Axios
│   │   └── api.js              # Cliente HTTP con interceptores
│   │
│   ├── components/             # Componentes reutilizables
│   │   └── ProtectedRoute.jsx  # HOC para proteger rutas
│   │
│   ├── context/                # Contextos globales
│   │   ├── AuthContext.jsx     # Autenticación y usuario
│   │   └── SocketContext.jsx   # Socket.io en tiempo real
│   │
│   ├── features/               # Módulos por funcionalidad
│   │   ├── admin/
│   │   │   └── services/       # Servicios del admin
│   │   ├── appliances/
│   │   │   ├── pages/          # Páginas de electrodomésticos
│   │   │   └── services/       # API de electrodomésticos
│   │   ├── houses/
│   │   │   └── services/       # API de casas
│   │   └── stats/
│   │       ├── pages/          # Páginas de estadísticas
│   │       └── services/       # API de estadísticas
│   │
│   ├── layouts/                # Layouts de aplicación
│   │   └── AdminLayout.jsx     # Layout del dashboard admin
│   │
│   ├── pages/                  # Páginas principales
│   │   ├── Admin/
│   │   │   ├── DashboardAdmin.jsx
│   │   │   └── UsersAdmin.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── Client/
│   │       ├── DashboardClient.jsx
│   │       └── ManageHouse.jsx
│   │
│   ├── routes/                 # Configuración de rutas
│   │   └── AppRouter.jsx       # Rutas de la aplicación
│   │
│   ├── hooks/                  # Custom hooks
│   │   └── useSocket.js        # Hook de Socket.io (legacy)
│   │
│   ├── App.jsx                 # Componente raíz
│   └── main.jsx                # Punto de entrada
│
├── public/                     # Archivos estáticos
├── .env                        # Variables de entorno
└── package.json                # Dependencias y scripts
```

---

## 👥 Roles y Funcionalidades

### 🔧 Administrador
- ✅ Ver dashboard con estadísticas globales del sistema
- ✅ Gestionar usuarios (crear, editar, eliminar)
- ✅ Gestionar casas (crear, editar, asignar)
- ✅ Gestionar modelos de electrodomésticos
- ✅ Ver estadísticas detalladas por casa
- ✅ Monitoreo en tiempo real de consumo total

### 👤 Cliente
- ✅ Comprar casas disponibles
- ✅ Ver sus casas adquiridas
- ✅ Agregar electrodomésticos a sus casas
- ✅ Encender/apagar electrodomésticos
- ✅ Ver consumo en tiempo real de sus casas
- ✅ Recibir alertas de picos de consumo

---

## 🔌 Socket.io en Tiempo Real

El sistema utiliza Socket.io para actualizaciones en tiempo real sin necesidad de recargar la página.

### Eventos del Servidor

#### 1. `new_reading` (cada 5 segundos)
Actualiza el consumo eléctrico de las casas.

```javascript
{
  houseId: "507f1f77bcf86cd799439020",
  ts: "2025-11-13T15:30:25.000Z",
  kwh: 0.25,                    // Consumo incremental
  totalKwh: 125.75,             // Consumo total acumulado
  activeAppliances: ["..."]     // Electrodomésticos encendidos
}
```

#### 2. `peak_alert`
Se dispara cuando hay un pico de consumo anormal.

```javascript
{
  houseId: "507f1f77bcf86cd799439020",
  ts: "2025-11-13T15:35:00.000Z",
  kwh: 0.8,                     // Consumo que disparó la alerta
  totalKwh: 126.55,
  avg: 0.45,                    // Promedio de últimas 10 lecturas
  message: "Pico de consumo detectado"
}
```

### Implementación en el Frontend

El SocketContext se conecta automáticamente al cargar la app:

```javascript
// src/context/SocketContext.jsx
const SOCKET_URL = getSocketURL(); // Quita /api de la URL
io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  reconnection: true
});
```

Los componentes se suscriben a eventos:

```javascript
const { connected, on, off } = useContext(SocketContext);

useEffect(() => {
  if (!connected) return;

  const handleNewReading = (data) => {
    if (data.houseId === myHouseId) {
      // Actualizar UI
    }
  };

  on("new_reading", handleNewReading);
  return () => off("new_reading", handleNewReading);
}, [connected]);
```

---

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build            # Crea build de producción
npm run preview          # Preview del build

# Linting
npm run lint             # Ejecuta ESLint
```

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio** en Vercel
2. **Configurar variables de entorno:**
   ```
   VITE_API_URL=https://tu-backend.onrender.com/api
   ```
3. **Deploy automático** al hacer push a `main`

### Netlify

1. **Build command:** `npm run build`
2. **Publish directory:** `dist`
3. **Variables de entorno:**
   ```
   VITE_API_URL=https://tu-backend.onrender.com/api
   ```

### Render (Static Site)

1. **Build command:** `npm run build`
2. **Publish directory:** `dist`
3. **Variables de entorno:** Configurar `VITE_API_URL`

---

## 🔧 Configuración Adicional

### CORS en el Backend

Asegúrate de que tu backend permita el origen de tu frontend:

```javascript
// Backend - corsConfig.js
const allowedOrigins = [
  "http://localhost:5173",           // Desarrollo
  "https://tu-app.vercel.app",       // Producción
];
```

### Socket.io en el Backend

El backend debe emitir eventos con `io.emit()` (broadcast):

```javascript
io.emit("new_reading", {
  houseId: house._id.toString(),
  kwh: reading.kwh,
  totalKwh: reading.totalKwh,
  // ...
});
```

---

## 🐛 Solución de Problemas

### Socket.io no se conecta

**Error:** `WebSocket connection failed` o `Invalid namespace`

**Solución:**
1. Verifica que `VITE_API_URL` NO incluya `/socket.io`
2. El sistema quita automáticamente `/api` para Socket.io
3. Verifica CORS en el backend
4. Revisa que el backend esté emitiendo eventos

### No se actualizan los datos en tiempo real

**Solución:**
1. Abre la consola del navegador (F12)
2. Busca: `✅ Socket.io conectado con ID: ...`
3. Verifica que lleguen eventos: `📊 Nueva lectura recibida: {...}`
4. Si no llegan eventos, el problema está en el backend

### La sesión no persiste al recargar

**Solución:**
- El `AuthContext` guarda el usuario en `localStorage`
- Verifica que el token JWT no haya expirado
- Revisa la consola por errores 401 (no autorizado)

---

## 📝 Licencia

Este proyecto es privado y confidencial.

---

## 👨‍💻 Autor

Desarrollado para el sistema de gestión de consumo eléctrico LuzFinia.

---

## 📚 Documentación Adicional

- [Documentación de Socket.io](./SOCKET_VERIFICATION.md)
- [Backend Repository](../luzfinia-backend)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Documentation](https://mui.com/)
