import { API_BASE_URL, ENDPOINTS } from '../config/api';
import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  LoginResponse, 
  SignInResponse, 
  ApiResponse, 
  Product, 
  Category,
  Qurbani,
  User,
  Order,
  Coupon,
  DashboardStats,
  PaginatedResponse
} from '../types/api.types';



const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling helper
const handleApiError = (error: AxiosError): never => {
  let errorMessage = 'Unknown error occurred';
  
  // Handle different types of errors
  if (!error.response) {
    // Network error - no response received
    if (error.request) {
      errorMessage = 'Network Error: Server is unreachable or not responding';
      console.error('Network Error Details:', {
        config: error.config,
        message: error.message
      });
    } else {
      // Request setup error
      errorMessage = `Request Error: ${error.message}`;
    }
  } else if (error.response.data) {
    // Try to extract message from response data
    const responseData = error.response.data as any;
    if (typeof responseData === 'object' && responseData.message) {
      errorMessage = `Server Error (${error.response.status}): ${responseData.message}`;
    } else {
      errorMessage = `Server Error (${error.response.status})`;
    }
    console.error('API Response Error:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    });
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  console.error('API Error:', errorMessage);
  throw new Error(errorMessage);
};

// Auth Services
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post(ENDPOINTS.LOGIN, { email, password });
      
      if (response.data.success && response.data.jwttoken) {
        await AsyncStorage.setItem('userToken', response.data.jwttoken);
        await AsyncStorage.setItem('userId', String(response.data.id));
        await AsyncStorage.setItem('userRole', response.data.role || '');
      }
      
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  signIn: async (email: string, password: string): Promise<SignInResponse> => {
    try {
      const response: AxiosResponse<SignInResponse> = await api.post(ENDPOINTS.SIGNIN, { email, password });
      
      if (response.data.token) {
        await AsyncStorage.setItem('userToken', response.data.token);
        await AsyncStorage.setItem('userId', String(response.data.id));
        await AsyncStorage.setItem('isAdmin', String(response.data.isadmin));
      }
      
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  signUp: async (name: string, email: string, password: string, phone: string = ""): Promise<ApiResponse<any>> => {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post(ENDPOINTS.SIGNUP, { 
        name, 
        email, 
        password,
        phone 
      });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('isAdmin');
  },
  
  getUserProfile: async (userId: number): Promise<ApiResponse<User>> => {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await api.get(`${ENDPOINTS.USERS}/${userId}`);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

// Product Services
export const productService = {
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    try {
      console.log('Calling API: getProducts with URL:', `${API_BASE_URL}${ENDPOINTS.PRODUCTS}`);
      const response: AxiosResponse = await api.get(ENDPOINTS.PRODUCTS);
      console.log('Products Response:', response.data);
      return {
        status: response.data.status,
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error('GetProducts Error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    try {
      console.log('Calling API: getProductById with URL:', `${API_BASE_URL}${ENDPOINTS.PRODUCT(id)}`);
      const response: AxiosResponse = await api.get(ENDPOINTS.PRODUCT(id));
      console.log('ProductById Response:', response.data);
      return {
        status: response.data.status,
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.error('GetProductById Error:', error);
      return handleApiError(error as AxiosError);
    }
  },
  
  createProduct: async (productData: FormData): Promise<ApiResponse<Product>> => {
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await api.post(
        ENDPOINTS.CREATE_PRODUCT, 
        productData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  updateProduct: async (id: string, productData: FormData): Promise<ApiResponse<Product>> => {
    try {
      const response: AxiosResponse<ApiResponse<Product>> = await api.put(
        ENDPOINTS.UPDATE_PRODUCT(id), 
        productData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  deleteProduct: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await api.delete(ENDPOINTS.DELETE_PRODUCT(id));
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

export const categoryService = {
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    try {
      console.log('Calling API: getCategories with URL:', `${API_BASE_URL}${ENDPOINTS.CATEGORIES}`);
      const response: AxiosResponse = await api.get(ENDPOINTS.CATEGORIES);
      console.log('Categories Response:', response);
      return {
        status: response.data.status,
        success: true,
        message: response.data.message,
        data: response.data.categories
      };
    } catch (error) {
      console.error('GetCategories Error:', error);
      return handleApiError(error as AxiosError);
    }
  },
};

// Qurbani Services
export const qurbaniService = {
  getQurbanis: async (): Promise<ApiResponse<Qurbani[]>> => {
    try {
      const response: AxiosResponse<ApiResponse<Qurbani[]>> = await api.get(ENDPOINTS.QURBANIS);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  getQurbaniById: async (id: number): Promise<ApiResponse<Qurbani>> => {
    try {
      const response: AxiosResponse<ApiResponse<Qurbani>> = await api.get(ENDPOINTS.QURBANI(id));
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

// Order Services
export const orderService = {
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    try {
      const response: AxiosResponse<ApiResponse<Order[]>> = await api.get(ENDPOINTS.ORDERS);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  getOrderById: async (id: number): Promise<ApiResponse<Order>> => {
    try {
      const response: AxiosResponse<ApiResponse<Order>> = await api.get(ENDPOINTS.ORDER(id));
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  createOrder: async (orderData: any): Promise<ApiResponse<Order>> => {
    try {
      const response: AxiosResponse<ApiResponse<Order>> = await api.post(ENDPOINTS.CREATE_ORDER, orderData);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

// Dashboard Services
export const dashboardService = {
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const response: AxiosResponse<ApiResponse<DashboardStats>> = await api.get(ENDPOINTS.DASHBOARD);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
};

// Coupon Services
export const couponService = {
  getCoupons: async (): Promise<ApiResponse<Coupon[]>> => {
    try {
      const response: AxiosResponse<ApiResponse<Coupon[]>> = await api.get(ENDPOINTS.COUPONS);
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  verifyCoupon: async (code: string): Promise<ApiResponse<Coupon>> => {
    try {
      const response: AxiosResponse<ApiResponse<Coupon>> = await api.post(ENDPOINTS.VERIFY_COUPON, { code });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
}; 