
export type Category = {
  id: number;
  name: string;
};

export type PizzaPrice = Record<'10"' | '12"' | '14"', number>;

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number | null; // Can be null if it's a pizza
  pizza_prices: PizzaPrice | null; // Can be null if it's not a pizza
  category_id: number;
  image_url: string;
  // This will be added on the client-side after fetching
  category?: Category;
}

export interface CartItem {
  id: string; // Unique ID for cart item, e.g., `${menuItem.id}-${size}`
  menuItem: MenuItem;
  quantity: number;
  customizations: {
    size?: '10"' | '12"' | '14"';
    stuffedCrust?: boolean;
    saltAndVinegar?: boolean;
  };
  unitPrice: number;
}

export type View = 'home' | 'menu' | 'contact' | 'admin-login' | 'admin';
export type AdminView = 'orders' | 'menu' | 'settings';

export type OrderStatus = 'New' | 'Preparing' | 'Ready for Collection' | 'Out for Delivery' | 'Completed' | 'Cancelled';
export type OrderType = 'collection' | 'delivery';
export type PaymentMethod = 'cash' | 'card';

export interface Customer {
    id?: string; // UUID from supabase
    name: string;
    address: string;
    phone: string;
    email: string;
}

export interface Order {
  id: number; // Order ID from supabase
  order_uid: string;
  created_at: string;
  customer: Customer;
  items: CartItem[]; // Will be populated by joining tables
  subtotal: number;
  delivery_charge: number;
  total: number;
  order_type: OrderType;
  payment_method: PaymentMethod;
  status: OrderStatus;
}
