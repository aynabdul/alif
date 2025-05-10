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
  timeout: 20000,
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
      // Split the full name into first and last name for the backend
      // If name only has one word, use it as first name and leave lastName empty
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      const response: AxiosResponse<ApiResponse<any>> = await api.post(ENDPOINTS.SIGNUP, { 
        name: firstName, // Use first name as name
        lastName,         // Send last name separately
        email,
        password,
        phone
      });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  resetPassword: async (email: string): Promise<ApiResponse<any>> => {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post(ENDPOINTS.SEND_RESET_CODE, { email });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  verifyResetCode: async (email: string, code: string): Promise<ApiResponse<any>> => {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post(ENDPOINTS.VERIFY_RESET_CODE, { email, code });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  setNewPassword: async (email: string, newPassword: string): Promise<ApiResponse<any>> => {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await api.post(ENDPOINTS.RESET_PASSWORD, { email, newPassword });
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
  
  // Check if token is valid and refresh if needed
  checkAndRefreshToken: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      
      if (!token || !userId) {
        console.log('No token or user ID found, refresh needed');
        return false;
      }
      
      // Try a simple API call to verify token
      const response = await api.get(ENDPOINTS.CUSTOMER_PROFILE(userId), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // If successful, token is still valid
      if (response.status === 200) {
        console.log('Token is valid');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
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
      console.log('Calling API: getQurbanis');
      const response = await api.get(ENDPOINTS.QURBANIS);
      
      // Handle case where response is directly an array instead of an ApiResponse object
      if (Array.isArray(response.data)) {
        console.log('Received array response with', response.data.length, 'qurbanis');
        return {
          success: true,
          status: 200,
          message: 'Qurbanis fetched successfully',
          data: response.data.map((item: any) => ({
            id: item.id || '',
            title: item.title || '',
            subtitle: item.subtitle || '',
            description: item.description || '',
            showinwhichpage: item.showinwhichpage || '',
            catagory: item.catagory || '',
            priceforpak: Number(item.priceforpak || 0),
            endpriceforpak: Number(item.endpriceforpak || item.priceforpak || 0),
            priceforus: Number(item.priceforus || 0),
            endpriceforus: Number(item.endpriceforus || item.priceforus || 0),
            skunopak: item.skunopak || '',
            skunous: item.skunous || '',
            countrySelection: item.countrySelection || 'all',
            qurbaniImages: item.qurbaniImages || item.QurbaniImages || [],
            createdAt: item.createdAt || '',
            updatedAt: item.updatedAt || ''
          }))
        };
      }
      
      // If response is already in ApiResponse format
      console.log('Qurbanis response:', response.data);
      
      // Make sure data has all required fields
      if (response.data.data && Array.isArray(response.data.data)) {
        response.data.data = response.data.data.map((item: any) => ({
          id: item.id || '',
          title: item.title || '',
          subtitle: item.subtitle || '',
          description: item.description || '',
          showinwhichpage: item.showinwhichpage || '',
          catagory: item.catagory || '',
          priceforpak: Number(item.priceforpak || 0),
          endpriceforpak: Number(item.endpriceforpak || item.priceforpak || 0),
          priceforus: Number(item.priceforus || 0),
          endpriceforus: Number(item.endpriceforus || item.priceforus || 0),
          skunopak: item.skunopak || '',
          skunous: item.skunous || '',
          countrySelection: item.countrySelection || 'all',
          qurbaniImages: item.qurbaniImages || item.QurbaniImages || [],
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || ''
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error('GetQurbanis Error:', error);
      // Return empty data array instead of throwing an error
      return {
        success: false,
        status: 500,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: [] // Return empty array instead of null
      };
    }
  },
  
  getQurbaniById: async (id: number | string): Promise<ApiResponse<Qurbani>> => {
    try {
      console.log('Calling API: getQurbaniById', id, 'Type:', typeof id);
      console.log('Full URL:', `${API_BASE_URL}${ENDPOINTS.QURBANI(id)}`);
      const response = await api.get(ENDPOINTS.QURBANI(id));
      
      // Handle case where response is directly a qurbani object instead of ApiResponse
      if (response.data && !response.data.success && (response.data.id || response.data._id)) {
        const qurbaniData = response.data;
        // Add missing fields with defaults
        const processedData = {
          ...qurbaniData,
          endpriceforpak: qurbaniData.endpriceforpak || qurbaniData.priceforpak || 0,
          endpriceforus: qurbaniData.endpriceforus || qurbaniData.priceforus || 0,
          countrySelection: qurbaniData.countrySelection || 'all'
        };
        
        console.log('Received direct qurbani object response');
        return {
          success: true,
          status: 200,
          message: 'Qurbani fetched successfully',
          data: processedData
        };
      }
      
      // If response is already in ApiResponse format, ensure data has all fields
      if (response.data && response.data.data) {
        response.data.data = {
          ...response.data.data,
          endpriceforpak: response.data.data.endpriceforpak || response.data.data.priceforpak || 0,
          endpriceforus: response.data.data.endpriceforus || response.data.data.priceforus || 0,
          countrySelection: response.data.data.countrySelection || 'all'
        };
      }
      
      console.log('QurbaniById response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('GetQurbaniById Error:', error);
      if (error instanceof AxiosError && error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
        console.error('Headers:', JSON.stringify(error.response.headers, null, 2));
      }
      // Return empty object instead of throwing
      return {
        success: false,
        status: 500,
        message: error instanceof Error ? error.message : 'Unknown error',
        data: {} as Qurbani // Return empty object
      };
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
  
  getOrderHistory: async (customerId: string): Promise<{success: boolean, orders: Order[], message?: string}> => {
    try {
      console.log('Fetching order history for customer:', customerId);
      console.log('API URL:', `${API_BASE_URL}${ENDPOINTS.ORDER_HISTORY(customerId)}`);
      
      // Get token from AsyncStorage with better error handling
      const token = await AsyncStorage.getItem('userToken');
      
      // Validate token
      if (!token) {
        console.error('Authentication error: No token available');
        throw new Error('Authentication token not found');
      }
      
      console.log('Token available:', !!token);
      
      const response = await api.get(ENDPOINTS.ORDER_HISTORY(customerId), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Handle 404 "No orders found" as a valid response
      if (response.status === 404 || (response.data && response.data.message === "No orders found for this customer")) {
        console.log('No orders found for this customer - valid empty response');
        return {
          success: true,
          orders: [],
          message: "No orders found for this customer"
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Order History Error:', error);
      
      // Check if this is a "no orders found" response
      if (axios.isAxiosError(error) && error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        // Handle "no orders found" response
        if (error.response.status === 404 || 
            (error.response.data && error.response.data.message === "No orders found for this customer")) {
          console.log('No orders found for this customer - valid empty response');
          return {
            success: true,
            orders: [],
            message: "No orders found for this customer"
          };
        }
      }
      
      throw error;
    }
  }
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