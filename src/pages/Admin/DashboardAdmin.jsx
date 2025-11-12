import { useState, useContext, useEffect } from "react";
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
import { AdminService } from "../../features/admin/services/admin.services";
import HousesManagement from "../../features/admin/components/HousesManagement";

const drawerWidth = 240;

export default function DashboardAdmin() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedView, setSelectedView] = useState("dashboard"); // dashboard, casas, electrodomesticos, usuarios, estadisticas
  const [stats, setStats] = useState({
    houses: 0,
    appliances: 0,
    users: 0,
    consumption: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Cargar estadísticas al montar el componente
  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const [housesCount, appliancesCount, usersCount, totalConsumption] =
        await Promise.all([
          AdminService.getHousesCount(),
          AdminService.getAppliancesCount(),
          AdminService.getUsersCount(),
          AdminService.getTotalConsumption(),
        ]);

      setStats({
        houses: housesCount,
        appliances: appliancesCount,
        users: usersCount,
        consumption: totalConsumption,
      });
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      enqueueSnackbar("Error al cargar estadísticas del dashboard", {
        variant: "error",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (view) => {
    setSelectedView(view);
    if (mobileOpen) {
      setMobileOpen(false);
    }
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
          { text: "Dashboard", icon: <BarChart />, view: "dashboard" },
          { text: "Casas", icon: <Home />, view: "casas" },
          { text: "Electrodomésticos", icon: <Devices />, view: "electrodomesticos" },
          { text: "Usuarios", icon: <People />, view: "usuarios" },
        ].map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => handleMenuClick(item.view)}
              sx={{
                color: "#fff",
                backgroundColor:
                  selectedView === item.view
                    ? "rgba(255,213,79,0.2)"
                    : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(255,213,79,0.1)",
                },
              }}
            >
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
          background: "linear-gradient(135deg, #1e2330 0%, #2a2d3a 100%)",
          minHeight: "100vh",
          color: "#fff",
        }}
      >
        <Toolbar />

        {/* Vista Dashboard */}
        {selectedView === "dashboard" && (
          <>
            <Typography variant="h4" mb={2}>
              Bienvenido, Administrador ⚡
            </Typography>
            <Typography variant="body1" color="#b8bcc8" mb={4}>
              Aquí puedes gestionar las casas registradas, los electrodomésticos
              base, los usuarios y revisar las estadísticas globales del sistema.
            </Typography>

            {/* Tarjetas de estadísticas */}
            <Grid container spacing={3} mb={4}>
              {/* Tarjeta 1 */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    background: "linear-gradient(135deg, #FFD54F 0%, #FFA726 100%)",
                    borderRadius: 2,
                    transition: "transform 0.2s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                  onClick={() => handleMenuClick("casas")}
                >
                  <Typography variant="body2" color="#1a1d24" fontWeight={600}>
                    Casas registradas
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="#1a1d24">
                    {loadingStats ? "..." : stats.houses}
                  </Typography>
                </Paper>
              </Grid>

              {/* Tarjeta 2 */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                    borderRadius: 2,
                    transition: "transform 0.2s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                  onClick={() => handleMenuClick("electrodomesticos")}
                >
                  <Typography variant="body2" color="#fff" fontWeight={600}>
                    Electrodomésticos base
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="#fff">
                    {loadingStats ? "..." : stats.appliances}
                  </Typography>
                </Paper>
              </Grid>

              {/* Tarjeta 3 */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    background: "linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)",
                    borderRadius: 2,
                    transition: "transform 0.2s",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                  onClick={() => handleMenuClick("usuarios")}
                >
                  <Typography variant="body2" color="#fff" fontWeight={600}>
                    Usuarios activos
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="#fff">
                    {loadingStats ? "..." : stats.users}
                  </Typography>
                </Paper>
              </Grid>

              {/* Tarjeta 4 */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    background: "linear-gradient(135deg, #00E676 0%, #00C853 100%)",
                    borderRadius: 2,
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Typography variant="body2" color="#1a1d24" fontWeight={600}>
                    Consumo total (kWh)
                  </Typography>
                  <Typography variant="h3" fontWeight={700} color="#1a1d24">
                    {loadingStats ? "..." : stats.consumption}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Sección de acceso rápido */}
            <Paper
              sx={{
                p: 3,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 2,
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="h5" mb={2} fontWeight={600}>
                Acceso Rápido
              </Typography>
              <Typography variant="body2" color="#b8bcc8" mb={3}>
                Administra las diferentes secciones del sistema desde aquí.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  startIcon={<Home />}
                  onClick={() => handleMenuClick("casas")}
                  sx={{
                    background: "linear-gradient(135deg, #FFD54F 0%, #FFA726 100%)",
                    color: "#1a1d24",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(135deg, #FFA726 0%, #FF8A50 100%)",
                    },
                  }}
                >
                  Gestionar Casas
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Devices />}
                  onClick={() => handleMenuClick("electrodomesticos")}
                  sx={{
                    background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
                    },
                  }}
                >
                  Gestionar Electrodomésticos
                </Button>
                <Button
                  variant="contained"
                  startIcon={<People />}
                  onClick={() => handleMenuClick("usuarios")}
                  sx={{
                    background: "linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)",
                    color: "#fff",
                    fontWeight: 600,
                    "&:hover": {
                      background: "linear-gradient(135deg, #6A1B9A 0%, #4A148C 100%)",
                    },
                  }}
                >
                  Gestionar Usuarios
                </Button>
              </Box>
            </Paper>
          </>
        )}

        {/* Vista Casas */}
        {selectedView === "casas" && <HousesManagement />}

        {/* Vista Electrodomésticos - Placeholder */}
        {selectedView === "electrodomesticos" && (
          <Paper
            sx={{
              p: 4,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Devices sx={{ fontSize: 64, color: "#2196F3", mb: 2 }} />
            <Typography variant="h5" mb={2}>
              Gestión de Electrodomésticos
            </Typography>
            <Typography variant="body1" color="#b8bcc8">
              Esta sección está en desarrollo. Próximamente podrás gestionar los
              electrodomésticos del sistema.
            </Typography>
          </Paper>
        )}

        {/* Vista Usuarios - Placeholder */}
        {selectedView === "usuarios" && (
          <Paper
            sx={{
              p: 4,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <People sx={{ fontSize: 64, color: "#9C27B0", mb: 2 }} />
            <Typography variant="h5" mb={2}>
              Gestión de Usuarios
            </Typography>
            <Typography variant="body1" color="#b8bcc8">
              Esta sección está en desarrollo. Próximamente podrás gestionar los
              usuarios del sistema.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
