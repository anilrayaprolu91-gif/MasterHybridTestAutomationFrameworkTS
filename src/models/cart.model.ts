export interface CreateCartResponse {
  id: string;
}

export interface AddItemToCartRequest {
  product_id: string;
  quantity: number;
}

export interface CartItem {
  id?: string;
  product_id: string;
  quantity: number;
}

export interface Cart {
  id: string;
  items?: CartItem[];
}
