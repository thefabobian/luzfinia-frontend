import { useForm } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { Login as LoginIcon, Bolt } from "@mui/icons-material";
import { useSnackbar } from "notistack";

export default function Login() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      enqueueSnackbar("Inicio de sesión exitoso.", { variant: "success" });
      const user = JSON.parse(localStorage.getItem("user"));
      navigate(user.role === "admin" ? "/admin" : "/client");
    } catch (error) {
      enqueueSnackbar("Error al iniciar sesión. Verifica tus credenciales.", {
        variant: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #6A1B9A 0%, #2196F3 50%, #FFD54F 100%)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 5,
            width: 360,
            mx: "auto",
            backgroundColor: "rgba(20, 20, 30, 0.9)",
            backdropFilter: "blur(15px)",
            borderRadius: 4,
            color: "#fff",
            boxShadow: "0 0 30px rgba(0,0,0,0.4)",
            textAlign: "center",
          }}
        >
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <Bolt sx={{ fontSize: 48, color: "#FFD54F", mr: 1 }} />
            <Typography variant="h5" fontWeight={700} color="#FFD54F">
              LuzFinia
            </Typography>
          </Box>

          <Typography variant="body2" color="#bbb" mb={2}>
            Sistema de monitoreo energético
          </Typography>

          <Divider
            sx={{
              mb: 3,
              borderColor: "rgba(255,255,255,0.2)",
              width: "80%",
              mx: "auto",
            }}
          />

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Correo electrónico"
              variant="filled"
              fullWidth
              {...register("email")}
              InputProps={{
                style: { color: "#fff", background: "rgba(255,255,255,0.08)" },
              }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{ mb: 2, borderRadius: 1 }}
            />

            <TextField
              label="Contraseña"
              type="password"
              variant="filled"
              fullWidth
              {...register("password")}
              InputProps={{
                style: { color: "#fff", background: "rgba(255,255,255,0.08)" },
              }}
              InputLabelProps={{ style: { color: "#ccc" } }}
              sx={{ mb: 3, borderRadius: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              disabled={isSubmitting}
              sx={{
                background:
                  "linear-gradient(90deg, #FFD54F 0%, #2196F3 50%, #6A1B9A 100%)",
                color: "#fff",
                fontWeight: "bold",
                py: 1.2,
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 0 12px rgba(255,213,79,0.6)",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <Typography textAlign="center" mt={3} color="#ccc">
            ¿No tienes cuenta?{" "}
            <Link
              to="/register"
              style={{
                color: "#FFD54F",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Registrarse
            </Link>
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  );
}