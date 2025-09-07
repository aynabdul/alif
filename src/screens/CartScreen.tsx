// src/screens/CartScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  TextInput,
  Animated,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore, CartItem } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/common/Button';
import { RootStackNavigationProp } from '../types/navigation.types';
import { orderPaymentService, couponService, authService } from '../services/api.service';
import { Coupon, Customer, OrderPayload } from '../types/api.types';
import { initStripe, initPaymentSheet, presentPaymentSheet, CollectionMode, AddressCollectionMode, } from '@stripe/stripe-react-native';
// Environment variables are loaded automatically by Expo
const API_CONFIG = {
  BASE_URL: process.env.API_CONFIG_BASE_URL || 'https://aliffarms.com/alifadmin/api',
  STRIPE_PUBLIC_KEY: process.env.API_CONFIG_STRIPE_PUBLIC_KEY || 'pk_live_51RDnUjKK5NeIwomRUmrFkXaWgVbAXok2qZ3xmdp0cI2VHvXXLzYIfFSiaybn3oP2c9vJ8TbN12Y1XD8oTEfXnCp000rla8LUfp',
  BOP_CHECKOUT: process.env.API_CONFIG_BOP_CHECKOUT || 'https://ap-gateway.mastercard.com/static/checkout/checkout.min.js',
};
import WebView from 'react-native-webview';
import { useForm, Controller } from 'react-hook-form';

const CartScreen = () => {
  const { theme, country } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const { user, token } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: '',
      email: '',
      cashOnDelivery: false,
    },
  });

  useEffect(() => {
    console.log('CartScreen - Currently selected country:', country);
  }, [country]);

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [isWebViewVisible, setWebViewVisible] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState('');
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    initStripe({
      publishableKey: API_CONFIG.STRIPE_PUBLIC_KEY,
    });

    const fetchCoupons = async () => {
      try {
        const response = await couponService.getCoupons();
        if (response.success && response.data) {
          setCoupons(response.data);
        } else {
          Alert.alert('Error', 'Failed to load coupons.');
        }
      } catch (error) {
        console.error('Error fetching coupons:', error);
        Alert.alert('Error', 'Failed to load coupons.');
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    if (isCheckoutModalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isCheckoutModalVisible]);

const handleRemoveItem = (item: CartItem) => {
  Alert.alert(
    'Remove Item',
    'Are you sure you want to remove this item from your cart?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        onPress: () => {
          const itemId = useCartStore.getState().generateCartItemId(item);
          removeItem(itemId);
        },
        style: 'destructive',
      },
    ],
  );
};

const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
  const itemId = useCartStore.getState().generateCartItemId(item);
  if (newQuantity < 1) {
    handleRemoveItem(item);
    return;
  }
  updateQuantity(itemId, newQuantity);
};

