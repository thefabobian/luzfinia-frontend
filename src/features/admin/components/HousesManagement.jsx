import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Add,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import { AdminService } from "../services/admin.services";
import { useSnackbar } from "notistack";

export default function HousesManagement() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openStatsDialog, setOpenStatsDialog] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [houseStats, setHouseStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const { enqueueSnackbar } = useSnackbar();

  // Estado del formulario de nueva casa
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  // Cargar todas las casas al montar el componente
  useEffect(() => {
    loadHouses();
  }, []);

  const loadHouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminService.getAllHouses();
      setHouses(data);
    } catch (err) {
      console.error("Error al cargar casas:", err);
      setError(err.response?.data?.message || "Error al cargar las casas");
      enqueueSnackbar("Error al cargar las casas", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHouse = async () => {
    try {
      // Validación básica
      if (!formData.name || !formData.description) {
        enqueueSnackbar("Todos los campos son requeridos", {
          variant: "warning",
        });
        return;
      }

      const newHouse = await AdminService.createHouse(formData);
      setHouses([...houses, newHouse]);
      enqueueSnackbar("Casa creada exitosamente", { variant: "success" });

      // Resetear formulario y cerrar diálogo
      setFormData({ name: "", description: "" });
      setOpenCreateDialog(false);
    } catch (err) {
      console.error("Error al crear casa:", err);
      enqueueSnackbar(
        err.response?.data?.message || "Error al crear la casa",
        { variant: "error" }
      );
    }
  };

  const handleViewStats = async (house, period = "month") => {
    try {
      setSelectedHouse(house);
      setOpenStatsDialog(true);
      setLoadingStats(true);

      const stats = await AdminService.getHouseConsumptionStats(
        house._id,
        period
      );
      setHouseStats(stats);
    } catch (err) {
      console.error("Error al cargar estadísticas:", err);
      enqueueSnackbar(
        err.response?.data?.message || "Error al cargar estadísticas",
        { variant: "error" }
      );
    } finally {
      setLoadingStats(false);
    }
  };

  const handleChangePeriod = (newPeriod) => {
    setSelectedPeriod(newPeriod);
    if (selectedHouse) {
      handleViewStats(selectedHouse, newPeriod);
    }
  };

  const handleCloseStatsDialog = () => {
    setOpenStatsDialog(false);
    setSelectedHouse(null);
    setHouseStats(null);
    setSelectedPeriod("month");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} color="#fff">
            Gestión de Casas
          </Typography>
          <Typography variant="body2" color="#b8bcc8">
            Total de casas registradas: {houses.length}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreateDialog(true)}
          sx={{
            background: "linear-gradient(135deg, #FFD54F 0%, #FFA726 100%)",
            color: "#1a1d24",
            fontWeight: 600,
            "&:hover": {
              background: "linear-gradient(135deg, #FFA726 0%, #FF8A50 100%)",
            },
          }}
        >
          Nueva Casa
        </Button>
      </Box>

      {/* Tabla de casas */}
      <TableContainer
        component={Paper}
        sx={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#FFD54F", fontWeight: 600 }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: "#FFD54F", fontWeight: 600 }}>
                Propietario
              </TableCell>
              <TableCell sx={{ color: "#FFD54F", fontWeight: 600 }}>
                Electrodomésticos
              </TableCell>
              <TableCell sx={{ color: "#FFD54F", fontWeight: 600 }}>
                Consumo Total (kWh)
              </TableCell>
              <TableCell
                align="center"
                sx={{ color: "#FFD54F", fontWeight: 600 }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {houses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#b8bcc8" }}>
                  No hay casas registradas
                </TableCell>
              </TableRow>
            ) : (
              houses.map((house) => (
                <TableRow key={house._id}>
                  <TableCell sx={{ color: "#fff", fontWeight: 500 }}>
                    {house.name}
                  </TableCell>
                  <TableCell sx={{ color: "#b8bcc8" }}>
                    {house.user?.name || "Sin asignar"}
                  </TableCell>
                  <TableCell sx={{ color: "#b8bcc8" }}>
                    {house.appliances?.length || 0}
                  </TableCell>
                  <TableCell sx={{ color: "#00E676", fontWeight: 600 }}>
                    {house.totalConsumption?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleViewStats(house, "month")}
                      sx={{
                        color: "#2196F3",
                        "&:hover": {
                          background: "rgba(33, 150, 243, 0.1)",
                        },
                      }}
                      title="Ver estadísticas detalladas"
                    >
                      <BarChartIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo para crear casa */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "#2a2d3a",
            color: "#fff",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Registrar Nueva Casa
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Nombre de la Casa"
              fullWidth
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ej: Casa Familiar"
              autoFocus
              sx={{
                "& .MuiInputBase-root": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#b8bcc8" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#FFD54F" },
                  "&.Mui-focused fieldset": { borderColor: "#FFD54F" },
                },
              }}
            />
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Ej: Casa con 3 habitaciones y 2 baños."
              sx={{
                "& .MuiInputBase-root": { color: "#fff" },
                "& .MuiInputLabel-root": { color: "#b8bcc8" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#FFD54F" },
                  "&.Mui-focused fieldset": { borderColor: "#FFD54F" },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenCreateDialog(false)}
            sx={{ color: "#b8bcc8" }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleCreateHouse}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #FFD54F 0%, #FFA726 100%)",
              color: "#1a1d24",
              fontWeight: 600,
            }}
          >
            Crear Casa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Estadísticas */}
      <Dialog
        open={openStatsDialog}
        onClose={handleCloseStatsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "#2a2d3a",
            color: "#fff",
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Estadísticas de Consumo
              </Typography>
              {selectedHouse && (
                <Typography variant="body2" color="#b8bcc8">
                  {selectedHouse.name}
                </Typography>
              )}
            </Box>
            <FormControl
              size="small"
              sx={{
                minWidth: 120,
                "& .MuiInputLabel-root": { color: "#b8bcc8" },
                "& .MuiSelect-root": { color: "#fff" },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FFD54F",
                },
              }}
            >
              <InputLabel id="period-select-label">Periodo</InputLabel>
              <Select
                labelId="period-select-label"
                value={selectedPeriod}
                label="Periodo"
                onChange={(e) => handleChangePeriod(e.target.value)}
              >
                <MenuItem value="day">Día</MenuItem>
                <MenuItem value="week">Semana</MenuItem>
                <MenuItem value="month">Mes</MenuItem>
                <MenuItem value="year">Año</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loadingStats ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 4,
              }}
            >
              <CircularProgress />
            </Box>
          ) : houseStats ? (
            <Box sx={{ mt: 2 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    background:
                      "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    Consumo Total
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {houseStats.totalKwh || 0} kWh
                  </Typography>
                </Paper>
                <Paper
                  sx={{
                    p: 2,
                    background:
                      "linear-gradient(135deg, #00E676 0%, #00C853 100%)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight={600} color="#1a1d24">
                    Costo Aproximado
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#1a1d24">
                    {houseStats.costoAproximado || "$0 COP"}
                  </Typography>
                </Paper>
                <Paper
                  sx={{
                    p: 2,
                    background:
                      "linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    Lecturas
                  </Typography>
                  <Typography variant="h4" fontWeight={700}>
                    {houseStats.lecturas || 0}
                  </Typography>
                </Paper>
              </Box>
              <Typography variant="body2" color="#b8bcc8" sx={{ mt: 2 }}>
                Periodo:{" "}
                {selectedPeriod === "day"
                  ? "Último día"
                  : selectedPeriod === "week"
                  ? "Última semana"
                  : selectedPeriod === "month"
                  ? "Último mes"
                  : "Último año"}
              </Typography>
            </Box>
          ) : (
            <Alert severity="info">
              No hay estadísticas disponibles para esta casa
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatsDialog} sx={{ color: "#b8bcc8" }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
