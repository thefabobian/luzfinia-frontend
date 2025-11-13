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

import { AuthContext } from "../context/AuthContext";
import { useNavigate, Outlet } from "react-router-dom";
import { useSnackbar } from "notistack";

const drawerWidth = 240;

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    logout();
    enqueueSnackbar("👋 Sesión finalizada correctamente.", { variant: "info" });
    navigate("/login");
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background:
          "linear-gradient(135deg, #6A1B9A 0%, #2196F3 50%, #FFD54F 100%)",
        color: "#fff",
      }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Bolt sx={{ color: "#FFD54F" }} />
        <Typography variant="h6" fontWeight={700}>LuzFinia</Typography>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.3)" }} />

      <List>
        {[
          { text: "Inicio", icon: <Home />, path: "/admin" },
          { text: "Electrodomésticos", icon: <Devices />, path: "/admin/appliances" },
          { text: "Usuarios", icon: <People />, path: "/admin/users" },
          { text: "Estadísticas", icon: <BarChart />, path: "/admin/stats" },
        ].map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{ color: "#fff" }}
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
    <Box sx={{ display: "flex", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <CssBaseline />

      {/* DRAWER IZQUIERDO */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background:
              "linear-gradient(135deg, #6A1B9A 0%, #2196F3 50%, #FFD54F 100%)",
            color: "#fff",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* CONTENIDO PRINCIPAL */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          width: `calc(100vw - ${drawerWidth}px)`,
          background:
            "linear-gradient(135deg, #6A1B9A 0%, #2196F3 50%, #FFD54F 100%)",
          backgroundSize: "cover",
        }}
      >
        {/* APPBAR */}
        <AppBar
          position="sticky"
          sx={{
            background: "rgba(20,20,30,0.7)",
            backdropFilter: "blur(10px)",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
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

        {/* PÁGINAS */}
        <Box sx={{ p: 3, width: "100%" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
