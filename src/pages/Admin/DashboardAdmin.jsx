import { useEffect, useState, useContext } from "react";
import { Box, Typography, Grid, Paper, CircularProgress } from "@mui/material";
import { AdminService } from "../../features/admin/services/admin.service";
import { SocketContext } from "../../context/SocketContext";

export default function DashboardAdmin() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    houses: 0,
    appliances: 0,
    users: 0,
    consumption: "0.00",
  });

  const { connected, on, off } = useContext(SocketContext);

  useEffect(() => {
    async function loadStats() {
      try {
        const [houses, appliances, users, consumption] = await Promise.all([
          AdminService.getHousesCount(),
          AdminService.getAppliancesCount(),
          AdminService.getUsersCount(),
          AdminService.getTotalConsumption(),
        ]);

        setStats({
          houses,
          appliances,
          users,
          consumption,
        });
      } catch (error) {
        console.error("Error cargando estadísticas del dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  // Socket.io: actualizar consumo total en tiempo real
  useEffect(() => {
    if (!connected) return;

    const handleNewReading = async (data) => {
      console.log("📊 [Admin Dashboard] Nueva lectura recibida:", data);

      // Recargar el consumo total del sistema
      try {
        const consumption = await AdminService.getTotalConsumption();
        setStats((prev) => ({
          ...prev,
          consumption,
        }));
      } catch (error) {
        console.error("Error actualizando consumo total:", error);
      }
    };

    // Suscribirse al evento
    on("new_reading", handleNewReading);

    // Cleanup
    return () => {
      off("new_reading", handleNewReading);
    };
  }, [connected, on, off]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        color: "#fff",
        p: 2,
      }}
    >
      {/* Bloque de bienvenida */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
          maxWidth: "900px",
          mx: "auto",
          textAlign: "center"
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1}>
          Bienvenido, Administrador ⚡
        </Typography>

        <Typography variant="body1" color="#ddd">
          Aquí puedes gestionar las casas registradas, los electrodomésticos base, 
          los usuarios y revisar las estadísticas globales del sistema.
        </Typography>
      </Paper>

      {/* GRID de tarjetas */}
      <Grid
        container
        spacing={3}
        sx={{ maxWidth: "1100px", mx: "auto" }}
      >
        {/* Tarjeta 1 */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              background: "rgba(255,255,255,0.06)",
              borderLeft: "4px solid #FFD54F",
            }}
          >
            <Typography variant="h6" color="#FFD54F">
              Casas registradas
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {stats.houses}
            </Typography>
          </Paper>
        </Grid>

        {/* Tarjeta 2 */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              background: "rgba(255,255,255,0.06)",
              borderLeft: "4px solid #2196F3",
            }}
          >
            <Typography variant="h6" color="#2196F3">
              Electrodomésticos base
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {stats.appliances}
            </Typography>
          </Paper>
        </Grid>

        {/* Tarjeta 3 */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              background: "rgba(255,255,255,0.06)",
              borderLeft: "4px solid #6A1B9A",
            }}
          >
            <Typography variant="h6" color="#6A1B9A">
              Usuarios activos
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {stats.users}
            </Typography>
          </Paper>
        </Grid>

        {/* Tarjeta 4 */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              background: "rgba(255,255,255,0.06)",
              borderLeft: "4px solid #00E676",
            }}
          >
            <Typography variant="h6" color="#00E676">
              Consumo total (kWh)
            </Typography>
            <Typography variant="h4" fontWeight={700}>
              {stats.consumption}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
