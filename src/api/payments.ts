import type { Payment } from '../types/payment'
import api from './client';

export const getPayments = async (): Promise<Payment[]> => {
  const response = await api.get('/payments/list');
  return response.data.data
};