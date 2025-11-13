import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

// Obtener la URL base del backend sin el sufijo /api
const getSocketURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  // Si la URL termina en /api, quitarlo para Socket.io
  return apiUrl.replace(/\/api\/?$/, "");
};

const SOCKET_URL = getSocketURL();

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Crear conexión Socket.io
    console.log("🔌 Conectando a Socket.io en:", SOCKET_URL);

    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Eventos de conexión
    socketRef.current.on("connect", () => {
      console.log("✅ Socket.io conectado con ID:", socketRef.current.id);
      setConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket.io desconectado");
      setConnected(false);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("⚠️ Error de conexión Socket.io:", error.message);
    });

    socketRef.current.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket.io reconectado después de", attemptNumber, "intentos");
    });

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
        console.log("🔌 Desconectando Socket.io");
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Suscribirse a un evento
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  // Desuscribirse de un evento
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  // Emitir un evento
  const emit = (event, data) => {
    if (socketRef.current && connected) {
      socketRef.current.emit(event, data);
    }
  };

  return (
    <SocketContext.Provider value={{ connected, on, off, emit, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
}
