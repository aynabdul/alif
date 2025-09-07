import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Image,
  FlatList
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList, RootStackNavigationProp } from '../types/navigation.types';
import { Order, OrderItem } from '../types/api.types';
import { API_BASE_URL } from '../config/api';

type OrderDetailsRouteProp = RouteProp<RootStackParamList, 'OrderDetails'>;

const OrderDetailsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<OrderDetailsRouteProp>();
  const { orderId } = route.params;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, fetch order details from API
      // const response = await orderService.getOrderById(orderId);
      
      // For demo purposes, we'll simulate API delay and mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock order data
      const mockOrder: Order = {
        id: Number(orderId),
        customerId: 1,
        orderDate: new Date().toISOString(),
        status: 'Processing',
        totalAmount: 245.99,
        country: 'USA',
        paymentStatus: 'paid',
        paymentSessionId: 'sess_12345',
        transactionId: 'txn_67890abcdef',
        city: 'New York',
        street: '123 Main St',
        postcodeZip: '10001',
        OrderItems: [
          {
            id: 1,
            orderId: Number(orderId),
            productId: 1,
            quantity: 2,
            price: 120.99,
            Product: {
              id: '1',
              productName: 'Premium Goat Meat',
              productDescription: 'Fresh goat meat',
              OriginalPricePak: 2000,
              discountOfferinPak: 0,
              PriceAfterDiscountPak: 2000,
              IsDiscountedProductInPak: false,
              OriginalPriceUSA: 120.99,
              discountOfferinUSA: 0,
              PriceAfterDiscountUSA: 120.99,
              IsDiscountedProductInUSA: false,
              quantityForUSA: 50,
              quantityForPak: 50,
              SKUPak: 'GM-PK-001',
              SKUUSA: 'GM-US-001',
              productheight: 0,
              productwidth: 0,
              productweight: 0,
              productlength: 0,
              productTags: 'goat, meat, fresh',
              showOnHomeScreen: true,
              whereToShow: 'home',
              categoryId: '1',
              discountAtOnce: 0,
              ProductImages: [
                {
                  id: '1',
                  productId: '1',
                  imageUrl: '/uploads/products/goat.jpg'
                }
              ]
            }
          },
          {
            id: 2,
            orderId: Number(orderId),
            productId: 2,
            quantity: 1,
            price: 25.00,
            isQurbani: false,
            Product: {
              id: '2',
              productName: 'Organic Egg Pack',
              productDescription: 'Farm fresh eggs, pack of 12',
              OriginalPricePak: 500,
              discountOfferinPak: 10,
              PriceAfterDiscountPak: 450,
              IsDiscountedProductInPak: true,
              OriginalPriceUSA: 25.00,
              discountOfferinUSA: 0,
              PriceAfterDiscountUSA: 25.00,
              IsDiscountedProductInUSA: false,
              quantityForUSA: 100,
              quantityForPak: 100,
              SKUPak: 'EG-PK-001',
              SKUUSA: 'EG-US-001',
              productheight: 0,
              productwidth: 0,
              productweight: 0,
              productlength: 0,
              productTags: 'eggs, organic, fresh',
              showOnHomeScreen: true,
              whereToShow: 'home',
              categoryId: '3',
              discountAtOnce: 0,
              ProductImages: [
                {
                  id: '3',
                  productId: '2',
                  imageUrl: '/uploads/products/eggs.jpg'
                }
              ]
            }
          },
          {
            id: 3,
            orderId: Number(orderId),
            productId: 3,
            quantity: 1,
            price: 100.00,
            isQurbani: true,
            qurbaniId: '5678',
            EidHour: '10:00 AM - 12:00 PM',
            Product: {
              id: '3',
              productName: 'Goat Qurbani',
              productDescription: 'Eid al-Adha Goat Sacrifice',
              OriginalPricePak: 1000,
              discountOfferinPak: 0,
              PriceAfterDiscountPak: 1000,
              IsDiscountedProductInPak: false,
              OriginalPriceUSA: 100.00,
              discountOfferinUSA: 0,
              PriceAfterDiscountUSA: 100.00,
              IsDiscountedProductInUSA: false,
              quantityForUSA: 10,
              quantityForPak: 10,
              SKUPak: 'QRB-PK-001',
              SKUUSA: 'QRB-US-001',
              productheight: 0,
              productwidth: 0,
              productweight: 0,
              productlength: 0,
              productTags: 'qurbani, eid, sacrifice',
              showOnHomeScreen: true,
              whereToShow: 'home',
              categoryId: '4',
              discountAtOnce: 0,
              ProductImages: [
                {
                  id: '4',
                  productId: '3',
                  imageUrl: '/uploads/products/qurbani.jpg'
                }
              ]
            }
          }
        ]
      };
      
      setOrder(mockOrder);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again.');
      setLoading(false);
    }
  };

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
        <Ionicons name={statusIcon as any} size={18} color={statusColor} style={styles.statusIcon} />
        <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
      </View>
    );
  };

  // Helper function to format prices
  const formatPrice = (price: number | string | undefined) => {
    if (price === undefined) return '0.00';
    // Convert string to number if needed
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    // Check if it's a valid number
    return !isNaN(numericPrice) ? numericPrice.toFixed(2) : '0.00';
  };

  // Helper function to get the date string
  const getOrderDate = (order: Order) => {
    return order.orderDate || order.createdAt || new Date().toISOString();
  };

  // Helper function to get the total amount or price
  const getOrderTotal = (order: Order) => {
    return order.totalAmount || order.totalPrice || 0;
  };

  // Helper function to get the country currency symbol
  const getCurrencySymbol = (order: Order | null) => {
    if (!order) return '$'; // Default to $ if order is null
    return (order.country === 'PAK') ? 'Rs.' : '$';
  };

  const renderOrderItem = ({ item }: { item: OrderItem }) => {
    if (!item.Product) return null;
    
    const product = item.Product;
const imageUrl = product.ProductImages && product.ProductImages.length > 0
  ? { uri: `${API_BASE_URL}/uploads${product.ProductImages[0].imageUrl}` }
  : require('../../assets/default-product.png');
    
    return (
      <View style={[styles.orderItem, { backgroundColor: theme.colors.cardBackground }]}>
        <Image source={imageUrl} style={styles.productImage} resizeMode="cover" />
        
        <View style={styles.productDetails}>
          <View style={styles.productNameRow}>
            <Text style={[styles.productName, { color: theme.colors.text }]} numberOfLines={2}>
              {product.productName}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                if (product.id) {
                  navigation.navigate('ProductDetails', { 
                    productId: product.id.toString() 
                  });
                }
              }}
            >
              <Text style={[styles.viewButton, { color: theme.colors.brand }]}>View</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={[styles.quantity, { color: theme.colors.textSecondary }]}>
              Qty: {item.quantity}
            </Text>
            <Text style={[styles.price, { color: theme.colors.text }]}>
              {getCurrencySymbol(order)} {formatPrice(item.price)}
            </Text>
          </View>
          
          {item.isQurbani && item.EidHour && (
            <View style={styles.qurbaniInfo}>
              <Text style={[styles.qurbaniLabel, { color: theme.colors.primary }]}>
                Eid Hour: {item.EidHour}
              </Text>
            </View>
          )}
          
          <View style={styles.subtotalRow}>
            <Text style={[styles.subtotalLabel, { color: theme.colors.textSecondary }]}>
              Subtotal:
            </Text>
            <Text style={[styles.subtotal, { color: theme.colors.brand }]}>
              {getCurrencySymbol(order)} {formatPrice(Number(item.price) * item.quantity)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.statusBarStyle} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading order details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.statusBarStyle} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
            {error || 'Order not found'}
          </Text>
          <TouchableOpacity 
            style={[styles.retryButton, { borderColor: theme.colors.brand }]}
            onPress={fetchOrderDetails}
          >
            <Text style={[styles.retryText, { color: theme.colors.brand }]}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.colors.cardBackground }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Order Details
        </Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Order Summary */}
          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.orderHeader}>
              <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
                Order #{order.id}
              </Text>
              {renderOrderStatus(order.status)}
            </View>
            
            <View style={styles.orderMeta}>
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>
                  Date:
                </Text>
                <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                  {new Date(getOrderDate(order)).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>
                  Items:
                </Text>
                <Text style={[styles.metaValue, { color: theme.colors.text }]}>
                  {order.OrderItems?.length || 0}
                </Text>
              </View>
              
              <View style={styles.metaItem}>
                <Text style={[styles.metaLabel, { color: theme.colors.textSecondary }]}>
                  Total:
                </Text>
                <Text style={[styles.metaValue, { color: theme.colors.text, fontWeight: 'bold' }]}>
                  {getCurrencySymbol(order)} {formatPrice(getOrderTotal(order))}
                </Text>
              </View>
            </View>
            
            {/* Payment details if available */}
            {order.paymentStatus && (
              <View style={styles.paymentDetails}>
                <Text style={[styles.paymentTitle, { color: theme.colors.text }]}>
                  Payment Details
                </Text>
                
                <View style={styles.paymentRow}>
                  <Text style={[styles.paymentLabel, { color: theme.colors.textSecondary }]}>
                    Payment Status:
                  </Text>
                  <Text style={[
                    styles.paymentValue, 
                    { 
                      color: order.paymentStatus === 'paid' 
                        ? theme.colors.success 
                        : order.paymentStatus === 'failed'
                          ? theme.colors.error
                          : theme.colors.warning
                    }
                  ]}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </Text>
                </View>
                
                {order.transactionId && (
                  <View style={styles.paymentRow}>
                    <Text style={[styles.paymentLabel, { color: theme.colors.textSecondary }]}>
                      Transaction ID:
                    </Text>
                    <Text style={[styles.paymentValue, { color: theme.colors.text }]}>
                      {order.transactionId}
                    </Text>
                  </View>
                )}
              </View>
            )}
            
            {/* Shipping address if available */}
            {(order.city || order.street || order.postcodeZip) && (
              <View style={styles.shippingDetails}>
                <Text style={[styles.shippingTitle, { color: theme.colors.text }]}>
                  Shipping Address
                </Text>
                
                <Text style={[styles.addressText, { color: theme.colors.text }]}>
                  {[
                    order.street, 
                    order.city, 
                    order.postcodeZip
                  ].filter(Boolean).join(', ')}
                </Text>
              </View>
            )}
          </View>
          
          {/* Order Items */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Items
            </Text>
            
            {order.OrderItems?.map(item => renderOrderItem({ item }))}
          </View>
          
          {/* Order Summary */}
          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Summary
            </Text>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {getCurrencySymbol(order)} {formatPrice(getOrderTotal(order))}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Shipping
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {getCurrencySymbol(order)} 0.00
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Tax
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {getCurrencySymbol(order)} 0.00
              </Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: theme.colors.brand }]}>
                {getCurrencySymbol(order)} {formatPrice(getOrderTotal(order))}
              </Text>
            </View>
          </View>
          
          {/* Support */}
          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Need Help?
            </Text>
            
            <TouchableOpacity 
              style={[styles.supportButton, { borderColor: theme.colors.border }]}
            >
              <Ionicons name="chatbubble-outline" size={20} color={theme.colors.brand} />
              <Text style={[styles.supportButtonText, { color: theme.colors.text }]}>
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 30,
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
  section: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
  orderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
  },
  paymentDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  shippingDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
  },
  shippingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: 80,
    height: 80,
  },
  productDetails: {
    flex: 1,
    padding: 12,
  },
  productNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  viewButton: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  quantity: {
    fontSize: 12,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtotalLabel: {
    fontSize: 12,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    marginTop: 8,
    paddingTop: 16,
    paddingBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  qurbaniInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  qurbaniLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default OrderDetailsScreen; 