import api from "../../../api/api";

export const ApplianceService = {
  // Ver catálogo de modelos globales (público)
  async getModels() {
    const res = await api.get("/appliances/models");
    return res.data;
  },

  // Asignar electrodoméstico a casa (cliente)
  async assignToHouse(houseId, applianceModelId, customName = "") {
    const res = await api.post("/appliances/assign", {
      houseId,
      applianceModelId,
      customName,
    });
    return res.data;
  },

  // Encender/Apagar electrodoméstico (cliente)
  async toggleAppliance(applianceId) {
    const res = await api.put(`/appliances/toggle/${applianceId}`);
    return res.data;
  },
};
