import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Product, Category, Qurbani } from './api.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Main Tab Parameter List
export type MainTabParamList = {
  Home: undefined;
  Wishlist: undefined;
  Cart: undefined;
  Profile: undefined;
};

// App Stack Parameter List
export type AppStackParamList = {
  Main: undefined;
  ProductDetails: { productId: string; product?: Product };
  CategoryProducts: { categoryId: string; categoryName: string };
  QurbaniDetails: { qurbaniId: string | number; qurbani?: Qurbani };
  Cart: undefined;
  Checkout: undefined;
  OrderComplete: { orderId: string };
  Search: undefined;
  Profile: undefined;
  AllProducts: undefined;
  Contact: undefined;
  About: undefined;
  QurbaniBooking: undefined;
  QurbaniDonate: undefined;
  OrderDetails: { orderId: string };
  OrderHistory: undefined;
  FAQs: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
  CountrySelect: { onSelect?: (countryCode: string) => void } | undefined;
};

// Auth Stack Parameter List
export type AuthStackParamList = {
  Welcome: undefined;
  CountrySelect: { onSelect?: (countryCode: string) => void } | undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Root Stack Parameter List
export type RootStackParamList = {
  Main: undefined;
  Auth: { screen: keyof AuthStackParamList } | undefined;
  CountrySelect: { onSelect?: (countryCode: string) => void } | undefined;
  ProductDetails: { productId: string; product?: Product };
  CategoryProducts: { categoryId: string; categoryName: string };
  QurbaniDetails: { qurbaniId: string | number; qurbani?: Qurbani };
  Cart: undefined;
  Checkout: undefined;
  OrderComplete: { orderId: string };
  Search: undefined;
  Profile: undefined;
  AllProducts: undefined;
  Contact: undefined;
  About: undefined;
  QurbaniBooking: undefined;
  QurbaniDonate: undefined;
  OrderDetails: { orderId: string };
  OrderHistory: undefined;
  FAQs: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
};

// Types for Navigation
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;
export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Route Props
export type AuthScreenRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;
export type AppScreenRouteProp<T extends keyof AppStackParamList> = RouteProp<AppStackParamList, T>;
export type TabScreenRouteProp<T extends keyof MainTabParamList> = RouteProp<MainTabParamList, T>;
export type QurbaniDetailsRouteProp = RouteProp<RootStackParamList, 'QurbaniDetails'>;

// Combined Navigation Prop
export type AppNavigationProp = CompositeNavigationProp<
  RootStackNavigationProp,
  CompositeNavigationProp<AppStackNavigationProp, MainTabNavigationProp>
>;