import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import { handleUnauthorized } from '../utils/authUtils';

const isDevelopment = __DEV__;

const API_SERVER_IP = '192.168.10.6';
const API_SERVER_PORT = '5000';

const getDevBaseUrl = () => {
  return `http://${API_SERVER_IP}:${API_SERVER_PORT}`;
};

export const API_CONFIG = {
  serverIp: API_SERVER_IP,
  serverPort: API_SERVER_PORT,
  fullUrl: getDevBaseUrl(),
};

export const API_BASE_URL = isDevelopment
  ? getDevBaseUrl()
  : 'https://your-production-api.com/';

console.log('Using API URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout
});

api.interceptors.request.use(
  async (config) => {
    const netInfo = await NetInfo.fetch();
    console.log('NetInfo:', netInfo);
    if (!netInfo.isConnected) {
      return Promise.reject(new Error('No internet connection'));
    }

    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Added auth token to request');
    } else {
      console.log('No auth token available for request');
    }

    const fullUrl = `${config.baseURL || ''}${config.url || ''}`;
    console.log(`API Request: ${config.method?.toUpperCase() || 'UNKNOWN'} ${fullUrl}`);

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response from ${response.config.url}:`, response.status);
    return response;
  },
  async (error) => {
    console.error('API Error Response:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });

    if (error.response && error.response.status === 401) {
      console.log('Authentication failed (401) - Handling unauthorized');
      await handleUnauthorized();
    }

    return Promise.reject(error);
  }
);

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  RESET_PASSWORD: '/auth/reset-password',
  SEND_RESET_CODE: '/auth/forgot-password',
  VERIFY_RESET_CODE: '/auth/verify-code',
  USERS: '/auth/users',
  PRODUCTS: '/products/products',
  PRODUCT: (id: string) => `/products/product/${id}`,
  CREATE_PRODUCT: '/products/create-product',
  UPDATE_PRODUCT: (id: string) => `/products/update-product/${id}`,
  DELETE_PRODUCT: (id: string) => `/products/delete-product/${id}`,
  CATEGORIES: '/categories/catagories',
  CATEGORY: (id: string) => `/categories/catagory/${id}`,
  CREATE_CATEGORY: '/categories/create-catagory',
  UPDATE_CATEGORY: (id: number) => `/categories/update-catagory/${id}`,
  DELETE_CATEGORY: (id: number) => `/categories/delete-catagory/${id}`,
  QURBANIS: '/qurbani/qurbanis',
  QURBANI: (id: number | string) => `/qurbani/qurbani/${id}`,
  CREATE_QURBANI: '/qurbani/create-qurbani',
  UPDATE_QURBANI: (id: number | string) => `/qurbani/update-qurbani/${id}`,
  DELETE_QURBANI: (id: number | string) => `/qurbani/delete-qurbani/${id}`,
  ORDERS: '/orders',
  ORDER: (id: number) => `/order/${id}`,
  CREATE_ORDER: '/create-order',
  UPDATE_ORDER: (id: number) => `/update-order/${id}`,
  DASHBOARD: '/dashboard',
  COUPONS: '/coupons',
  VERIFY_COUPON: '/verify-coupon',
  CREATE_COUPON: '/create-coupon',
  UPDATE_COUPON: (id: number) => `/update-coupon/${id}`,
  DELETE_COUPON: (id: number) => `/delete-coupon/${id}`,
  USER_ROLES: '/user-roles',
  CREATE_ROLE: '/create-role',
  UPDATE_ROLE: (id: number) => `/update-role/${id}`,
  DELETE_ROLE: (id: number) => `/delete-role/${id}`,
  RIGHTS: '/rights',
  USER_DASHBOARD: '/userdashboard',
  ORDER_HISTORY: (customerId: string) => `/userdashboard/ordershistory/${customerId}`,
  CUSTOMER_PROFILE: (customerId: string) => `/userdashboard/customerbyId/${customerId}`,
  UPDATE_CUSTOMER: (customerId: string) => `/userdashboard/modifyphoneaddress/${customerId}`,
  CHANGE_PASSWORD: '/userdashboard/change-password',
};

export default api;