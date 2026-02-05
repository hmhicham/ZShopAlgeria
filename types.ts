
export interface HeroContent {
  title: string;
  subtitle: string;
  image: string;
}

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_price?: number;
  category_id: number;
  stock_quantity: number;
  low_stock_threshold: number;
  sku: string;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  is_active: boolean;
  image?: string; // Derived from product_images (primary)
  images?: string[]; // All product images
  // UI Helper properties
  category?: string;
  stockStatus?: string;
  isNew?: boolean;
}

export interface ProductReview {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  user_name?: string; // Joined from users table
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface User {
  id: string; // Supabase Auth UUID
  db_id?: number; // Serial ID from public.users table
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  address?: string;
  created_at?: string;
}

export interface Discount {
  idx?: number;
  id: number;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed' | 'shipping';
  discount_value: string; // Changed to string as per user schema
  min_purchase_amount: string;
  max_discount_amount: string | null;
  usage_limit: number;
  usage_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  // UI Helper properties
  percentage?: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: string;
  subtotal: number;
  total: number;
  shipping_address: string;
  date: string;
  items?: any[];
}

export type View =
  | 'home'
  | 'wishlist'
  | 'orders'
  | 'checkout'
  | 'product-detail'
  | 'login'
  | 'register'
  | 'profile'
  | 'admin-dashboard'
  | 'admin-inventory'
  | 'admin-orders'
  | 'admin-analytics'
  | 'admin-categories'
  | 'admin-discounts'
  | 'admin-add-product'
  | 'admin-edit-product'
  | 'admin-users';
