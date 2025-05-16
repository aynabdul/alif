// src/screens/OrdersScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Platform,
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
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noOrders, setNoOrders] = useState(false);

  // Animation values for fade-in effect
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(50)).current;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // Animate cards when orders are loaded
    if (filteredOrders.length > 0 && !loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [filteredOrders, loading]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = orders.filter((order) =>
      order?.OrderItems?.some((item) =>
        item?.Product?.productName?.toLowerCase().includes(term) ||
        item?.Qurbani?.title?.toLowerCase().includes(term)
      ) ||
      order?.status?.toLowerCase().includes(term) ||
      order?.paymentStatus?.toLowerCase().includes(term)
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    if (!user?.id || !token) {
      setError('You must be logged in to view orders');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
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
      
      try {
        const response = await orderService.getOrderHistory(user.id);
        
        if (response.success) {
          console.log('Orders loaded:', response.orders?.length || 0);
          
          // Handle case where user has no orders
          if (!response.orders || response.orders.length === 0) {
            setNoOrders(true);
            setOrders([]);
            setFilteredOrders([]);
          } else {
            setNoOrders(false);
            setOrders(response.orders);
            setFilteredOrders(response.orders);
          }
          setError(null);
        } else {
          // Handle API error response that's not a 404
          setError('Failed to load orders');
        }
      } catch (apiError: any) {
        // Check if this is a 404 "No orders found" response
        if (apiError?.response?.status === 404 && 
            apiError?.response?.data?.message?.toLowerCase().includes('no orders found')) {
          console.log('No orders found for this customer - valid empty response');
          setNoOrders(true);
          setOrders([]);
          setFilteredOrders([]);
          setError(null);
        } else if (apiError?.message?.includes('401') || 
                  apiError?.response?.status === 401 ||
                  apiError?.message?.includes('Authentication token not found')) {
          setError('Your session has expired. Please sign in again to view your orders.');
          setTimeout(() => {
            useAuthStore.getState().signOut();
            navigation.navigate('Auth');
          }, 2000);
        } else {
          console.error('Order History Error:', apiError);
          setError('Failed to load your orders. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPress = (orderId: string) => {
    navigation.navigate('OrderDetails', { orderId });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const formatPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numericPrice) ? numericPrice.toLocaleString() : '0';
  };

  const getStatusColor = (status: string = '') => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50'; // Green
      case 'processing':
        return '#1976D2'; // Blue (from mobile theme)
      case 'pending':
        return '#e38520'; // Orange
      case 'cancelled':
        return '#F44336'; // Red
      default:
        return '#aaabad'; // Gray (default)
    }
  };

  // Render a single order card
  const renderOrderCard = ({ item, index }: { item: Order; index: number }) => {
    // Calculate animation delay based on index
    const animationDelay = index * 100;
    
    // Create individual animation values for each card
    const cardFade = fadeAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    
    const cardTranslateY = translateY.interpolate({
      inputRange: [0, 50],
      outputRange: [0, 50],
    });

    return (
      <Animated.View
        style={[
          styles.orderCard,
          { 
            backgroundColor: theme.colors.card,
            shadowColor: theme.colors.text,
            opacity: cardFade,
            transform: [{ translateY: cardTranslateY }],
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.cardContent}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={styles.orderNumberContainer}>
              <Text style={styles.orderNumberLabel}>Order #:</Text>
              <Text style={styles.orderNumber}>{index + 1}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Date:</Text>
              <Text style={styles.dateValue}>{formatDate(item.orderDate || item.createdAt || '')}</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Products:</Text>
            <View style={styles.productsContainer}>
              {item?.OrderItems?.map((orderItem, i) => (
                <Text key={i} style={styles.productText}>
                  {orderItem?.Qurbani?.title && (
                    <>
                      Qurbani: {orderItem.Qurbani.title}{' '}
                      <Text style={styles.quantityText}>(Qty: {orderItem.quantity})</Text>
                    </>
                  )}
                  {orderItem?.Product?.productName && (
                    <>
                      Product: {orderItem.Product.productName}{' '}
                      <Text style={styles.quantityText}>(Qty: {orderItem.quantity})</Text>
                    </>
                  )}
                  {!orderItem?.Qurbani?.title && !orderItem?.Product?.productName && (
                    <>
                      - <Text style={styles.quantityText}>(Qty: {orderItem.quantity})</Text>
                    </>
                  )}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total Quantity:</Text>
            <Text style={styles.cardValue}>
              {item.OrderItems?.reduce((sum, orderItem) => sum + (orderItem.quantity || 0), 0) || '0'}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total Amount:</Text>
            <Text style={styles.cardValue}>
              {item.country === 'PAK' ? '₨ ' : '$ '}
              {formatPrice(item.totalAmount || item.totalPrice || 0)}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Status:</Text>
            <View
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(item.status) }
              ]}
            >
              <Text style={styles.chipText}>{item.status || 'Unknown'}</Text>
            </View>
          </View>

          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Payment:</Text>
            <View
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(item.paymentStatus || '') }
              ]}
            >
              <Text style={styles.chipText}>{item.paymentStatus || 'Unknown'}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: '#37474F' }]}>🛒 My Orders</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: '#fff', borderColor: theme.colors.border }]}
          placeholder="Search by product name, status or payment..."
          placeholderTextColor="#aaabad"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <Ionicons name="search" size={20} color="#aaabad" style={styles.searchIcon} />
      </View>

      {noOrders || filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color="#aaabad" />
          <Text style={[styles.emptyTitle, { color: '#37474F' }]}>
            No Orders Found
          </Text>
          <Text style={[styles.emptyText, { color: '#616161' }]}>
            {noOrders 
              ? "You haven't placed any orders yet." 
              : "No matching orders found for your search."}
          </Text>
          {noOrders && (
            <TouchableOpacity 
              style={[styles.shopNowButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('AllProducts')}
            >
              <Text style={styles.buttonText}>Shop Now</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    paddingLeft: 40,
    fontSize: 16,
    color: '#37474F',
  },
  searchIcon: {
    position: 'absolute',
    left: 28,
    top: 26,
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
  shopNowButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
    marginTop: 20,
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
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  orderCard: {
    borderRadius: 12,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderNumberLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#616161',
    marginRight: 4,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#37474F',
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    fontSize: 12,
    color: '#616161',
  },
  dateValue: {
    fontSize: 14,
    color: '#37474F',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#616161',
    width: '30%',
  },
  cardValue: {
    fontSize: 14,
    color: '#37474F',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  productsContainer: {
    flex: 1,
  },
  productText: {
    fontSize: 14,
    color: '#37474F',
    marginBottom: 4,
  },
  quantityText: {
    fontSize: 12,
    color: '#616161',
  },
  statusChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

export default OrdersScreen;