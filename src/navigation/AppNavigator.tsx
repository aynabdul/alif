import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation.types';
import MainLayout from '../components/common/MainLayout';
import TabNavigator from './TabNavigator';

import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import QurbaniDetailsScreen from '../screens/QurbaniDetailsScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderCompleteScreen from '../screens/OrderCompleteScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CountrySelectScreen from '../screens/CountrySelectScreen';
import AllProductsScreen from '../screens/AllProductsScreen';
import ContactScreen from '../screens/ContactScreen';
import AboutScreen from '../screens/AboutScreen';
import QurbaniBookingScreen from '../screens/QurbaniBookingScreen';
import QurbaniDonateScreen from '../screens/QurbaniDonateScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import OrdersScreen from '../screens/OrdersScreen';
import FAQsScreen from '../screens/FAQsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsScreen from '../screens/TermsScreen';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{
          presentation: 'transparentModal', 
        }}
      />
      <Stack.Screen name="ProductDetails">
        {() => (
          <MainLayout>
            <ProductDetailsScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="CategoryProducts">
        {() => (
          <MainLayout>
            <CategoryProductsScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="QurbaniDetails">
        {() => (
          <MainLayout>
            <QurbaniDetailsScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="Cart">
        {() => (
          <MainLayout>
            <CartScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="Checkout">
        {() => (
          <MainLayout>
            <CheckoutScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="OrderComplete">
        {() => (
          <MainLayout>
            <OrderCompleteScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="Search">
        {() => (
          <MainLayout>
            <SearchScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="Profile">
        {() => (
          <MainLayout>
            <ProfileScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="AllProducts">
        {() => (
          <MainLayout>
            <AllProductsScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="Contact">
        {() => (
          <MainLayout>
            <ContactScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="About">
        {() => (
          <MainLayout>
            <AboutScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="QurbaniBooking">
        {() => (
          <MainLayout>
            <QurbaniBookingScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="QurbaniDonate">
        {() => (
          <MainLayout>
            <QurbaniDonateScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="OrderDetails">
        {() => (
          <MainLayout>
            <OrderDetailsScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="OrderHistory">
        {() => (
          <MainLayout>
            <OrdersScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="CountrySelect"
        component={CountrySelectScreen}
      />
      <Stack.Screen name="FAQs">
        {() => (
          <MainLayout>
            <FAQsScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="PrivacyPolicy">
        {() => (
          <MainLayout>
            <PrivacyPolicyScreen />
          </MainLayout>
        )}
      </Stack.Screen>
      <Stack.Screen name="Terms">
        {() => (
          <MainLayout>
            <TermsScreen />
          </MainLayout>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppNavigator;