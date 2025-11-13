import api from "../../../api/api";

export const HouseService = {
  // Ver casas disponibles (sin dueño)
  async getAvailableHouses() {
    const res = await api.get("/houses/available");
    return res.data;
  },

  // Ver casas del usuario autenticado
  async getMyHouses() {
    const res = await api.get("/houses/user");
    return res.data;
  },

  // Comprar una casa
  async purchaseHouse(houseId) {
    const res = await api.post("/houses/purchase", { houseId });
    return res.data;
  },
};
