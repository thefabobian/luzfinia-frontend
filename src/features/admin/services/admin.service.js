import api from "../../../api/api";

export const AdminService = {
  async getHousesCount() {
    const res = await api.get("/houses");
    return res.data.length;
  },

  async getAppliancesCount() {
    const res = await api.get("/appliances");
    return res.data.length;
  },

  async getUsersCount() {
    const res = await api.get("/users");
    return res.data.length;
  },

  // Ejemplo de consumo total (si tienes endpoint real lo adaptamos luego)
  async getTotalConsumption() {
    const res = await api.get("/readings"); // o algún endpoint global
    if (Array.isArray(res.data)) {
      const total = res.data.reduce((acc, r) => acc + (r.kwh || 0), 0);
      return total.toFixed(2);
    }
    return 0;
  },
};
