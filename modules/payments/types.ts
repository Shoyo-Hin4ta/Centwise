export interface PaymentMethod {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isDefault?: boolean;
}

export interface PaymentMethodState {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  isLoading: boolean;
  error: string | null;
}
