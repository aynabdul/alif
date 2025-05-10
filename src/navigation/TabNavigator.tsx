import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useCartStore } from '../stores/cartStore';
import MainLayout from '../components/common/MainLayout';

// Screens
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WishlistScreen from '../screens/WishlistScreen';

import { MainTabParamList } from '../types/navigation.types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_BAR_HEIGHT = 65; // Slightly reduced for tighter layout

const TabNavigator = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems } = useCartStore();
  const insets = useSafeAreaInsets();

  return (
    <MainLayout>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: theme.colors.brand,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
            height: TAB_BAR_HEIGHT + (Platform.OS === 'ios' ? insets.bottom : 0),
            paddingBottom: Platform.OS === 'ios' ? insets.bottom + 5 : 8, // Reduced padding for Android
            paddingTop: 6, // Reduced padding for tighter spacing
            elevation: 8,
            shadowColor: theme.colors.text,
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            marginTop: 0, // Removed to reduce gap
            marginBottom: 2, // Reduced to minimize space at bottom
          },
          tabBarIconStyle: {
            marginBottom: 2, // Reduced to minimize space between icon and label
          },
          // Subtle iPhone-like feedback or no ripple on Android
          tabBarActiveBackgroundColor: 'transparent', // Prevents default Android ripple
          tabBarInactiveBackgroundColor: 'transparent', // Ensures consistency
          tabBarItemStyle: {
            paddingVertical: 4, // Adjust padding to control touch area
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Wishlist"
          component={WishlistScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" color={color} size={24} />
            ),
            tabBarBadge: wishlistItems.length > 0 ? wishlistItems.length : undefined,
            tabBarBadgeStyle: {
              backgroundColor: theme.colors.error,
              color: 'white',
              fontSize: 10,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
            },
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" color={color} size={24} />
            ),
            tabBarBadge: cartItems.length > 0 ? cartItems.length : undefined,
            tabBarBadgeStyle: {
              backgroundColor: theme.colors.error,
              color: 'white',
              fontSize: 10,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
            },
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </MainLayout>
  );
};

export default TabNavigator;