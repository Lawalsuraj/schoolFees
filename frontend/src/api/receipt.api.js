import api from './axios.js';

export const getReceipt = (paymentId) => api.get(`/receipts/${paymentId}`);