const renderCartItem = ({ item }: { item: CartItem }) => (
  <View style={[styles.cartItem, { backgroundColor: theme.colors.card }]}>
    <Image source={item.image} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={[styles.itemName, { color: theme.colors.text }]}>{item.name}</Text>
      <Text style={[styles.itemPrice, { color: theme.colors.primary }]}>
        {country === 'PAK' ? 'PKR ' : '$'}
        {item.price.toFixed(2)}
      </Text>
      {item.type === 'qurbani' && (
        <View>
          <Text style={[styles.itemDetail, { color: theme.colors.textSecondary }]}>
            Day: {item.day || 'Not selected'}
          </Text>
          {item.hour && (
            <Text style={[styles.itemDetail, { color: theme.colors.textSecondary }]}>
              Hour: {item.hour}:00
            </Text>
          )}
        </View>
      )}
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: theme.colors.border }]}
          onPress={() => handleUpdateQuantity(item, item.quantity - 1)}
        >
          <Ionicons name="remove" size={16} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.quantityText, { color: theme.colors.text }]}>
          {item.quantity}
        </Text>
        <TouchableOpacity
          style={[styles.quantityButton, { backgroundColor: theme.colors.border }]}
          onPress={() => handleUpdateQuantity(item, item.quantity + 1)}
        >
          <Ionicons name="add" size={16} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
    </View>
    <View style={styles.itemActions}>
      <Text style={[styles.itemTotal, { color: theme.colors.text }]}>
        {country === 'PAK' ? 'PKR ' : '$'}
        {(item.price * item.quantity).toFixed(2)}
      </Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveItem(item)}
      >
        <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
      </TouchableOpacity>
    </View>
  </View>
);

  const applyCoupon = async () => {
    if (!couponCode) {
      Alert.alert('Error', 'Please enter a coupon code.');
      return;
    }

    const matchedCoupon = coupons.find((c) => c.code === couponCode);
    if (!matchedCoupon) {
      Alert.alert('Error', 'Invalid coupon code.');
      return;
    }

    try {
      setAppliedCoupon(matchedCoupon);
      Alert.alert('Success', `Coupon applied! ${matchedCoupon.discount}% discount.`);
    } catch (error) {
      console.error('Error applying coupon:', error);
      Alert.alert('Error', 'Failed to apply coupon.');
    }
  };

  const calculateSubtotal = () => {
    return getTotalPrice();
  };

  const calculateDiscountedTotal = () => {
    const subtotal = calculateSubtotal();
    if (appliedCoupon) {
      return Math.max(subtotal - (subtotal * appliedCoupon.discount) / 100, 0);
    }
    return subtotal;
  };
  const calculateDiscountAmount = () => {
  const subtotal = calculateSubtotal();
  if (appliedCoupon) {
    return (subtotal * appliedCoupon.discount) / 100;
  }
  return 0;
};

 const handleCheckout = async (data: { firstName: string; email: string; cashOnDelivery: boolean }) => {
  setIsLoading(true);
  setTokenError(null);

  console.log('Using API_BASE_URL:', API_CONFIG.BASE_URL);
  console.log('Country before payload:', country);

  let isTokenValid = true;
  if (user && token) {
    try {
      isTokenValid = await authService.checkAndRefreshToken();
      if (!isTokenValid) {
        setTokenError('Your session has expired. Please sign in again.');
        setIsLoading(false);
        return;
      }
    } catch (error: any) {
      console.error('Token validation error:', error.message);
      setTokenError('Your session has expired. Please sign in again.');
      setIsLoading(false);
      return;
    }
  }

  let customerId: string;
  let customerEmail: string;
  if (user) {
    if (!user.id || !user.email) {
      console.error('User is missing id or email:', user);
      Alert.alert('Error', 'User data is incomplete. Please sign in again.');
      setIsLoading(false);
      return;
    }
    customerId = user.id;
    customerEmail = user.email;
  } else {
    try {
      const customerResponse = await orderPaymentService.checkoutUser({
        name: data.firstName,
        email: data.email,
        isUser: false,
        isadmin: false,
      });
      console.log('Customer response in handleCheckout:', JSON.stringify(customerResponse, null, 2));
      if (customerResponse.success && customerResponse.customer) {
        customerId = String(customerResponse.customer.id);
        customerEmail = customerResponse.customer.email;
      } else {
        console.error('Invalid customer response:', customerResponse);
        Alert.alert('Error', 'Failed to create customer.');
        setIsLoading(false);
        return;
      }
    } catch (error: any) {
      console.error('Customer creation error:', error.message);
      Alert.alert('Error', 'Failed to create customer.');
      setIsLoading(false);
      return;
    }
  }

  const orderPayload: OrderPayload = {
    customerEmail,
    customerId,
    items: items.map((item) => ({
      productId: String(item.id).split('_')[0],
      quantity: item.quantity,
      price: item.price,
      selectedDay: item.type === 'qurbani' ? (item.day || '') : '', // Preserve for qurbani items
      selectedHour: item.type === 'qurbani' ? (item.hour || null) : null, // Preserve for qurbani items
    })),
    country: country === 'PAK' ? 'PK' : 'USA',
    discount: appliedCoupon ? appliedCoupon.discount : 0,
  };

  try {
    console.log('Order payload:', JSON.stringify(orderPayload, null, 2));

    if (data.cashOnDelivery) {
      console.log('Calling createCashOnDelivery:', orderPayload);
      const codResponse = await orderPaymentService.createCashOnDelivery(orderPayload);
      console.log('COD response:', JSON.stringify(codResponse, null, 2));
      if (codResponse.success) {
        clearCart();
        setCheckoutModalVisible(false);
        Alert.alert('Success', 'Your order has been placed successfully!');
      } else {
        console.error('COD response:', JSON.stringify(codResponse, null, 2));
        Alert.alert('Error', codResponse.message || 'Failed to process COD order.');
      }
    } else if (country === 'PAK') {
      console.log('Calling createPaymentSession:', orderPayload);
      const sessionResponse = await orderPaymentService.createPaymentSession(orderPayload);
      console.log('Session creation response:', JSON.stringify(sessionResponse, null, 2));
      if (sessionResponse.success && sessionResponse.data?.sessionId) {
        clearCart();
        setCheckoutModalVisible(false);
        const bopPaymentUrl = `https://ap-gateway.mastercard.com/checkout/pay/${sessionResponse.data.sessionId}?checkoutVersion=1.0.0`;
        console.log('Opening BOP payment URL:', bopPaymentUrl);
        setWebViewUrl(bopPaymentUrl);
        setWebViewVisible(true);
      } else {
        console.error('Session creation response:', JSON.stringify(sessionResponse, null, 2));
        Alert.alert('Error', sessionResponse.message || 'Failed to create payment session.');
      }
    } else {
      console.log('Calling createPaymentIntent:', orderPayload);
      const paymentIntentResponse = await orderPaymentService.createPaymentIntent(orderPayload);
      console.log('Payment Intent response:', JSON.stringify(paymentIntentResponse, null, 2));
      if (paymentIntentResponse.success && paymentIntentResponse.data?.clientSecret) {
        setCheckoutModalVisible(false);
      const { error: initError } = await initPaymentSheet({
          merchantDisplayName: 'Alif Cattle & Goat Farm',
          paymentIntentClientSecret: paymentIntentResponse.data.clientSecret,
          allowsDelayedPaymentMethods: true,
          billingDetailsCollectionConfiguration: {
            name: CollectionMode.ALWAYS, // Collect cardholder name
            address: AddressCollectionMode.FULL // Collect full address (line1, line2, city, etc.)
          },
          defaultBillingDetails: {
            name: user?.name || 'Customer',
            email: user?.email,
            address: {
              country: 'US',
              line1: '',
              line2: '',
              city: '',
              postalCode: '',
              state: '',
            },
          },
        });
        if (initError) {
          console.error('Payment Sheet init error:', initError);
          Alert.alert('Error', `Payment initialization failed: ${initError.message}`);
          setIsLoading(false);
          return;
        }

        const { error: paymentError } = await presentPaymentSheet();
        if (paymentError) {
          console.error('Payment Sheet error:', paymentError);
          Alert.alert('Error', `Payment failed: ${paymentError.message}`);
          setIsLoading(false);
          return;
        }

        clearCart();
        Alert.alert('Success', 'Payment successful! Order placed.');
      } else {
        console.error('Payment Intent response:', JSON.stringify(paymentIntentResponse, null, 2));
        Alert.alert('Error', 'Failed to initiate Stripe payment.');
      }
    }
  } catch (error: any) {
    console.error('Checkout error:', error.message, error.stack);
    console.error('Error details:', JSON.stringify(error, null, 2));
    Alert.alert('Error', `Checkout failed: ${error.message || 'Unknown error'}`);
  } finally {
    setIsLoading(false);
  }
};

  const renderCheckoutModal = () => (
    <Modal
      visible={isCheckoutModalVisible}
      animationType="none"
      transparent
      onRequestClose={() => setCheckoutModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setCheckoutModalVisible(false)}
      >
        <Animated.View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.colors.card,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                  Checkout
                </Text>
                <TouchableOpacity onPress={() => setCheckoutModalVisible(false)}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>

              {!user && (
                <View style={styles.formSection}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Customer Information
                  </Text>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: 'First name is required' }}
                    render={({ field }) => (
                      <>
                        <TextInput
                          style={[
                            styles.input,
                            { borderColor: theme.colors.border, color: theme.colors.text },
                            errors.firstName ? { borderColor: theme.colors.error } : {},
                          ]}
                          placeholder="First Name"
                          placeholderTextColor={theme.colors.textSecondary}
                          value={field.value}
                          onChangeText={field.onChange}
                        />
                        {errors.firstName && (
                          <Text style={[styles.errorText, { color: theme.colors.error }]}>
                            {errors.firstName.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <TextInput
                          style={[
                            styles.input,
                            { borderColor: theme.colors.border, color: theme.colors.text },
                            errors.email ? { borderColor: theme.colors.error } : {},
                          ]}
                          placeholder="Email"
                          placeholderTextColor={theme.colors.textSecondary}
                          value={field.value}
                          onChangeText={field.onChange}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                        {errors.email && (
                          <Text style={[styles.errorText, { color: theme.colors.error }]}>
                            {errors.email.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                </View>
              )}

              {user && tokenError && (
                <View style={styles.formSection}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                    Session Expired
                  </Text>
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {tokenError}
                  </Text>
                  <Button
                    title="Sign In"
                    onPress={() => {
                      useAuthStore.getState().signOut();
                      navigation.navigate('Auth');
                    }}
                    style={styles.actionButton}
                  />
                </View>
              )}

              <View style={styles.formSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Coupon Code
                </Text>
                <View style={styles.couponContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      { borderColor: theme.colors.border, color: theme.colors.text, flex: 1 },
                    ]}
                    placeholder="Enter code"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={couponCode}
                    onChangeText={setCouponCode}
                  />
                  <Button
                    title="Apply"
                    onPress={applyCoupon}
                    style={styles.applyButton}
                  />
                </View>
              </View>

              <View style={styles.formSection}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Order Summary
                </Text>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    Subtotal
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                    {country === 'PAK' ? 'PKR ' : '$'}
                    {calculateSubtotal().toFixed(2)}
                  </Text>
                </View>
                {appliedCoupon && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                      Discount ({appliedCoupon.discount}%)
                    </Text>
                    <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
                      -{country === 'PAK' ? 'PKR ' : '$'}
                      {calculateDiscountAmount().toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    Shipping
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                    Free
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
                <View style={styles.summaryRow}>
                  <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
                    Total
                  </Text>
                  <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                    {country === 'PAK' ? 'PKR ' : '$'}
                    {calculateDiscountedTotal().toFixed(2)}
                  </Text>
                </View>
                <Button
                  title="Proceed"
                  onPress={handleSubmit(handleCheckout)}
                  style={styles.actionButton}
                  disabled={isLoading || !!(user && tokenError !== null)}
                />
              </View>
            </ScrollView>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color={theme.colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Your cart is empty
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Browse our products and add items to your cart
      </Text>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: theme.colors.brand }]}
        onPress={() => navigation.navigate('AllProducts')}
      >
        <Text style={styles.browseButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Shopping Cart</Text>
        <Text style={[styles.itemCount, { color: theme.colors.textSecondary }]}>
          {items.length} items
        </Text>
      </View>
      {items.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            Alert.alert(
              'Clear Cart',
              'Are you sure you want to clear your cart?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Clear',
                  onPress: () => clearCart(),
                  style: 'destructive',
                },
              ]
            );
          }}
        >
          <Text style={[styles.clearButtonText, { color: theme.colors.error }]}>
            Clear
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      {renderHeader()}
      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          <View style={[styles.summaryContainer, { backgroundColor: theme.colors.card }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Subtotal
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                {country === 'PAK' ? 'PKR ' : '$'}
                {calculateSubtotal().toFixed(2)}
              </Text>
            </View>
              {appliedCoupon && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                    Discount ({appliedCoupon.discount}%)
                  </Text>
                  <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
                    -{country === 'PAK' ? 'PKR ' : '$'}
                    {calculateDiscountAmount().toFixed(2)}
                  </Text>
                </View>
              )}
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                Shipping
              </Text>
              <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                Free
              </Text>
            </View>
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            <View style={styles.summaryRow}>
              <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                {country === 'PAK' ? 'PKR ' : '$'}
                {calculateDiscountedTotal().toFixed(2)}
              </Text>
            </View>
            <Button
              title="Proceed to Checkout"
              onPress={() => setCheckoutModalVisible(true)}
              style={styles.checkoutButton}
            />
          </View>
        </>
      )}
      {renderCheckoutModal()}
      {country === 'PAK' && (
        <Modal
          visible={isWebViewVisible}
          animationType="slide"
          onRequestClose={() => setWebViewVisible(false)}
        >
          <View style={styles.webViewContainer}>
            <View style={styles.webViewHeader}>
              <Text style={[styles.webViewTitle, { color: theme.colors.text }]}>
                Bank of Punjab Checkout
              </Text>
              <TouchableOpacity onPress={() => setWebViewVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <WebView
              source={{ uri: webViewUrl }}
              style={styles.webView}
              onNavigationStateChange={(navState) => {
                console.log('WebView navigation:', navState.url);
                if (navState.url.includes('success') || navState.url.includes('__hc-action-success')) {
                  clearCart();
                  setWebViewVisible(false);
                  Alert.alert('Success', 'Payment successful! Order placed.');
                } else if (navState.url.includes('cancel') || navState.url.includes('__hc-action-cancel')) {
                  setWebViewVisible(false);
                  Alert.alert('Cancelled', 'Payment was cancelled.');
                }
              }}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.error('WebView error:', nativeEvent);
                Alert.alert('Error', 'Failed to load payment page.');
                setWebViewVisible(false);
              }}
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            />
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 14,
    marginTop: 5,
  },
  clearButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  cartList: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: 14,
    marginTop: 4,
  },
  webViewContainer: {
    flex: 1,
  },
  webViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
  },
  webViewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  webView: {
    flex: 1,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingLeft: 10,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 5,
  },
  summaryContainer: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    marginTop: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 8,
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  applyButton: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  actionButton: {
    marginTop: 15,
  },
});

export default CartScreen;