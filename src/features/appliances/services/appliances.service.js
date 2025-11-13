import api from "../../../api/api";

export const AppliancesService = {
  // Obtener todos los modelos
  async getAllModels() {
    const res = await api.get("/appliances/models");
    return res.data;
  },

  // Crear modelo
  async createModel(data) {
    const res = await api.post("/appliances/models", data);
    return res.data;
  },

  // Editar modelo
  async updateModel(id, data) {
    const res = await api.put(`/appliances/models/${id}`, data);
    return res.data;
  },
};
