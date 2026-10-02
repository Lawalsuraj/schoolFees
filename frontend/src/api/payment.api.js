import api from './axios.js';

export const initiatePayment = (feeRecordId) =>
  api.post('/payments/initiate', { feeRecordId });