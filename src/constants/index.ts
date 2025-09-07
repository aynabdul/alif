// API constants
export const API_TIMEOUT = 15000; // 15 seconds

// App defaults
export const DEFAULT_COUNTRY = 'us'; // Default country setting
export const DEFAULT_LANGUAGE = 'en'; // Default language setting

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Permissions
export const PERMISSIONS = {
  CAMERA: 'camera',
  MEDIA_LIBRARY: 'mediaLibrary',
  LOCATION: 'location',
};

// Screen names 
export const SCREENS = {
  // Auth
  WELCOME: 'Welcome',
  COUNTRY_SELECT: 'CountrySelect',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',
  
  // App
  HOME: 'Home',
  PRODUCTS: 'Products',
  PRODUCT_DETAILS: 'ProductDetails',
  CATEGORY_PRODUCTS: 'CategoryProducts',
  QURBANI: 'Qurbani',
  QURBANI_DETAILS: 'QurbaniDetails',
  CART: 'Cart',
  CHECKOUT: 'Checkout',
  ORDER_COMPLETE: 'OrderComplete',
  PROFILE: 'Profile',
  ORDER_HISTORY: 'OrderHistory',
  ORDER_DETAILS: 'OrderDetails',
  SETTINGS: 'Settings',
  EDIT_PROFILE: 'EditProfile',
  NOTIFICATIONS: 'Notifications',
  
  // Admin
  ADMIN_DASHBOARD: 'AdminDashboard',
  PRODUCT_MANAGEMENT: 'ProductManagement',
  ADD_PRODUCT: 'AddProduct',
  EDIT_PRODUCT: 'EditProduct',
  CATEGORY_MANAGEMENT: 'CategoryManagement',
  QURBANI_MANAGEMENT: 'QurbaniManagement',
  USER_MANAGEMENT: 'UserManagement',
  ORDER_MANAGEMENT: 'OrderManagement',
};

// Image placeholders
export const IMAGE_PLACEHOLDERS = {
  PRODUCT: 'https://via.placeholder.com/150',
  AVATAR: 'https://via.placeholder.com/100',
  CATEGORY: 'https://via.placeholder.com/200',
};

// Order statuses
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  AUTH_ERROR: 'Authentication error. Please log in again.',
  PERMISSION_DENIED: 'Permission denied.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  CART_DATA: 'cart_data',
  COUNTRY: 'selected_country',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
};

// Currency codes and symbols
export const CURRENCY = {
  USD: {
    code: 'USD',
    symbol: '$',
  },
  PKR: {
    code: 'PKR',
    symbol: '₨',
  },
}; 