import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Order } from '../types/api.types';

const OrdersScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { isAuthenticated } = useAuthStore();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, fetch orders from API
      // const response = await orderService.getOrders();
      
      // For demo purposes, we'll simulate API delay and mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock orders data
      const mockOrders: Order[] = [];
      
      setOrders(mockOrders);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      setLoading(false);
    }
  };

  const handleOrderPress = (orderId: string) => {
    // @ts-ignore
    navigation.navigate('OrderDetails', { orderId });
  };

  const renderEmptyOrders = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="receipt-outline" 
        size={80} 
        color={theme.colors.grays[300]} 
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No orders yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Your order history will appear here
      </Text>
      <TouchableOpacity 
        style={[styles.browseButton, { backgroundColor: theme.colors.brand }]}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Text style={styles.browseButtonText}>
          Start Shopping
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrderStatus = (status: string) => {
    let statusColor = theme.colors.textSecondary;
    let statusIcon = 'ellipse';
    
    switch (status.toLowerCase()) {
      case 'completed':
        statusColor = theme.colors.success;
        statusIcon = 'checkmark-circle';
        break;
      case 'processing':
        statusColor = theme.colors.brand;
        statusIcon = 'sync';
        break;
      case 'cancelled':
        statusColor = theme.colors.error;
        statusIcon = 'close-circle';
        break;
      case 'shipped':
        statusColor = theme.colors.info;
        statusIcon = 'airplane';
        break;
      default:
        statusColor = theme.colors.textSecondary;
    }
    
    return (
      <View style={styles.statusContainer}>
        <Ionicons name={statusIcon as any} size={16} color={statusColor} style={styles.statusIcon} />
        <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
      </View>
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={[styles.orderItem, { backgroundColor: theme.colors.cardBackground }]}
      onPress={() => handleOrderPress(item.id.toString())}
    >
      <View style={styles.orderHeader}>
        <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
          Order #{item.id}
        </Text>
        {renderOrderStatus(item.status)}
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={[styles.orderDate, { color: theme.colors.textSecondary }]}>
          {new Date(item.orderDate).toLocaleDateString()}
        </Text>
        <Text style={[styles.orderAmount, { color: theme.colors.text }]}>
          {item.country === 'PAK' ? 'Rs.' : '$'} {item.totalAmount.toFixed(2)}
        </Text>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={[styles.orderItemsCount, { color: theme.colors.textSecondary }]}>
          {item.OrderItems ? item.OrderItems.length : 0} items
        </Text>
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading orders...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            {error}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { borderColor: theme.colors.brand }]}
            onPress={fetchOrders}
          >
            <Text style={[styles.retryText, { color: theme.colors.brand }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (orders.length === 0) {
      return renderEmptyOrders();
    }

    return (
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          My Orders
        </Text>
      </View>
      
      {!isAuthenticated ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="lock-closed-outline" size={80} color={theme.colors.grays[300]} />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            Sign in to view orders
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            Please login to see your order history
          </Text>
          <TouchableOpacity 
            style={[styles.browseButton, { backgroundColor: theme.colors.brand }]}
            onPress={() => navigation.navigate('Auth' as never, { screen: 'Login' } as never)}
          >
            <Text style={styles.browseButtonText}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        renderContent()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  ordersList: {
    paddingBottom: 24,
  },
  orderItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderDate: {
    fontSize: 14,
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
    marginTop: 12,
  },
  orderItemsCount: {
    fontSize: 14,
  },
});

export default OrdersScreen; 