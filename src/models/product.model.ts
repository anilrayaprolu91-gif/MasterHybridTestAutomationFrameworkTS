export interface Brand {
  id: string;
  name: string;
  slug: string;
}

export interface Category {
  id: string;
  parent_id?: string | null;
  name: string;
  slug: string;
  sub_categories?: Category[];
}

export interface Image {
  id: string;
  by_name?: string;
  by_url?: string;
  source_name?: string;
  source_url?: string;
  file_name?: string;
  title?: string;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  spec_name: string;
  spec_value: string;
  spec_unit?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  is_location_offer?: boolean;
  is_rental?: boolean;
  in_stock?: boolean;
  co2_rating?: string;
  is_eco_friendly?: boolean;
  brand?: Brand;
  category?: Category;
  product_image?: Image;
}

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  brand_id?: string;
  product_image_id?: string;
  is_location_offer?: boolean;
  is_rental?: boolean;
  co2_rating?: string;
}
