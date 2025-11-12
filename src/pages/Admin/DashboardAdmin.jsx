import { useState, useContext } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  PowerSettingsNew,
  Home,
  Devices,
  People,
  BarChart,
  Bolt,
} from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const drawerWidth = 240;

export default function DashboardAdmin() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    enqueueSnackbar("👋 Sesión finalizada correctamente.", {
      variant: "info",
    });
    navigate("/login");
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background:
          "linear-gradient(180deg, #6A1B9A 0%, #2196F3 50%, #FFD54F 100%)",
        color: "#fff",
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Bolt sx={{ color: "#FFD54F" }} />
        <Typography variant="h6" fontWeight={700}>
          LuzFinia
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.3)" }} />
      <List>
        {[
          { text: "Casas", icon: <Home /> },
          { text: "Electrodomésticos", icon: <Devices /> },
          { text: "Usuarios", icon: <People /> },
          { text: "Estadísticas", icon: <BarChart /> },
        ].map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton sx={{ color: "#fff" }}>
              <ListItemIcon sx={{ color: "#FFD54F" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Barra superior */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "rgba(20,20,30,0.9)",
          backdropFilter: "blur(10px)",
          color: "#fff",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Panel del Administrador
          </Typography>
          <Button
            color="inherit"
            startIcon={<PowerSettingsNew />}
            onClick={handleLogout}
          >
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      {/* Menú lateral */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Drawer para móvil */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Drawer para escritorio */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          background: "#0d1117",
          minHeight: "100vh",
          color: "#fff",
        }}
      >
        <Toolbar />

        <Typography variant="h4" mb={2}>
          Bienvenido, Administrador ⚡
        </Typography>
        <Typography variant="body1" color="#ccc" mb={4}>
          Aquí puedes gestionar las casas registradas, los electrodomésticos
          base, los usuarios y revisar las estadísticas globales del sistema.
        </Typography>

        <Grid container spacing={3}>
          {/* Tarjeta 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                background: "rgba(255,255,255,0.05)",
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
                background: "rgba(255,255,255,0.05)",
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
                background: "rgba(255,255,255,0.05)",
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
                background: "rgba(255,255,255,0.05)",
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
    </Box>
  );
}
