import AppRouter from "./routes/AppRouter"
import { AuthProvider } from "./context/AuthContext"
import { SnackbarProvider } from "notistack";
import { CssBaseline } from "@mui/material";


export default function App(){
  return (
    <AuthProvider>
      <SnackbarProvider 
      maxSnack={3}
      anchorOrigin={{vertical: "top", horizontal: "right"}}
      autoHideDuration={3000}
      preventDuplicate
      >
      <CssBaseline />
        <AppRouter />
      </SnackbarProvider>
    </AuthProvider>
    
  );
}