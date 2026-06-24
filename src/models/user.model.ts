export interface Address {
  street?: string;
  house_number?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
}

export interface UserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  address?: Address;
  phone?: string;
  dob?: string;
}

export interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  address?: Address;
  phone?: string | null;
  dob?: string;
  provider?: string | null;
  totp_enabled: boolean;
  enabled: boolean;
  failed_login_attempts?: number | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}
