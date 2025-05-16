import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { QurbaniDetailsRouteProp } from '../types/navigation.types';
import { qurbaniService } from '../services/api.service';
import { Qurbani } from '../types/api.types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { API_BASE_URL } from '../config/api';
import WebView from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const QurbaniDetailsScreen = () => {
  const route = useRoute<QurbaniDetailsRouteProp>();
  const navigation = useNavigation();
  const { theme, country } = useTheme();
  const { addItem } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { qurbaniId } = route.params;
  const insets = useSafeAreaInsets();

  const [qurbani, setQurbani] = useState<Qurbani | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [addToCartStatus, setAddToCartStatus] = useState<'idle' | 'success' | 'error'>("idle");
  const [webViewHeight, setWebViewHeight] = useState(400);
  const [addingToCart, setAddingToCart] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const windowWidth = Dimensions.get('window').width;
  // Get the bottom bar height for proper padding
  const BOTTOM_BAR_HEIGHT = 80 + (insets.bottom || 16);

  useEffect(() => {
    fetchQurbaniDetails();
  }, [qurbaniId]);

  const fetchQurbaniDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await qurbaniService.getQurbaniById(qurbaniId);
      if (response.success && response.data) {
        setQurbani(response.data);
      } else {
        setError(`Failed to fetch Qurbani details: ${response.message || 'Unknown error'}`);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load Qurbani details.');
      setLoading(false);
    }
  };

  // Placeholder for slots per day (should come from API ideally)
  const daySlots = [
    { label: 'Day 1', value: 'day1', slots: 120 },
    { label: 'Day 2', value: 'day2', slots: 120 },
    { label: 'Day 3', value: 'day3', slots: 120 },
  ];

  // Helper: get images
  const images = qurbani ? (qurbani.QurbaniImages || qurbani.qurbaniImages || []) : [];
  const mainImageUrl = images[activeImageIndex]?.imageUrl
    ? `${API_BASE_URL.replace('/api', '')}${images[activeImageIndex].imageUrl}`
    : require('../../assets/default-product.png');

  // Helper: get SKU and price range
  const isPakistan = country === 'PAK';
  const sku = isPakistan ? qurbani?.skunopak : qurbani?.skunous;
  const priceStart = isPakistan ? qurbani?.priceforpak : qurbani?.priceforus;
  const priceEnd = isPakistan ? qurbani?.endpriceforpak : qurbani?.endpriceforus;
  const currency = isPakistan ? 'PKR' : 'USD';

  // Helper: get category
  const category = qurbani?.catagory || '';

  // Helper: description
  const description = qurbani?.description || qurbani?.qurbaniDescription || '';

  // Wishlist logic
  const inWishlist = qurbani ? isInWishlist(qurbani.id) : false;
  const handleWishlistToggle = () => {
    if (!qurbani) return;
    
    if (inWishlist) {
      removeFromWishlist(qurbani.id);
      Alert.alert('Removed', 'Item removed from your wishlist');
    } else {
      // Accept Qurbani as wishlist item (if wishlist expects Product, map fields accordingly)
      addToWishlist({
        ...qurbani,
        productName: qurbani.title || qurbani.qurbaniName || '',
        productDescription: qurbani.description || qurbani.qurbaniDescription || '',
        id: qurbani.id,
        // Add any other required Product fields with fallback values
      } as any);
      Alert.alert('Added to Wishlist', 'Item added to your wishlist');
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!selectedDay) {
      setAddToCartStatus('error');
      Alert.alert('Select Day', 'Please select a day before adding to cart.');
      return;
    }
    
    setAddingToCart(true);
    try {
    if (qurbani) {
      addItem({
        id: qurbani.id,
          name: qurbani.title || qurbani.qurbaniName || '',
          price: priceEnd || priceStart || 0,
        quantity: 1,
          image: { uri: mainImageUrl },
        type: 'qurbani',
          day: selectedDay,
        });
        setAddToCartStatus('success');
        Alert.alert('Added to Cart', 'Qurbani has been added to your cart.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  // Render description WebView - Improved to ensure full content is visible
  const renderDescription = () => {
    if (!description) return null;
    
    // Create HTML content with improved script to calculate height
    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
          <style>
            body {
              font-family: -apple-system, system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: ${theme.colors.textSecondary};
              font-size: 14px;
              line-height: 1.5;
              margin: 0;
              padding: 0;
            }
            h1, h2, h3, h4, h5, h6 {
              color: ${theme.colors.text};
              margin-top: 16px;
              margin-bottom: 8px;
            }
            h3 {
              font-size: 18px;
            }
            h4 {
              font-size: 16px;
            }
            p {
              margin-top: 8px;
              margin-bottom: 8px;
            }
            strong {
              font-weight: bold;
              color: ${theme.colors.text};
            }
            ul, ol {
              padding-left: 20px;
              margin-top: 8px;
              margin-bottom: 8px;
            }
            li {
              margin-bottom: 4px;
            }
            hr {
              border: none;
              height: 1px;
              background-color: ${theme.colors.border};
              margin: 16px 0;
            }
          </style>
        </head>
        <body>
          ${description}
          <script>
            // More reliable height calculation
            function updateHeight() {
              const docHeight = Math.max(
                document.body.scrollHeight, 
                document.body.offsetHeight, 
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight, 
                document.documentElement.offsetHeight
              );
              window.ReactNativeWebView.postMessage(docHeight.toString());
    }
    
            // Run height calculation after content is fully loaded
            document.addEventListener('DOMContentLoaded', function() {
              setTimeout(updateHeight, 300);
            });
            
            // Backup in case DOMContentLoaded doesn't fire
            window.onload = function() {
              setTimeout(updateHeight, 500);
            };
            
            // Update once more after a longer delay to catch any delayed rendering
            setTimeout(updateHeight, 1000);
          </script>
        </body>
      </html>
    `;
    
    return (
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={{ 
          height: webViewHeight,
          width: windowWidth - 32,
          opacity: 0.99, // Fix for some Android WebView rendering issues
          marginBottom: 0 // Remove bottom margin
        }}
        scrollEnabled={true} // Allow scrolling within the WebView for long content
        originWhitelist={['*']}
        showsVerticalScrollIndicator={true}
        scalesPageToFit={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          const height = parseInt(event.nativeEvent.data);
          if (!isNaN(height) && height > 0) {
            // Add a small buffer to ensure content isn't cut off
            setWebViewHeight(height + 10);
          }
        }}
        onError={(e) => console.error('WebView error:', e.nativeEvent)}
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
      </View>
    );
  }
  if (error || !qurbani) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>{error || 'Qurbani not found'}</Text>
      </View>
    );
  }

  // Header bar
  const cartItems = useCartStore.getState().items;
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      {addingToCart && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
        </View>
      )}
      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={handleWishlistToggle}>
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={24}
              color={inWishlist ? theme.colors.error : theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Cart' as never)}>
            <Ionicons name="cart-outline" size={24} color={theme.colors.text} />
            {cartItems.length > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.brand }]}> 
                <Text style={styles.badgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingBottom: BOTTOM_BAR_HEIGHT + 10 // Increased padding to ensure content isn't hidden
        }}
      >
        {/* Image carousel */}
        <View style={styles.carouselContainer}>
          <Image source={typeof mainImageUrl === 'string' ? { uri: mainImageUrl } : mainImageUrl} style={styles.mainImage} resizeMode="contain" />
          {images.length > 1 && (
            <FlatList
              data={images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, idx) => `thumb_${idx}`}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => setActiveImageIndex(index)}>
                  <Image
                    source={{ uri: `${API_BASE_URL.replace('/api', '')}${item.imageUrl}` }}
                    style={[styles.thumbnail, index === activeImageIndex && { borderColor: theme.colors.primary }]}
                  />
                </TouchableOpacity>
              )}
              style={styles.thumbnailList}
            />
          )}
        </View>
        {/* Title, subtitle, category */}
        <View style={styles.headerSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{qurbani.title || qurbani.qurbaniName}</Text>
          {qurbani.subtitle && <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{qurbani.subtitle}</Text>}
          {category && <Text style={[styles.category, { color: theme.colors.primary }]}>{category}</Text>}
        </View>
        {/* SKU and price range */}
        <View style={styles.skuPriceSection}>
          {sku && <Text style={[styles.sku, { color: theme.colors.textSecondary }]}>SKU: {sku}</Text>}
          <Text style={[styles.priceRange, { color: theme.colors.brand }]}> {currency} {priceStart} - {priceEnd}</Text>
        </View>
        {/* Description section */}
        <View style={styles.descriptionSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description</Text>
          {renderDescription()}
        </View>
        {/* Day/slot dropdown */}
        <View style={styles.dayDropdownSection}>
          <Text style={[styles.dayLabel, { color: theme.colors.text }]}>Select Day</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll}>
            {daySlots.map((day) => (
              <TouchableOpacity
                key={day.value}
                style={[
                  styles.dayOption, 
                  { backgroundColor: selectedDay === day.value ? theme.colors.primary : theme.colors.cardBackground }
                ]}
                onPress={() => setSelectedDay(day.value)}
              >
                <Text style={{ 
                  color: selectedDay === day.value ? 'white' : theme.colors.text,
                  fontWeight: selectedDay === day.value ? '600' : 'normal'
                }}>
                  {day.label} ({day.slots} slots)
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {/* Sticky bottom bar with improved elevation to separate from content */}
      <View style={[
        styles.bottomBar, 
        { 
          paddingBottom: insets.bottom || 16,
          backgroundColor: theme.colors.background,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 5
        }
      ]}>
        <View style={styles.totalPriceContainer}>
          <Text style={[styles.totalPriceLabel, { color: theme.colors.textSecondary }]}>Price</Text>
          <Text style={[styles.totalPrice, { color: theme.colors.brand }]}>
            {currency} {priceEnd || priceStart || 0}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addToCartButton, 
            { backgroundColor: selectedDay ? theme.colors.brand : theme.colors.disabled }
          ]}
          onPress={handleAddToCart}
          disabled={!selectedDay || addingToCart}
        >
          <Ionicons name="cart-outline" size={20} color="white" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 8, 
    paddingTop: 8, 
    paddingBottom: 4 
  },
  headerIcon: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 2, 
    marginRight: 2 
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  badge: { 
    position: 'absolute', 
    top: -5, 
    right: -5, 
    minWidth: 18, 
    height: 18, 
    borderRadius: 9, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4 
  },
  badgeText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  carouselContainer: { 
    alignItems: 'center', 
    marginTop: 8 
  },
  mainImage: { 
    width: '90%', 
    height: 220, 
    borderRadius: 12, 
    backgroundColor: '#f5f5f5' 
  },
  thumbnailList: { 
    marginTop: 8 
  },
  thumbnail: { 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    marginRight: 8, 
    borderWidth: 2, 
    borderColor: 'transparent' 
  },
  headerSection: { 
    padding: 16, 
    paddingBottom: 0 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' 
  },
  subtitle: {
    fontSize: 16, 
    marginTop: 4 
  },
  category: { 
    fontSize: 14, 
    marginTop: 4, 
    fontWeight: '600' 
  },
  skuPriceSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    marginTop: 12 
  },
  sku: { 
    fontSize: 14, 
    marginRight: 16 
  },
  priceRange: { 
    fontSize: 18,
    fontWeight: 'bold' 
  },
  descriptionSection: { 
    paddingHorizontal: 16,
    marginBottom: 10 // Add a small margin at the bottom
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  dayDropdownSection: { 
    paddingHorizontal: 16,
    marginTop: 10 // Add a small margin at the top
  },
  dayLabel: { 
    fontSize: 16,
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  dayScroll: { 
    flexDirection: 'row' 
  },
  dayOption: { 
    paddingVertical: 10, 
    paddingHorizontal: 18, 
    borderRadius: 20, 
    marginRight: 12 
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalPriceContainer: {
    flex: 1,
    marginRight: 16,
  },
  totalPriceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 140,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8 
  },
});

export default QurbaniDetailsScreen;