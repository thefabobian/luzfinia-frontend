import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Close as CloseIcon, Home as HomeIcon } from "@mui/icons-material";
import { AdminService } from "../../features/admin/services/admin.service";
import { StatsService } from "../../features/stats/services/stats.service";

export default function UsersAdmin() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHouses, setUserHouses] = useState([]);
  const [loadingHouses, setLoadingHouses] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await AdminService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
        setError(err.response?.data?.message || "Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setLoadingHouses(true);
    setUserHouses([]);

    try {
      // Obtener todas las casas y filtrar por el usuario seleccionado
      const allHouses = await StatsService.getHouses();
      const filteredHouses = allHouses.filter(
        (house) => house.user && house.user._id === user._id
      );
      setUserHouses(filteredHouses);
    } catch (err) {
      console.error("Error cargando casas del usuario:", err);
    } finally {
      setLoadingHouses(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setUserHouses([]);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px", color: "#fff" }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", p: 3, color: "#fff" }}>
        <Paper
          sx={{
            p: 3,
            background: "rgba(255,0,0,0.1)",
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", color: "#fff" }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Gestión de Usuarios
      </Typography>

      <Paper
        sx={{
          background: "rgba(0,0,0,0.4)",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid rgba(100,181,246,0.2)",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "rgba(0,0,0,0.3)" }}>
                <TableCell sx={{ color: "#E3F2FD", fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ color: "#E3F2FD", fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ color: "#E3F2FD", fontWeight: 700 }}>Rol</TableCell>
                <TableCell sx={{ color: "#E3F2FD", fontWeight: 700 }}>Fecha de Registro</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", color: "#ccc", py: 4 }}>
                    No hay usuarios registrados
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user._id}
                    onClick={() => handleUserClick(user)}
                    sx={{
                      "&:hover": { background: "rgba(255,255,255,0.05)", cursor: "pointer" },
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <TableCell sx={{ color: "#fff" }}>{user.name}</TableCell>
                    <TableCell sx={{ color: "#B0BEC5" }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === "admin" ? "Administrador" : "Cliente"}
                        size="small"
                        sx={{
                          background: user.role === "admin" ? "rgba(156,39,176,0.3)" : "rgba(33,150,243,0.3)",
                          color: user.role === "admin" ? "#BA68C8" : "#64B5F6",
                          border: `1px solid ${user.role === "admin" ? "#BA68C8" : "#64B5F6"}`,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: "#B0BEC5" }}>
                      {new Date(user.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ mt: 3, p: 2, background: "rgba(0,0,0,0.3)", borderRadius: 2 }}>
        <Typography variant="body2" color="#B0BEC5">
          Total de usuarios: <strong style={{ color: "#64B5F6" }}>{users.length}</strong>
        </Typography>
      </Box>

      {/* Modal de casas del usuario */}
      <Dialog
        open={!!selectedUser}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #6A1B9A 0%, #2196F3 50%, #FFD54F 100%)",
            color: "#fff",
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HomeIcon />
            <Typography variant="h6">
              Casas de {selectedUser?.name}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseModal} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
        <DialogContent sx={{ p: 3 }}>
          {loadingHouses ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress color="inherit" />
            </Box>
          ) : userHouses.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                background: "rgba(0,0,0,0.3)",
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="#B0BEC5">
                Este usuario no tiene casas asignadas
              </Typography>
            </Paper>
          ) : (
            <List>
              {userHouses.map((house, index) => (
                <Box key={house._id}>
                  <ListItem
                    sx={{
                      background: "rgba(0,0,0,0.3)",
                      borderRadius: 2,
                      mb: 2,
                      p: 2,
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" fontWeight={600} color="#FFD54F">
                          {house.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="#B0BEC5">
                            {house.description || "Sin descripción"}
                          </Typography>
                          <Typography variant="body2" color="#64B5F6" sx={{ mt: 1 }}>
                            Consumo total: {house.totalConsumption?.toFixed(2) || "0.00"} kWh
                          </Typography>
                          <Typography variant="body2" color="#81C784">
                            Electrodomésticos: {house.appliances?.length || 0}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < userHouses.length - 1 && (
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 1 }} />
                  )}
                </Box>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
