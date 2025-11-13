import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";
import {
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  Bolt,
  Settings as SettingsIcon,
  PowerSettingsNew as LogoutIcon,
} from "@mui/icons-material";
import { HouseService } from "../../features/houses/services/house.service";
import { useSnackbar } from "notistack";
import { AuthContext } from "../../context/AuthContext";

export default function DashboardClient() {
  const [tabValue, setTabValue] = useState(0);
  const [myHouses, setMyHouses] = useState([]);
  const [availableHouses, setAvailableHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    enqueueSnackbar("Sesión cerrada correctamente", { variant: "info" });
    navigate("/login");
  };

  useEffect(() => {
    loadHouses();
  }, []);

  async function loadHouses() {
    setLoading(true);
    try {
      const [myHousesData, availableHousesData] = await Promise.allSettled([
        HouseService.getMyHouses(),
        HouseService.getAvailableHouses(),
      ]);

      if (myHousesData.status === "fulfilled") {
        setMyHouses(myHousesData.value || []);
      } else {
        console.error("Error cargando mis casas:", myHousesData.reason);
      }

      if (availableHousesData.status === "fulfilled") {
        setAvailableHouses(availableHousesData.value || []);
      } else {
        console.error("Error cargando casas disponibles:", availableHousesData.reason);
      }
    } catch (err) {
      console.error("Error general:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(houseId) {
    setPurchasing(houseId);
    try {
      await HouseService.purchaseHouse(houseId);
      enqueueSnackbar("¡Casa comprada exitosamente! 🏠", { variant: "success" });
      await loadHouses();
    } catch (err) {
      console.error("Error comprando casa:", err);
      enqueueSnackbar(
        err.response?.data?.message || "Error al comprar la casa",
        { variant: "error" }
      );
    } finally {
      setPurchasing(null);
    }
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderHouseCard = (house, isAvailable = false) => (
    <Grid item xs={12} sm={6} md={4} key={house._id}>
      <Card
        sx={{
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          borderRadius: 3,
          border: "1px solid rgba(100,181,246,0.3)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <HomeIcon sx={{ color: "#FFD54F" }} />
            <Typography variant="h6" fontWeight={600} color="#FFD54F">
              {house.name}
            </Typography>
          </Box>

          <Typography variant="body2" color="#B0BEC5" sx={{ mb: 2 }}>
            {house.description || "Sin descripción"}
          </Typography>

          {!isAvailable && (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Bolt sx={{ color: "#64B5F6", fontSize: 20 }} />
                <Typography variant="body2" color="#64B5F6">
                  Consumo: {house.totalConsumption?.toFixed(2) || "0.00"} kWh
                </Typography>
              </Box>

              <Typography variant="body2" color="#81C784">
                Electrodomésticos: {house.appliances?.length || 0}
              </Typography>
            </>
          )}

          {isAvailable && (
            <Chip
              label="Disponible"
              size="small"
              sx={{
                background: "rgba(129,199,132,0.3)",
                color: "#81C784",
                border: "1px solid #81C784",
                fontWeight: 600,
              }}
            />
          )}
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          {isAvailable ? (
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => handlePurchase(house._id)}
              disabled={purchasing === house._id}
              sx={{
                background: "linear-gradient(90deg, #64B5F6, #2196F3)",
                color: "#fff",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(90deg, #2196F3, #1976D2)",
                },
              }}
            >
              {purchasing === house._id ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Comprar"
              )}
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              startIcon={<SettingsIcon />}
              onClick={() => navigate(`/client/house/${house._id}`)}
              sx={{
                background: "linear-gradient(90deg, #FFD54F, #FFC107)",
                color: "#000",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(90deg, #FFC107, #FF9800)",
                },
              }}
            >
              Gestionar
            </Button>
          )}
        </CardActions>
      </Card>
    </Grid>
  );

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #6A1B9A 0%, #2196F3 50%, #FFD54F 100%)",
        overflow: "auto",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Bolt sx={{ color: "#FFD54F", fontSize: 40 }} />
        <Typography variant="h4" fontWeight={700} color="#fff" sx={{ flexGrow: 1 }}>
          Panel del Cliente - {user?.name}
        </Typography>
        <Button
          variant="contained"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            background: "rgba(0,0,0,0.5)",
            color: "#fff",
            fontWeight: 600,
            border: "1px solid rgba(255,255,255,0.3)",
            "&:hover": {
              background: "rgba(0,0,0,0.7)",
            },
          }}
        >
          Salir
        </Button>
      </Box>

      {/* Tabs */}
      <Paper
        sx={{
          background: "rgba(0,0,0,0.4)",
          borderRadius: 3,
          mb: 3,
          border: "1px solid rgba(100,181,246,0.2)",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              color: "#B0BEC5",
              fontWeight: 600,
            },
            "& .Mui-selected": {
              color: "#FFD54F !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#FFD54F",
            },
          }}
        >
          <Tab label="Mis Casas" />
          <Tab label="Casas Disponibles" />
        </Tabs>
      </Paper>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: "#fff" }} />
        </Box>
      ) : (
        <>
          {/* Tab 0: Mis Casas */}
          {tabValue === 0 && (
            <Box>
              {myHouses.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: 3,
                    border: "1px solid rgba(100,181,246,0.2)",
                  }}
                >
                  <HomeIcon sx={{ fontSize: 60, color: "#64B5F6", mb: 2 }} />
                  <Typography variant="h6" color="#fff" mb={1}>
                    No tienes casas aún
                  </Typography>
                  <Typography variant="body2" color="#B0BEC5">
                    Ve a la pestaña "Casas Disponibles" para comprar tu primera casa
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {myHouses.map((house) => renderHouseCard(house, false))}
                </Grid>
              )}
            </Box>
          )}

          {/* Tab 1: Casas Disponibles */}
          {tabValue === 1 && (
            <Box>
              {availableHouses.length === 0 ? (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: "center",
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: 3,
                    border: "1px solid rgba(100,181,246,0.2)",
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 60, color: "#64B5F6", mb: 2 }} />
                  <Typography variant="h6" color="#fff" mb={1}>
                    No hay casas disponibles
                  </Typography>
                  <Typography variant="body2" color="#B0BEC5">
                    Todas las casas ya tienen dueño
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {availableHouses.map((house) => renderHouseCard(house, true))}
                </Grid>
              )}
            </Box>
          )}
        </>
      )}
      </Box>
    </Box>
  );
}