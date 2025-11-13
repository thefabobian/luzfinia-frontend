import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { StatsService } from "../services/stats.service";
import { useParams } from "react-router-dom";

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

  const [consumption, setConsumption] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  const [period, setPeriod] = useState("month");

  const loadData = async () => {
    setLoading(true);
    try {
      const c = await StatsService.getConsumption(houseId);
      const p = await StatsService.getProfile(houseId);
      const s = await StatsService.getStats(houseId, period);

      setConsumption(c);
      setProfile(p);
      setStats(s);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period, houseId]);

  if (loading) return <CircularProgress color="inherit" />;

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
          {consumption.total.toFixed(2)} kWh
        </Typography>
      </Paper>

      {/* PERFIL HORARIO */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <Typography variant="h6" mb={2}>
          Consumo en las últimas 24 horas
        </Typography>

        <Line
          data={{
            labels: profile.map((x) => x.hour),
            datasets: [
              {
                label: "kWh",
                data: profile.map((x) => x.kwhUsed),
                borderColor: "#2196F3",
                backgroundColor: "rgba(33,150,243,0.3)",
              },
            ],
          }}
        />
      </Paper>

      {/* CONSUMO POR PERIODO */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: "rgba(255,255,255,0.05)",
        }}
      >
        <Typography variant="h6" mb={2}>
          Consumo por {period}
        </Typography>

        <Line
          data={{
            labels: stats.map((x) => x.label),
            datasets: [
              {
                label: "kWh",
                data: stats.map((x) => x.kwh),
                borderColor: "#6A1B9A",
                backgroundColor: "rgba(106,27,154,0.3)",
              },
            ],
          }}
        />
      </Paper>
    </Box>
  );
}
