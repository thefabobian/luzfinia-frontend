import AppRouter from "./routes/AppRouter"
import { AuthProvider } from "./context/AuthContext"
import { SnackbarProvider } from "notistack";


export default function App(){
  return (
    <AuthProvider>
      <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{vertical: "top", horizontal: "right"}}
      autoHideDuration={3000}
      preventDuplicate
      >
        <AppRouter />
      </SnackbarProvider>
    </AuthProvider>
    
  );
}