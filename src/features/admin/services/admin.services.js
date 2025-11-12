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

  // === Servicios para gestión de casas ===

  /**
   * Crear una nueva casa
   * @param {Object} houseData - Datos de la casa { name, description }
   * @returns {Promise<Object>} - Casa creada
   */
  async createHouse(houseData) {
    const res = await api.post("/houses", houseData);
    return res.data;
  },

  /**
   * Obtener todas las casas (solo admin)
   * @returns {Promise<Array>} - Lista de todas las casas
   */
  async getAllHouses() {
    const res = await api.get("/houses/all");
    return res.data;
  },

  /**
   * Obtener estadísticas de consumo de una casa en un periodo
   * @param {string} houseId - ID de la casa
   * @param {string} period - Periodo (day, week, month, year)
   * @returns {Promise<Object>} - Estadísticas de consumo
   */
  async getHouseConsumptionStats(houseId, period = "month") {
    const res = await api.get(`/readings/house/${houseId}/stats`, {
      params: { period },
    });
    return res.data;
  },
};
