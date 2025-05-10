import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import { Order } from '../types/api.types';
import { orderService, authService } from '../services/api.service';
import { Ionicons } from '@expo/vector-icons';

const OrdersScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, token } = useAuthStore();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!user?.id || !token) {
      setError('You must be logged in to view orders');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Validate token before proceeding
      const isTokenValid = await authService.checkAndRefreshToken();
      if (!isTokenValid) {
        setError('Your session has expired. Please sign in again to view your orders.');
        setTimeout(() => {
          useAuthStore.getState().signOut();
          navigation.navigate('Auth');
        }, 2000);
        setLoading(false);
        return;
      }
      
      console.log('Fetching orders for user ID:', user.id);
      
      const response = await orderService.getOrderHistory(user.id);
      
      // Always treat success response with empty orders array as valid
      if (response.success) {
        console.log('Orders loaded:', response.orders?.length || 0);
        setOrders(response.orders || []);
        setError(null); // Clear any previous errors
      } else {
        setError('Failed to load orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      
      // Check for specific errors
      if (err instanceof Error) {
        if (err.message.includes('Authentication token not found') || err.message.includes('401')) {
          setError('Your session has expired. Please sign in again to view your orders.');
          // Force logout and redirect to Auth screen
          setTimeout(() => {
            useAuthStore.getState().signOut();
            navigation.navigate('Auth');
          }, 2000);
        } else {
          setError('Failed to load your orders. Please try again later.');
        }
      } else {
        setError('Failed to load your orders. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number | string) => {
    // Convert string to number if needed
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    // Check if it's a valid number
    return !isNaN(numericPrice) ? numericPrice.toFixed(2) : '0.00';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return theme.colors.success;
      case 'processing':
        return theme.colors.primary;
      case 'pending':
        return theme.colors.warning;
      case 'cancelled':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.statusBarStyle} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading your orders...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.statusBarStyle} />
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Orders</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons 
            name={error.includes('session has expired') ? 'lock-closed-outline' : 'alert-circle-outline'} 
            size={64} 
            color={theme.colors.error} 
          />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            {error.includes('session has expired') ? 'Session Expired' : 'Error Loading Orders'}
          </Text>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
          {error.includes('session has expired') ? (
            <TouchableOpacity 
              style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('Auth')}
            >
              <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
              onPress={fetchOrders}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.statusBarStyle} />
        
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Orders</Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            You haven't placed any orders yet
          </Text>
          <TouchableOpacity
            style={[styles.shopNowButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={[styles.shopNowText, { color: 'white' }]}>
              Shop Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Orders</Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          {orders.length} {orders.length === 1 ? 'order' : 'orders'} found
        </Text>
      </View>
      
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.orderCard, { backgroundColor: theme.colors.card }]}
            onPress={() => handleOrderPress(item.id.toString())}
          >
            <View style={styles.orderHeader}>
              <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
                Order #{item.id}
              </Text>
              <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>
                {formatDate(item.orderDate || item.createdAt || '')}
              </Text>
            </View>
            
            <View style={styles.orderDetails}>
              <View style={styles.orderInfo}>
                <Text style={[styles.orderItemCount, { color: theme.colors.text }]}>
                  {item.OrderItems?.length || 0} {item.OrderItems?.length === 1 ? 'item' : 'items'}
                </Text>
                <Text style={[styles.orderAmount, { color: theme.colors.primary }]}>
                  {item.country === 'PAK' ? '₨ ' : '$ '}
                  {formatPrice(item.totalAmount || item.totalPrice || 0)}
                </Text>
                {item.paymentStatus && (
                  <Text style={[
                    styles.paymentStatus, 
                    { color: item.paymentStatus === 'paid' ? theme.colors.success : theme.colors.warning }
                  ]}>
                    Payment: {item.paymentStatus.charAt(0).toUpperCase() + item.paymentStatus.slice(1)}
                  </Text>
                )}
              </View>
              
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  loginButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  shopNowButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  orderCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderInfo: {
    flexDirection: 'column',
  },
  orderItemCount: {
    fontSize: 14,
    marginBottom: 4,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentStatus: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default OrdersScreen; 