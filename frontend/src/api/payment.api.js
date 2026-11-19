import api from './axios.js';

export const initiatePayment = (feeRecordId) =>
  api.post('/payments/initiate', { feeRecordId });

export const getPaymentStatus = (reference) => api.get(`/payments/status/${reference}`);

export const getMyPayments = () => api.get('/payments/my-payments');