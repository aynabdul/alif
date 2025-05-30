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
  Customer,
  CheckoutUserResponse,
  OrderPayload,
  PaymentSessionResponse,
  PaymentIntentResponse,
  DashboardStats,
  PaginatedResponse,
  Slaughts,
  SlaughtTime,
  SlaughtsResponse,
  SlaughtTimeResponse,
  StripeCheckoutResponse
} from '../types/api.types';

// Define response type for password reset operations
interface PasswordResetResponse {
  message: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error handling helper (unchanged)
const handleApiError = (error: AxiosError): never => {
  let errorMessage = 'Unknown error occurred';
  
  if (!error.response) {
    if (error.request) {
      errorMessage = 'Network Error: Server is unreachable or not responding';
      console.error('Network Error Details:', {
        config: error.config,
        message: error.message
      });
    } else {
      errorMessage = `Request Error: ${error.message}`;
    }
  } else if (error.response.data) {
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
      const nameParts = name.trim().split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      const response: AxiosResponse<ApiResponse<any>> = await api.post(ENDPOINTS.SIGNUP, { 
        name: firstName,
        lastName,
        email,
        password,
        phone
      });
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
forgetPassword: async (email: string): Promise<ApiResponse<PasswordResetResponse>> => {
  try {
    const response: AxiosResponse<{ message: string }> = await api.post(ENDPOINTS.SEND_RESET_CODE, { email });
    
    // Map backend response to ApiResponse<PasswordResetResponse>
    return {
      status: response.status,
      success: response.data.message === 'Reset code sent to email',
      message: response.data.message,
      data: { message: response.data.message },
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    
    // Handle 404 specifically
    if (axiosError.response?.status === 404 && axiosError.response?.data?.message === 'Customer not found') {
      return {
        status: 404,
        success: false,
        message: 'Customer not found',
        data: { message: 'Customer not found' },
      };
    }

    // Handle other unexpected errors
    return handleApiError(axiosError);
  }
},
  
  verifyOtpCode: async (email: string, code: string): Promise<ApiResponse<PasswordResetResponse>> => {
    try {
      const response: AxiosResponse<ApiResponse<PasswordResetResponse>> = await api.post(ENDPOINTS.VERIFY_RESET_CODE, { email, code });
      if (response.data.message === 'Code verified successfully') {
        await AsyncStorage.setItem('resetCodeVerified', 'true');
      }
      return response.data;
    } catch (error) {
      return handleApiError(error as AxiosError);
    }
  },
  
  changePassword: async (email: string, newPassword: string): Promise<ApiResponse<PasswordResetResponse>> => {
    try {
      const response: AxiosResponse<ApiResponse<PasswordResetResponse>> = await api.post(ENDPOINTS.RESET_PASSWORD, { email, newPassword });
      if (response.data.message === 'Password reset successful') {
        await AsyncStorage.removeItem('resetCodeVerified');
      }
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
    await AsyncStorage.removeItem('resetCodeVerified'); // Clear reset flag on logout
  },
  
  checkAndRefreshToken: async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('userId');
      
      if (!token || !userId) {
        console.log('No token or user ID found, refresh needed');
        return false;
      }
      
      const response = await api.get(ENDPOINTS.CUSTOMER_PROFILE(userId), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
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

// Slaughter Services
export const slaughterService = {
  getSlaughts: async (): Promise<ApiResponse<Slaughts>> => {
    try {
      console.log('Calling API: getSlaughts');
      const response: AxiosResponse<SlaughtsResponse> = await api.get(ENDPOINTS.SLAUGHTS);
      console.log('Slaughts Response:', response.data);
      return {
        success: response.data.success,
        status: 200,
        message: 'Slaughter days fetched successfully',
        data: response.data.data
      };
    } catch (error) {
      console.error('GetSlaughts Error:', error);
      return handleApiError(error as AxiosError);
    }
  },

  getSlaughtTimes: async (): Promise<ApiResponse<SlaughtTime[]>> => {
    try {
      console.log('Calling API: getSlaughtTimes');
      const response: AxiosResponse<SlaughtTimeResponse> = await api.get(ENDPOINTS.SLAUGHTTIME);
      console.log('SlaughtTimes Response:', response.data);
      return {
        success: response.data.success,
        status: 200,
        message: 'Slaughter time slots fetched successfully',
        data: response.data.data
      };
    } catch (error) {
      console.error('GetSlaughtTimes Error:', error);
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

// Coupon Services
export const couponService = {
  getCoupons: async (): Promise<ApiResponse<Coupon[]>> => {
    try {
      console.log('Calling API: getCoupons');
      const response: AxiosResponse<ApiResponse<Coupon[]>> = await api.get(ENDPOINTS.COUPONS);
      console.log('Coupons Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('GetCoupons Error:', error);
      return handleApiError(error as AxiosError);
    }
  },
  
  getCouponById: async (id: number | string): Promise<ApiResponse<Coupon>> => {
    try {
      console.log('Calling API: getCouponById', id);
      const response: AxiosResponse<ApiResponse<Coupon>> = await api.get(ENDPOINTS.COUPON(id));
      console.log('Coupon Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('GetCouponById Error:', error);
      return handleApiError(error as AxiosError);
    }
  }
};

// Order Payment Services
export const orderPaymentService = {
  checkoutUser: async (customerData: any): Promise<CheckoutUserResponse<Customer>> => {
    try {
      console.log('Creating customer:', customerData);
      const response: AxiosResponse<CheckoutUserResponse<Customer>> = await api.post(ENDPOINTS.CHECKOUT_USER, customerData);
      console.log('Customer created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Customer creation failed:', error);
      return handleApiError(error as AxiosError);
    }
  },

  createOrderInDB: async (orderData: any): Promise<ApiResponse<Order>> => {
    try {
      console.log('Creating order:', orderData);
      const response: AxiosResponse<ApiResponse<Order>> = await api.post(ENDPOINTS.CREATE_ORDER_IN_DB, orderData);
      console.log('Order created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Order creation failed:', error);
      return handleApiError(error as AxiosError);
    }
  },

createPaymentSession: async (payload: OrderPayload): Promise<ApiResponse<PaymentSessionResponse>> => {
    try {
      console.log('Calling createPaymentSession:', ENDPOINTS.CREATE_PAYMENT_SESSION, JSON.stringify(payload, null, 2));
      const response: AxiosResponse = await api.post(ENDPOINTS.CREATE_PAYMENT_SESSION, payload);
      console.log('Raw createPaymentSession response:', JSON.stringify(response.data, null, 2));
      
      // Map raw response to PaymentSessionResponse
      const rawData = response.data;
      const mappedData: PaymentSessionResponse = {
        sessionId: rawData.session?.id || '',
        checkoutMode: rawData.checkoutMode,
        merchant: rawData.merchant,
        result: rawData.result,
        successIndicator: rawData.successIndicator,
      };

      const apiResponse: ApiResponse<PaymentSessionResponse> = {
        status: response.status,
        success: true,
        message: 'Payment session created successfully',
        data: mappedData,
      };

      console.log('createPaymentSession response:', JSON.stringify(apiResponse, null, 2));
      return apiResponse;
    } catch (error) {
      console.error('Payment session creation failed:', error);
      return handleApiError(error as AxiosError);
    }
  },


  handleStripeCheckout: async (payload: OrderPayload): Promise<ApiResponse<StripeCheckoutResponse>> => {
    try {
      console.log('Initiating Stripe checkout:', JSON.stringify(payload, null, 2));
      const response: AxiosResponse = await api.post(ENDPOINTS.STRIPE_CHECKOUT, payload);
      console.log('Raw Stripe checkout response:', JSON.stringify(response.data, null, 2));

      const rawData = response.data;
      const mappedData: StripeCheckoutResponse = {
        sessionId: rawData.sessionId || '',
      };

      const apiResponse: ApiResponse<StripeCheckoutResponse> = {
        status: response.status,
        success: rawData.success || false,
        message: rawData.success ? 'Stripe checkout initiated successfully' : 'Failed to initiate Stripe checkout',
        data: mappedData,
      };

      console.log('Stripe checkout response:', JSON.stringify(apiResponse, null, 2));
      return apiResponse;
    } catch (error) {
      console.error('Stripe checkout failed:', error);
      return handleApiError(error as AxiosError);
    }
  },
createPaymentIntent: async (payload: OrderPayload): Promise<ApiResponse<PaymentIntentResponse>> => {
  try {
    console.log('Initiating Payment Intent:', JSON.stringify(payload, null, 2));
    const response: AxiosResponse = await api.post(ENDPOINTS.CREATE_PAYMENT_INTENT, payload);
    console.log('Raw Payment Intent response:', JSON.stringify(response.data, null, 2));

    const rawData = response.data;
    const mappedData: PaymentIntentResponse = {
      clientSecret: rawData.clientSecret || '', // Access directly from rawData
      orderId: rawData.orderId || '', // Access directly from rawData
    };

    const apiResponse: ApiResponse<PaymentIntentResponse> = {
      status: response.status,
      success: rawData.success || false,
      message: rawData.success ? 'Payment Intent created successfully' : 'Failed to create Payment Intent',
      data: mappedData,
    };

    console.log('Payment Intent response:', JSON.stringify(apiResponse, null, 2));
    return apiResponse;
  } catch (error) {
    console.error('Payment Intent creation failed:', error);
    return handleApiError(error as AxiosError);
  }
},
    createCashOnDelivery: async (payload: OrderPayload): Promise<ApiResponse<{ message: string }>> => {
    try {
      console.log('Calling createCashOnDelivery:', ENDPOINTS.CASH_ON_DELIVERY, JSON.stringify(payload, null, 2));
      const response: AxiosResponse<ApiResponse<{ message: string }>> = await api.post(ENDPOINTS.CASH_ON_DELIVERY, payload);
      console.log('createCashOnDelivery response:', JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error('COD order processing failed:', error);
      return handleApiError(error as AxiosError);
    }
  },
};
