import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { AppliancesService } from "../services/appliances.service";

export default function ApplianceModelsAdmin() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    powerConsumption: "",
  });

  const loadModels = async () => {
    try {
      const data = await AppliancesService.getAllModels();
      setModels(data);
    } catch (err) {
      enqueueSnackbar("❌ Error al cargar modelos", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const handleOpenDialog = (item = null) => {
    setEditing(item);
    setFormData(
      item
        ? {
            name: item.name,
            description: item.description,
            powerConsumption: item.powerConsumption,
          }
        : { name: "", description: "", powerConsumption: "" }
    );
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await AppliancesService.updateModel(editing._id, formData);
        enqueueSnackbar("✅ Modelo actualizado correctamente", {
          variant: "success",
        });
      } else {
        await AppliancesService.createModel(formData);
        enqueueSnackbar("✅ Modelo creado correctamente", {
          variant: "success",
        });
      }
      setOpenDialog(false);
      loadModels();
    } catch (err) {
      enqueueSnackbar("❌ Error al guardar el modelo", { variant: "error" });
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        p: 4,
        color: "#fff",
        overflow: "hidden", // 👈 Evita scroll lateral y espacios blancos
        boxSizing: "border-box",
      }}
    >
      <Typography variant="h4" mb={3} fontWeight={700}>
        Modelos de Electrodomésticos ⚙️
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{
          mb: 3,
          background:
            "linear-gradient(90deg, #FFD54F 0%, #2196F3 50%, #6A1B9A 100%)",
          fontWeight: "bold",
        }}
        onClick={() => handleOpenDialog()}
      >
        Nuevo Modelo
      </Button>

      {loading ? (
        <CircularProgress color="inherit" />
      ) : models.length === 0 ? (
        <Typography>No hay modelos registrados.</Typography>
      ) : (
        <Grid container spacing={3} sx={{ width: "100%", m: 0 }}>
          {models.map((m) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={m._id}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  height: "100%",
                  borderRadius: 4,
                  background: "rgba(20, 20, 30, 0.65)",
                  backdropFilter: "blur(10px)",
                  color: "#fff",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 12px 25px rgba(0,0,0,0.5)",
                  },
                }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={700} mb={1}>
                    {m.name}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {m.description}
                  </Typography>
                  <Typography
                    mt={2}
                    fontWeight={700}
                    sx={{ color: "#FFD54F" }}
                  >
                    {m.powerConsumption} kWh
                  </Typography>
                </Box>

                <Box mt={2} textAlign="right">
                  <Tooltip title="Editar modelo">
                    <IconButton
                      onClick={() => handleOpenDialog(m)}
                      sx={{ color: "#2196F3" }}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Diálogo Crear/Editar */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editing ? "Editar Modelo" : "Nuevo Modelo"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            variant="outlined"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Consumo (kWh)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.powerConsumption}
            onChange={(e) =>
              setFormData({
                ...formData,
                powerConsumption: parseFloat(e.target.value),
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
