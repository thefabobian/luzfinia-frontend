import { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

export default function StatsSelectHouse() {
  const [houses, setHouses] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/houses");
        setHouses(res.data);
      } catch (err) {
        console.error("Error cargando casas", err);
      }
    }
    load();
  }, []);

  if (!houses) return <CircularProgress color="inherit" />;

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
                Dueño: {house.ownerName || "No disponible"}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
