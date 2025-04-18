import { create } from "zustand";
import { PaymentMethod, PaymentMethodState } from "./types";

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    name: "Cash",
    color: "#4CAF50",
    isDefault: true,
  },
  {
    id: "2",
    name: "Chase Sapphire",
    color: "#1e4a86",
  },
  {
    id: "3",
    name: "Bank of America",
    color: "#e31837",
  },
  {
    id: "4",
    name: "Amex Gold",
    color: "#f8d57e",
  },
];

export const usePaymentMethodStore = create<PaymentMethodState>((set, get) => ({
  paymentMethods: mockPaymentMethods,
  selectedPaymentMethod: mockPaymentMethods.find(pm => pm.isDefault) || null,
  isLoading: false,
  error: null,

  selectPaymentMethod: (id: string) => {
    const paymentMethod = get().paymentMethods.find(pm => pm.id === id);
    if (paymentMethod) {
      set({ selectedPaymentMethod: paymentMethod });
    }
  },
}));
