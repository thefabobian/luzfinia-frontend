import api from "../../../api/api";

export const AdminService = {
  async getHousesCount() {
    const res = await api.get("/houses/all");
    return res.data.length;
  },

  async getAppliancesCount() {
    const res = await api.get("/appliances/models");
    return res.data.length;
  },

  async getUsersCount() {
    const res = await api.get("/users");
    return res.data.length;
  },

  async getTotalConsumption() {
    // Obtener todas las casas y sumar su consumo total
    const res = await api.get("/houses/all");
    if (Array.isArray(res.data)) {
      const total = res.data.reduce((acc, house) => acc + (house.totalConsumption || 0), 0);
      return total.toFixed(2);
    }
    return "0.00";
  },

  async getUsers() {
    const res = await api.get("/users");
    return res.data;
  },
};
