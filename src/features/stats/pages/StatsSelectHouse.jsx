import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StatsService } from "../services/stats.service";

export default function StatsSelectHouse() {
  const [houses, setHouses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await StatsService.getHouses();
        console.log("Casas obtenidas:", data); // Para debug
        setHouses(data);
      } catch (err) {
        console.error("Error cargando casas:", err);
        console.error("Detalles del error:", err.response); // Para debug

        // Mensajes de error más específicos
        if (err.response?.status === 404) {
          setError("Endpoint /houses/all no encontrado. Verifica tu backend.");
        } else if (err.response?.status === 401) {
          setError("No autorizado. Verifica tu sesión de admin.");
        } else if (err.response?.status === 403) {
          setError("Acceso prohibido. Solo admins pueden ver esta página.");
        } else if (!err.response) {
          setError(`No se puede conectar al servidor: ${import.meta.env.VITE_API_URL || 'URL no configurada'}`);
        } else {
          setError(err.response?.data?.message || "Error al cargar las casas");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", p: 3, color: "#fff" }}>
        <Paper
          sx={{
            p: 3,
            background: "rgba(255,0,0,0.1)",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (!houses || houses.length === 0) {
    return (
      <Box sx={{ width: "100%", p: 3, color: "#fff" }}>
        <Typography variant="h4" mb={3} fontWeight={700}>
          Selecciona una Casa 🏠
        </Typography>
        <Paper
          sx={{
            p: 3,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            No hay casas disponibles
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 3, color: "#fff" }}>
      <Typography variant="h4" mb={3} fontWeight={700}>
        Selecciona una Casa 🏠
      </Typography>

      <Grid container spacing={3}>
        {houses.map((house) => (
          <Grid item xs={12} sm={6} md={4} key={house._id}>
            <Paper
              sx={{
                p: 3,
                background: "rgba(255,255,255,0.05)",
                borderRadius: 3,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.03)",
                  background: "rgba(255,255,255,0.1)",
                },
              }}
              onClick={() => navigate(`/admin/stats/${house._id}`)}
            >
              <Typography variant="h6" fontWeight={700}>
                {house.name}
              </Typography>
              <Typography variant="body2" color="#ccc">
                Dueño: {house.user?.name || "Sin asignar"}
              </Typography>
              {house.user && (
                <Typography variant="body2" color="#999" fontSize="0.85rem">
                  {house.user.email}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
