import AppRouter from "./routes/AppRouter"
import { AuthProvider } from "./context/AuthContext"
import { SocketProvider } from "./context/SocketContext"
import { SnackbarProvider } from "notistack";


export default function App(){
  return (
    <AuthProvider>
      <SocketProvider>
        <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{vertical: "top", horizontal: "right"}}
        autoHideDuration={3000}
        preventDuplicate
        >
          <AppRouter />
        </SnackbarProvider>
      </SocketProvider>
    </AuthProvider>

  );
}