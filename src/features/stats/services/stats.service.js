import api from "../../../api/api";

export const StatsService = {
  async getHouses() {
    const res = await api.get("/houses/all");
    return res.data;
  },

  async getConsumption(houseId) {
    const res = await api.get(`/readings/house/${houseId}/consumption`);
    return res.data;
  },

  async getProfile(houseId) {
    const res = await api.get(`/readings/house/${houseId}/profile`);
    return res.data;
  },

  async getStats(houseId, period = "month") {
    const res = await api.get(`/readings/house/${houseId}/stats?period=${period}`);
    return res.data;
  },
};
