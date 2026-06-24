export type PaymentMethod =
  | 'bank-transfer'
  | 'cash-on-delivery'
  | 'credit-card'
  | 'buy-now-pay-later'
  | 'gift-card';

export interface PaymentDetails {
  [key: string]: string | number | boolean | null | undefined;
}

export interface InvoiceRequest {
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_country: string;
  billing_postal_code: string;
  payment_method: PaymentMethod;
  payment_details: PaymentDetails;
  cart_id: string;
}

export interface InvoiceResponse {
  id: string;
  user_id: string;
  invoice_date: string;
  invoice_number: string;
  billing_street: string;
  billing_city: string;
  billing_country: string;
  billing_state: string;
  billing_postal_code: string;
  additional_discount_percentage?: number;
  additional_discount_amount?: number;
  subtotal?: number;
  total?: number;
  status?: string;
  status_message?: string;
  created_at?: string;
}
