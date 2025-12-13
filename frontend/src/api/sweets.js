import apiClient from './client';

export const sweetsApi = {
  getAll: async (search, minPrice, maxPrice) => {
    const params = {};
    if (search) params.search = search;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;
    const response = await apiClient.get('/sweets', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/sweets/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await apiClient.post('/sweets', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await apiClient.patch(`/sweets/${id}`, data);
    return response.data;
  },

  updateFull: async (id, data) => {
    const response = await apiClient.put(`/sweets/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/sweets/${id}`);
    return response.data;
  },

  purchase: async (id, quantity) => {
    const response = await apiClient.post(`/sweets/${id}/purchase`, {
      quantity,
    });
    return response.data;
  },

  restock: async (id, quantity) => {
    const response = await apiClient.post(`/sweets/${id}/restock`, {
      quantity,
    });
    return response.data;
  },
};

