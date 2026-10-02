import api from './axios.js';

export const getAllFeeRecords = () => api.get('/fee-records');
export const generateFeeRecords = (feeStructureId) =>
  api.post('/fee-records/generate', { feeStructureId });

export const getMyFeeRecords = () => api.get('/fee-records/my-records');

export const deleteFeeRecord = (id) => api.delete(`/fee-records/${id}`);