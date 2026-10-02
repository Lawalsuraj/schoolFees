import api from './axios.js';

export const getAllFeeStructures = () => api.get('/fee-structures');

export const createFeeStructure = (data) => api.post('/fee-structures', data);

export const updateFeeStructure = (id, amount) =>
  api.patch(`/fee-structures/${id}`, { amount });

export const deleteFeeStructure = (id) => api.delete(`/fee-structures/${id}`);