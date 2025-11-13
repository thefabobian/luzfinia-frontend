import { Box, Typography, Grid, Paper } from "@mui/material";

export default function DashboardAdmin() {
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
              24
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
              56
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
              17
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
              1.248
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
