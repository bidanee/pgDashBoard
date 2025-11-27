import { create } from "zustand"
import api from "../api/client"
import type { CommonCodeItem, PaymentTypeItem } from "../types/commonCodes"

type CodeMap = Record<string,string>;

interface CodeState { 
  paymentStatus: CodeMap;
  paymentType: CodeMap;
  mchtStatus: CodeMap;
  lastFetchedAt: number | null;
  isLoading: boolean;
  loadCommonCodes: (force?: boolean) => Promise<void>;
}

export const useCodeStore = create<CodeState>()((set,get) => ({
  paymentStatus: {},
  paymentType: {},
  mchtStatus: {},
  lastFetchedAt:null,
  isLoading: false,
  loadCommonCodes: async (force = false) => {
    const {lastFetchedAt, isLoading} = get();

    const CACHE_TTL = 5 * 60 * 1000;

    if (!force && lastFetchedAt && Date.now() - lastFetchedAt < CACHE_TTL){
      return;
    }

    if (isLoading) return;

    set({isLoading: true});

    try{

      const [statusRes, typeRes, mchtRes] = await Promise.all([
        api.get<{ data: CommonCodeItem[] }>('/common/payment-status/all'),
        api.get<{ data: PaymentTypeItem[]}>('/common/paymemt-type/all'),
        api.get<{ data: CommonCodeItem[] }>('/common/mcht-status/all'),
      ]);
      
      const statusMap = Object.fromEntries(statusRes.data.data.map(({ code, description }) => [code, description]));
      const typeMap = Object.fromEntries(typeRes.data.data.map(({ type, description }) => [type, description]));
      const mchtMap = Object.fromEntries(mchtRes.data.data.map(({ code, description }) => [code, description]));

      set({
        paymentStatus: statusMap,
        paymentType: typeMap,
        mchtStatus: mchtMap,
        lastFetchedAt: Date.now(),
      });

      console.log('공통 코드 갱신 ')
    } catch(e){
      console.error('코드 로딩 실패 : ', e);
    } finally {
      set({isLoading: false});
    }
  },
}));