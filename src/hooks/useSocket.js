import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Crear conexión Socket.io
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Eventos de conexión
    socketRef.current.on("connect", () => {
      console.log("✅ Socket.io conectado");
      setConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("❌ Socket.io desconectado");
      setConnected(false);
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Error de conexión Socket.io:", error);
    });

    // Cleanup al desmontar
    return () => {
      if (socketRef.current) {
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
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return { connected, on, off, emit, socket: socketRef.current };
}
