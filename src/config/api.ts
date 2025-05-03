import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';

const isDevelopment = __DEV__;

const getDevBaseUrl = () => {
  return 'http://192.168.0.106:5000/api'; // Confirm this IP
};

export const API_BASE_URL = isDevelopment
  ? getDevBaseUrl()
  : 'https://your-production-api.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('userToken');
    }
    return Promise.reject(error);
  }
);

export const ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
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
  QURBANI: (id: number) => `/qurbani/qurbani/${id}`,
  CREATE_QURBANI: '/qurbani/create-qurbani',
  UPDATE_QURBANI: (id: number) => `/qurbani/update-qurbani/${id}`,
  DELETE_QURBANI: (id: number) => `/qurbani/delete-qurbani/${id}`,
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
};

export default api;