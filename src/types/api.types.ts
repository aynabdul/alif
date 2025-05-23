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
  id: number | string;
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

// export interface ApiResponse<T> {
//   status: number;
//   success: boolean;
//   message: string;
//   data?: T;
// }

// Qurbani related types
export interface Qurbani {
  id: number | string;
  title: string;
  subtitle: string;
  description: string;
  showinwhichpage: string;
  catagory: string;
  priceforpak: number;
  endpriceforpak: number;
  priceforus: number;
  endpriceforus: number;
  skunopak: string;
  skunous: string;
  countrySelection: string;
  qurbaniImages?: QurbaniImage[];
  // Keep backward compatibility with existing code
  qurbaniName?: string;
  qurbaniDescription?: string;
  qurbaniPricePak?: number;
  qurbaniPriceUSA?: number;
  qurbaniDate?: string;
  qurbaniQuantity?: number;
  QurbaniImages?: QurbaniImage[]; // Backend returns Pascal case
}

export interface QurbaniImage {
  id: number | string;
  qurbaniId: number | string;
  imageUrl: string;
}

// Order related types
export interface Order {
  id: number | string;
  customerId: number | string;
  orderDate?: string;
  createdAt?: string; // Alternative for orderDate
  status: string;
  totalAmount?: number; // Keeping for backward compatibility
  totalPrice?: number | string; // Added to match API response
  totalQuantity?: number;
  country?: string;
  // Payment fields
  paymentStatus?: string;
  paymentSessionId?: string | null;
  transactionId?: string | null;
  authcode?: string | null;
  // Address fields
  city?: string | null;
  street?: string | null;
  postcodeZip?: string | null;
  // Timestamps
  updatedAt?: string;
  // Related items
  OrderItems?: OrderItem[];
}

export interface OrderItem {
  id?: string; // Made optional
  orderId?: string; // Made optional  
  productId: number | string | null;
  quantity: number;
  price: number | string;
  // Qurbani related fields
  qurbaniId?: string | null;
  EidHour?: string | null;
  Eidday?: string | null;
  isQurbani?: boolean;
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  // Related entities
  Product?: Product | null;
  Qurbani?: {
    id: string;
    title: string;
  } | null;
}

// Coupon related types
export interface Coupon {
  id: string;
  code: string;
  discount: number;
  expiryDate?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export interface StripeCheckoutResponse {
  sessionId: string; // Client secret for PaymentIntent
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

export interface Slaughts {
  id: string;
  day1Pak: number;
  day1USA: number;
  day2Pak: number;
  day2USA: number;
  day3Pak: number;
  day3USA: number;
  createdAt: string;
  updatedAt: string;
}

export interface SlaughtTime {
  id: string;
  eidDay: 'day1USA' | 'day2USA' | 'day3USA';
  hour: string;
  totalQuota: number;
  createdAt: string;
  updatedAt: string;
}

export interface SlaughtsResponse {
  success: boolean;
  data: Slaughts;
}

export interface SlaughtTimeResponse {
  success: boolean;
  data: SlaughtTime[];
}

export interface CheckoutUserResponse<T> {
  success: boolean;
  message?: string;
  customer?: T;
}

export interface OrderPayload {
  customerEmail: string;
  customerId: string;
  items: OrderItem[];
  country: 'PK' | 'USA';
  discount: number;
}

export interface PaymentSessionResponse {
  sessionId: string;
  checkoutMode?: string;
  merchant?: string;
  result?: string;
  successIndicator?: string;
}