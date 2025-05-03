// User related types
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  rights?: Right[];
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  isUser: boolean;
  isadmin: boolean;
}

export interface LoginResponse {
  status: number;
  message: string;
  success: boolean;
  id?: number;
  jwttoken?: string;
  email?: string;
  username?: string;
  role?: string;
  isadmin?: boolean;
  rights?: Right[];
}

export interface SignInResponse {
  status: number;
  message: string;
  token?: string;
  isUser?: boolean;
  name?: string;
  email?: string;
  id?: number;
  isadmin?: boolean;
}

// types/api.types.ts
export interface Product {
  id: string; // Changed from number to string for UUID
  productName: string;
  productDescription: string;
  OriginalPricePak: number;
  discountOfferinPak: number;
  PriceAfterDiscountPak: number;
  IsDiscountedProductInPak: boolean;
  OriginalPriceUSA: number;
  discountOfferinUSA: number;
  PriceAfterDiscountUSA: number;
  IsDiscountedProductInUSA: boolean;
  quantityForUSA: number;
  quantityForPak: number;
  SKUPak: string;
  SKUUSA: string;
  productheight: number;
  productwidth: number;
  productweight: number;
  productlength: number;
  productTags: string;
  showOnHomeScreen: boolean;
  whereToShow: string;
  discountAtOnce: number;
  categoryId: string; // Changed from number to string for UUID
  ProductImages?: ProductImage[];
  Category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id?: string;
  productId?: string;
  imageUrl: string;
}

export interface Category {
  id: string; // Changed from number to string for UUID
  categoryName: string;
  categoryDescription: string;
}

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
}

// Qurbani related types
export interface Qurbani {
  id: number;
  qurbaniName: string;
  qurbaniDescription: string;
  qurbaniPricePak: number;
  qurbaniPriceUSA: number;
  qurbaniDate: string;
  qurbaniQuantity: number;
  qurbaniImages?: QurbaniImage[];
}

export interface QurbaniImage {
  id: number;
  qurbaniId: number;
  imageUrl: string;
}

// Order related types
export interface Order {
  id: number;
  customerId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  country: string;
  OrderItems?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  Product?: Product;
}

// Coupon related types
export interface Coupon {
  id: number;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
}

// Rights and Roles types
export interface Right {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  rights: Right[];
}

// API response types
export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Dashboard related types
export interface DashboardStats {
  totalOrders: number;
  totalSales: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  topSellingProducts: Product[];
} 