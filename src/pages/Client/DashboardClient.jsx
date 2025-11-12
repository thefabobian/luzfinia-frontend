import { Typography, Box } from "@mui/material";

export default function DashboardClient() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Panel del Cliente</Typography>
      <Typography>Bienvenido al sistema LuzFinia (Cliente)</Typography>
    </Box>
  );
}