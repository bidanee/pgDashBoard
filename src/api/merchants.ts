import type { Merchant, MerchantDetails } from "../types/merchants"
import api from "./client"



export const getMerchants = async (): Promise<Merchant[]> => {
  const response = await api.get("/merchants/list");
  return response.data.data;
}

export const getMerchantDetails = async (mchtCode: string): Promise<MerchantDetails> => {
  const res = await api.get<{ data: MerchantDetails }>(`/merchants/details/${mchtCode}`);
  return res.data.data;
};