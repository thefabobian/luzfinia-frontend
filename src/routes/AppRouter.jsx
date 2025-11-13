import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import DashboardClient from "../pages/Client/DashboardClient";
import ManageHouse from "../pages/Client/ManageHouse";
import ProtectedRoute from "../components/ProtectedRoute";
import ApplianceModelsAdmin from "../features/appliances/pages/ApplianceModelsAdmin";
import StatsHouse from "../features/stats/pages/StatsHouse";
import StatsSelectHouse from "../features/stats/pages/StatsSelectHouse";
import UsersAdmin from "../pages/Admin/UsersAdmin";

// IMPORTA EL NUEVO LAYOUT
import AdminLayout from "../layouts/AdminLayout";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* --- RUTAS PÚBLICAS --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- RUTAS ADMIN (todas dentro del AdminLayout) --- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* /admin */}
          <Route index element={<DashboardAdmin />} />

          {/* /admin/appliances */}
          <Route path="appliances" element={<ApplianceModelsAdmin />} />

          {/* /admin/users */}
          <Route path="users" element={<UsersAdmin />} />

          {/* /admin/stats */}
          <Route path="stats" element={<StatsSelectHouse />} />
          <Route path="stats/:houseId" element={<StatsHouse />} />

        </Route>

        {/* --- RUTAS CLIENTE --- */}
        <Route
          path="/client"
          element={
            <ProtectedRoute role="client">
              <DashboardClient />
            </ProtectedRoute>
          }
        />

        {/* /client/house/:houseId */}
        <Route
          path="/client/house/:houseId"
          element={
            <ProtectedRoute role="client">
              <ManageHouse />
            </ProtectedRoute>
          }
        />

        {/* --- RUTA POR DEFECTO --- */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
