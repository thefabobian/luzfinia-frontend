import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Home as HomeIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon,
  Power as PowerIcon,
  Bolt,
  DevicesOther,
  PowerSettingsNew as LogoutIcon,
} from "@mui/icons-material";
import { HouseService } from "../../features/houses/services/house.service";
import { ApplianceService } from "../../features/appliances/services/appliance.service";
import { useSnackbar } from "notistack";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";

export default function ManageHouse() {
  const { houseId } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { logout } = useContext(AuthContext);

  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [customName, setCustomName] = useState("");
  const [adding, setAdding] = useState(false);
  const [toggling, setToggling] = useState(null);

  const { connected, on, off } = useContext(SocketContext);

  useEffect(() => {
    loadHouseData();
    loadModels();
  }, [houseId]);

  // Socket.io: escuchar eventos en tiempo real
  useEffect(() => {
    if (!connected) return;

    // Manejar nueva lectura (cada 5 segundos)
    const handleNewReading = (data) => {
      console.log("📊 Nueva lectura recibida:", data);

      // Solo actualizar si es de esta casa (usar houseId del evento)
      if (data.houseId === houseId) {
        // Actualizar consumo total en tiempo real
        setHouse((prev) => ({
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

  const handleLogout = () => {
    logout();
    enqueueSnackbar("Sesión cerrada correctamente", { variant: "info" });
    navigate("/login");
  };

  async function loadHouseData() {
    setLoading(true);
    try {
      const myHouses = await HouseService.getMyHouses();
      const foundHouse = myHouses.find((h) => h._id === houseId);

      if (!foundHouse) {
        enqueueSnackbar("Casa no encontrada", { variant: "error" });
        navigate("/client");
        return;
      }

      setHouse(foundHouse);
    } catch (err) {
      console.error("Error cargando casa:", err);
      enqueueSnackbar("Error al cargar la casa", { variant: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function loadModels() {
    try {
      const data = await ApplianceService.getModels();
      setModels(data || []);
    } catch (err) {
      console.error("Error cargando modelos:", err);
    }
  }

  const handleOpenAddDialog = (model) => {
    setSelectedModel(model);
    setCustomName("");
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setSelectedModel(null);
    setCustomName("");
  };

  async function handleAddAppliance() {
    if (!selectedModel) return;

    setAdding(true);
    try {
      await ApplianceService.assignToHouse(
        houseId,
        selectedModel._id,
        customName
      );
      enqueueSnackbar("Electrodoméstico agregado exitosamente", {
        variant: "success",
      });
      handleCloseAddDialog();
      await loadHouseData();
    } catch (err) {
      console.error("Error agregando electrodoméstico:", err);
      enqueueSnackbar(
        err.response?.data?.message || "Error al agregar electrodoméstico",
        { variant: "error" }
      );
    } finally {
      setAdding(false);
    }
  }

  async function handleToggleAppliance(applianceId) {
    setToggling(applianceId);
    try {
      await ApplianceService.toggleAppliance(applianceId);
      enqueueSnackbar("Estado actualizado", { variant: "success" });
      await loadHouseData();
    } catch (err) {
      console.error("Error cambiando estado:", err);
      enqueueSnackbar(
        err.response?.data?.message || "Error al cambiar estado",
        { variant: "error" }
      );
    } finally {
      setToggling(null);
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          background:
            "linear-gradient(135deg, #6A1B9A 0%, #2196F3 50%, #FFD54F 100%)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          overflow: "auto",
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background:
          "linear-gradient(135deg, #6A1B9A 0%, #2196F3 50%, #FFD54F 100%)",
        overflow: "auto",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton
          onClick={() => navigate("/client")}
          sx={{ color: "#fff" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <HomeIcon sx={{ color: "#FFD54F", fontSize: 40 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={700} color="#fff">
            {house?.name}
          </Typography>
          <Typography variant="body2" color="#B0BEC5">
            {house?.description || "Sin descripción"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddDialog(true)}
          sx={{
            background: "linear-gradient(90deg, #FFD54F, #FFC107)",
            color: "#000",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(90deg, #FFC107, #FF9800)",
            },
          }}
        >
          Agregar Electrodoméstico
        </Button>
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

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              background: "rgba(0,0,0,0.5)",
              borderRadius: 2,
              border: "1px solid rgba(100,181,246,0.3)",
            }}
          >
            <Typography variant="body2" color="#64B5F6">
              Consumo Total
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#fff">
              {house?.totalConsumption?.toFixed(2) || "0.00"} kWh
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              background: "rgba(0,0,0,0.5)",
              borderRadius: 2,
              border: "1px solid rgba(129,199,132,0.3)",
            }}
          >
            <Typography variant="body2" color="#81C784">
              Electrodomésticos
            </Typography>
            <Typography variant="h5" fontWeight={700} color="#fff">
              {house?.appliances?.length || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Appliances List */}
      <Typography variant="h5" fontWeight={700} color="#fff" mb={2}>
        Mis Electrodomésticos
      </Typography>

      {!house?.appliances || house.appliances.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            background: "rgba(0,0,0,0.4)",
            borderRadius: 3,
            border: "1px solid rgba(100,181,246,0.2)",
          }}
        >
          <DevicesOther sx={{ fontSize: 60, color: "#64B5F6", mb: 2 }} />
          <Typography variant="h6" color="#fff" mb={1}>
            No hay electrodomésticos aún
          </Typography>
          <Typography variant="body2" color="#B0BEC5">
            Agrega tu primer electrodoméstico usando el botón de arriba
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {house.appliances.map((appliance) => (
            <Grid item xs={12} sm={6} md={4} key={appliance._id}>
              <Card
                sx={{
                  background: appliance.isOn
                    ? "rgba(129,199,132,0.2)"
                    : "rgba(0,0,0,0.5)",
                  color: "#fff",
                  borderRadius: 3,
                  border: appliance.isOn
                    ? "2px solid #81C784"
                    : "1px solid rgba(100,181,246,0.3)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600} color="#FFD54F">
                      {appliance.customName || appliance.baseModel?.name}
                    </Typography>
                    <Chip
                      label={appliance.isOn ? "Encendido" : "Apagado"}
                      size="small"
                      sx={{
                        background: appliance.isOn
                          ? "rgba(129,199,132,0.3)"
                          : "rgba(176,190,197,0.3)",
                        color: appliance.isOn ? "#81C784" : "#B0BEC5",
                        border: `1px solid ${
                          appliance.isOn ? "#81C784" : "#B0BEC5"
                        }`,
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  {appliance.customName && (
                    <Typography variant="body2" color="#B0BEC5" sx={{ mb: 1 }}>
                      Modelo: {appliance.baseModel?.name}
                    </Typography>
                  )}

                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                  >
                    <Bolt sx={{ color: "#64B5F6", fontSize: 20 }} />
                    <Typography variant="body2" color="#64B5F6">
                      Consumo: {appliance.baseModel?.powerConsumption || 0} W
                    </Typography>
                  </Box>

                  {appliance.lastToggledAt && (
                    <Typography variant="caption" color="#999">
                      Último cambio:{" "}
                      {new Date(appliance.lastToggledAt).toLocaleString(
                        "es-ES"
                      )}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={
                      toggling === appliance._id ? null : <PowerIcon />
                    }
                    onClick={() => handleToggleAppliance(appliance._id)}
                    disabled={toggling === appliance._id}
                    sx={{
                      background: appliance.isOn
                        ? "linear-gradient(90deg, #EF5350, #E53935)"
                        : "linear-gradient(90deg, #81C784, #66BB6A)",
                      color: "#fff",
                      fontWeight: 600,
                      "&:hover": {
                        background: appliance.isOn
                          ? "linear-gradient(90deg, #E53935, #D32F2F)"
                          : "linear-gradient(90deg, #66BB6A, #4CAF50)",
                      },
                    }}
                  >
                    {toggling === appliance._id ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : appliance.isOn ? (
                      "Apagar"
                    ) : (
                      "Encender"
                    )}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Appliance Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={handleCloseAddDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background:
              "linear-gradient(135deg, #6A1B9A 0%, #2196F3 50%, #FFD54F 100%)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon />
            <Typography variant="h6">Agregar Electrodoméstico</Typography>
          </Box>
          <IconButton onClick={handleCloseAddDialog} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedModel ? (
            <Box>
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  background: "rgba(0,0,0,0.3)",
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" color="#FFD54F" mb={1}>
                  {selectedModel.name}
                </Typography>
                <Typography variant="body2" color="#B0BEC5" mb={2}>
                  {selectedModel.description || "Sin descripción"}
                </Typography>
                <Typography variant="body2" color="#64B5F6">
                  Consumo: {selectedModel.powerConsumption} W
                </Typography>
              </Paper>

              <TextField
                fullWidth
                label="Nombre personalizado (opcional)"
                placeholder="Ej: Refrigerador de la cocina"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(255,255,255,0.5)",
                    },
                    "&.Mui-focused fieldset": { borderColor: "#FFD54F" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#B0BEC5",
                    "&.Mui-focused": { color: "#FFD54F" },
                  },
                }}
              />
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" color="#B0BEC5" mb={2}>
                Selecciona un modelo de electrodoméstico:
              </Typography>

              {models.length === 0 ? (
                <Paper
                  sx={{
                    p: 3,
                    textAlign: "center",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" color="#B0BEC5">
                    No hay modelos disponibles
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={2}>
                  {models.map((model) => (
                    <Grid item xs={12} key={model._id}>
                      <Paper
                        onClick={() => handleOpenAddDialog(model)}
                        sx={{
                          p: 2,
                          background: "rgba(0,0,0,0.3)",
                          borderRadius: 2,
                          cursor: "pointer",
                          transition: "all 0.3s",
                          "&:hover": {
                            background: "rgba(0,0,0,0.5)",
                            transform: "scale(1.02)",
                          },
                        }}
                      >
                        <Typography variant="h6" color="#FFD54F" mb={1}>
                          {model.name}
                        </Typography>
                        <Typography variant="body2" color="#B0BEC5" mb={1}>
                          {model.description || "Sin descripción"}
                        </Typography>
                        <Typography variant="body2" color="#64B5F6">
                          Consumo: {model.powerConsumption} W
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>

        {selectedModel && (
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleCloseAddDialog}
              sx={{ color: "#fff" }}
              disabled={adding}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddAppliance}
              variant="contained"
              disabled={adding}
              sx={{
                background: "linear-gradient(90deg, #FFD54F, #FFC107)",
                color: "#000",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(90deg, #FFC107, #FF9800)",
                },
              }}
            >
              {adding ? (
                <CircularProgress size={24} sx={{ color: "#000" }} />
              ) : (
                "Agregar"
              )}
            </Button>
          </DialogActions>
        )}
      </Dialog>
      </Box>
    </Box>
  );
}
