import { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  TextField,
  Grid,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { StatsService } from "../services/stats.service";
import { useParams } from "react-router-dom";
import { SocketContext } from "../../../context/SocketContext";
import { useSnackbar } from "notistack";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function StatsHouse() {
  const { houseId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [consumption, setConsumption] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  const [period, setPeriod] = useState("month");

  const { connected, on, off } = useContext(SocketContext);
  const { enqueueSnackbar } = useSnackbar();

  const loadData = async () => {
    setLoading(true);
    setError(null);

    // Cargar datos de forma independiente para evitar que un error bloquee todo
    try {
      const [c, p, s] = await Promise.allSettled([
        StatsService.getConsumption(houseId),
        StatsService.getProfile(houseId),
        StatsService.getStats(houseId, period),
      ]);

      // Procesar cada resultado independientemente
      if (c.status === "fulfilled") {
        setConsumption(c.value);
      } else {
        console.error("Error cargando consumo:", c.reason);
      }

      if (p.status === "fulfilled") {
        setProfile(p.value);
      } else {
        console.error("Error cargando perfil:", p.reason);
      }

      if (s.status === "fulfilled") {
        setStats(s.value);
      } else {
        console.error("Error cargando stats:", s.reason);
      }

      // Si todos fallaron, mostrar error
      if (c.status === "rejected" && p.status === "rejected" && s.status === "rejected") {
        setError("No se pudieron cargar las estadísticas. Verifica tu conexión.");
      }
    } catch (err) {
      console.error("Error general:", err);
      setError("Error al cargar las estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period, houseId]);

  // Socket.io: escuchar eventos en tiempo real
  useEffect(() => {
    if (!connected) return;

    // Manejar nueva lectura (cada 5 segundos)
    const handleNewReading = (data) => {
      console.log("📊 Nueva lectura recibida:", data);

      // Solo actualizar si es de esta casa (usar houseId del evento)
      if (data.houseId === houseId) {
        // Actualizar consumo total en tiempo real
        setConsumption((prev) => ({
          ...prev,
          totalConsumption: data.totalKwh, // Usar totalKwh del evento
        }));
      }
    };

    // Manejar alerta de pico de consumo
    const handlePeakAlert = (data) => {
      console.log("⚡ Alerta de pico:", data);

      // Solo mostrar si es de esta casa (usar houseId del evento)
      if (data.houseId === houseId) {
        enqueueSnackbar(
          `⚡ Pico de consumo detectado: ${data.totalKwh.toFixed(2)} kWh`,
          { variant: "warning", autoHideDuration: 5000 }
        );
      }
    };

    // Suscribirse a eventos
    on("new_reading", handleNewReading);
    on("peak_alert", handlePeakAlert);

    // Cleanup: desuscribirse al desmontar
    return () => {
      off("new_reading", handleNewReading);
      off("peak_alert", handlePeakAlert);
    };
  }, [connected, houseId, on, off, enqueueSnackbar]);

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

  // Validación más flexible - mostrar lo que esté disponible
  if (!consumption && !profile && !stats) {
    return (
      <Box sx={{ width: "100%", p: 3, color: "#fff" }}>
        <Paper
          sx={{
            p: 3,
            background: "rgba(255,255,255,0.05)",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            No hay datos disponibles para esta casa
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", p: 3, color: "#fff" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Estadísticas de la Casa 🏠
      </Typography>

      {/* PERIODO */}
      <TextField
        select
        label="Periodo"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        sx={{ mb: 3, width: 200 }}
      >
        <MenuItem value="day">Día</MenuItem>
        <MenuItem value="week">Semana</MenuItem>
        <MenuItem value="month">Mes</MenuItem>
        <MenuItem value="year">Año</MenuItem>
      </TextField>

      {/* KPI PRINCIPAL */}
      {consumption && (
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(10px)",
            textAlign: "center",
          }}
        >
          <Typography variant="h6">Consumo total actual</Typography>
          <Typography variant="h3" fontWeight={700} color="#FFD54F">
            {consumption?.totalConsumption?.toFixed(2) || "0.00"} kWh
          </Typography>
        </Paper>
      )}

      {/* PERFIL HORARIO */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(100,181,246,0.2)",
        }}
      >
        <Typography variant="h6" mb={2} color="#E3F2FD">
          Perfil de Consumo (últimas 24 horas)
        </Typography>

        {profile && profile.sums ? (
          <>
            <Typography variant="h5" textAlign="center" mb={3} color="#81C784" fontWeight={600}>
              Perfil: {profile.profile === "matutino" ? "Matutino 🌅" : profile.profile === "nocturno" ? "Nocturno 🌙" : "Equilibrado ⚖️"}
            </Typography>
            <Line
              data={{
                labels: ["Mañana (6-12)", "Tarde (12-18)", "Noche (18-6)"],
                datasets: [
                  {
                    label: "kWh",
                    data: [profile.sums.morning, profile.sums.afternoon, profile.sums.night],
                    borderColor: "#64B5F6",
                    backgroundColor: "rgba(100,181,246,0.5)",
                    fill: true,
                    borderWidth: 3,
                    tension: 0.4,
                    pointBackgroundColor: "#64B5F6",
                    pointBorderColor: "#fff",
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: {
                      color: "#fff",
                      font: {
                        size: 14,
                        weight: '600'
                      },
                      padding: 15,
                    },
                  },
                  tooltip: {
                    backgroundColor: "rgba(0,0,0,0.8)",
                    titleColor: "#fff",
                    bodyColor: "#64B5F6",
                    borderColor: "#64B5F6",
                    borderWidth: 1,
                    padding: 12,
                    bodyFont: {
                      size: 14,
                    },
                  },
                },
                scales: {
                  y: {
                    ticks: {
                      color: "#E3F2FD",
                      font: {
                        size: 13,
                        weight: '500'
                      }
                    },
                    grid: {
                      color: "rgba(255,255,255,0.2)",
                      lineWidth: 1,
                    },
                  },
                  x: {
                    ticks: {
                      color: "#E3F2FD",
                      font: {
                        size: 13,
                        weight: '500'
                      }
                    },
                    grid: {
                      color: "rgba(255,255,255,0.1)",
                      lineWidth: 1,
                    },
                  },
                },
              }}
            />
          </>
        ) : (
          <Typography variant="body1" color="#ccc" textAlign="center">
            {profile?.reason || "No hay datos de perfil horario disponibles"}
          </Typography>
        )}
      </Paper>

      {/* CONSUMO POR PERIODO */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(129,199,132,0.2)",
        }}
      >
        <Typography variant="h6" mb={2} color="#E3F2FD">
          Estadísticas del último {period === "day" ? "día" : period === "week" ? "semana" : period === "month" ? "mes" : "año"}
        </Typography>

        {stats && stats.totalKwh ? (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, background: "rgba(0,0,0,0.6)", textAlign: "center", border: "1px solid rgba(100,181,246,0.3)" }}>
                  <Typography variant="body2" color="#B0BEC5" mb={1}>Total kWh</Typography>
                  <Typography variant="h4" fontWeight={700} color="#64B5F6">
                    {stats.totalKwh}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, background: "rgba(0,0,0,0.6)", textAlign: "center", border: "1px solid rgba(129,199,132,0.3)" }}>
                  <Typography variant="body2" color="#B0BEC5" mb={1}>Costo Aproximado</Typography>
                  <Typography variant="h4" fontWeight={700} color="#81C784">
                    {stats.costoAproximado}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper sx={{ p: 2, background: "rgba(0,0,0,0.6)", textAlign: "center", border: "1px solid rgba(186,104,200,0.3)" }}>
                  <Typography variant="body2" color="#B0BEC5" mb={1}>Lecturas</Typography>
                  <Typography variant="h4" fontWeight={700} color="#BA68C8">
                    {stats.lecturas}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Typography variant="body1" color="#ccc" textAlign="center">
            No hay datos de consumo por {period} disponibles
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
