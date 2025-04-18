import { useCallback } from "react";
import { usePaymentMethodStore } from "./store";

export const usePaymentMethods = () => {
  const paymentMethods = usePaymentMethodStore((state) => state.paymentMethods);
  const isLoading = usePaymentMethodStore((state) => state.isLoading);
  const error = usePaymentMethodStore((state) => state.error);

  return {
    paymentMethods,
    isLoading,
    error,
  };
};

export const useSelectedPaymentMethod = () => {
  const selectedPaymentMethod = usePaymentMethodStore((state) => state.selectedPaymentMethod);
  const selectPaymentMethod = usePaymentMethodStore((state) => state.selectPaymentMethod);

  const setSelectedPaymentMethod = useCallback(
    (id: string) => {
      selectPaymentMethod(id);
    },
    [selectPaymentMethod]
  );

  return {
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  };
};
