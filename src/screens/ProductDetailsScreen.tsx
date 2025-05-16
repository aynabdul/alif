import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AppStackParamList, AppStackNavigationProp } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { productService } from '../services/api.service';
import { Product } from '../types/api.types';
import WebView from 'react-native-webview';
import { API_BASE_URL } from '../config/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ProductDetailsRouteProp = RouteProp<AppStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = () => {
  const { theme, country } = useTheme();
  const navigation = useNavigation<AppStackNavigationProp>();
  const route = useRoute<ProductDetailsRouteProp>();
  const { productId } = route.params;
  const { addItem, items: cartItems } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const insets = useSafeAreaInsets();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [webViewHeight, setWebViewHeight] = useState(300);
  const webViewRef = useRef<WebView>(null);

  const windowWidth = Dimensions.get('window').width;
  const isInCart = cartItems.some((item) => item.id === productId);
  const inWishlist = product ? isInWishlist(product.id) : false;

  const isPakistan = country === 'PAK';
  const originalPrice = product ? (isPakistan ? product.OriginalPricePak : product.OriginalPriceUSA) : 0;
  const discountedPrice = product ? (isPakistan ? product.PriceAfterDiscountPak : product.PriceAfterDiscountUSA) : 0;
  const isDiscounted = product ? (isPakistan ? product.IsDiscountedProductInPak : product.IsDiscountedProductInUSA) : false;
  const currency = isPakistan ? 'Rs.' : '$';
  const inStock = product ? (isPakistan ? product.quantityForPak > 0 : product.quantityForUSA > 0) : false;

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.getProductById(productId);
      if (response.success && response.data) {
        setProduct(response.data);
        setActiveImageIndex(0);
      } else {
        setError('Failed to fetch product details');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product details:', err);
      setError('Failed to load product details. Please try again.');
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      const price = isDiscounted ? discountedPrice : originalPrice;
      const imageUrl =
        product.ProductImages && product.ProductImages.length > 0
          ? `${API_BASE_URL.replace('/api', '')}${product.ProductImages[0].imageUrl}`
          : null;

      addItem({
        id: product.id,
        name: product.productName,
        price,
        quantity,
        image: imageUrl,
        categoryId: product.categoryId,
        currency,
      });
      Alert.alert('Added to Cart', `${product.productName} has been added to your cart.`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleUpdateQuantity = (value: number) => {
    if (quantity + value < 1) return;
    if (product) {
      const maxStock = isPakistan ? product.quantityForPak : product.quantityForUSA;
      if (quantity + value > maxStock) return;
    }
    setQuantity(quantity + value);
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (inWishlist) {
      removeFromWishlist(product.id);
      Alert.alert('Removed', 'Item removed from your wishlist');
    } else {
      addToWishlist(product);
      Alert.alert('Added to Wishlist', 'Item added to your wishlist');
    }
  };

  const renderDescription = () => {
    if (!product) return null;
    
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
          ${product.productDescription || '<p>No description available.</p>'}
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

  if (error || !product) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>{error || 'Product not found'}</Text>
          <TouchableOpacity style={[styles.retryButton, { borderColor: theme.colors.brand }]} onPress={fetchProductDetails}>
            <Text style={[styles.retryText, { color: theme.colors.brand }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const images =
    product.ProductImages && product.ProductImages.length > 0
      ? product.ProductImages.map((img) => ({ uri: `${API_BASE_URL.replace('/api', '')}${img.imageUrl}` }))
      : [require('../../assets/default-product.png')];

  // Add a constant for bottom bar height
  const BOTTOM_BAR_HEIGHT = 80 + (insets.bottom || 16);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {addingToCart && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
        </View>
      )}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={handleWishlistToggle}
          >
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={24}
              color={inWishlist ? theme.colors.error : theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Cart')}
          >
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
          <Image 
            source={images[activeImageIndex]} 
            style={styles.mainImage} 
            resizeMode="contain" 
          />
          {images.length > 1 && (
            <FlatList
              data={images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => `thumb_${index}`}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => setActiveImageIndex(index)}>
                  <Image
                    source={item}
                    style={[
                      styles.thumbnail, 
                      index === activeImageIndex && { borderColor: theme.colors.primary }
                    ]}
                  />
                </TouchableOpacity>
              )}
              style={styles.thumbnailList}
            />
          )}
        </View>
        <View style={styles.contentContainer}>
          {product.Category && (
            <Text style={[styles.category, { color: theme.colors.textSecondary }]}>{product.Category.categoryName}</Text>
          )}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{product.productName}</Text>
            <View>
              {isDiscounted && (
                <Text style={[styles.originalPrice, { color: theme.colors.textSecondary }]}>
                  {currency} {originalPrice.toFixed(2)}
                </Text>
              )}
              <Text style={[styles.price, { color: isDiscounted ? theme.colors.brand : theme.colors.text }]}>
                {currency} {(isDiscounted ? discountedPrice : originalPrice).toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.stockContainer}>
            {inStock ? (
              <Text style={[styles.inStock, { color: theme.colors.success }]}>In Stock</Text>
            ) : (
              <Text style={[styles.outOfStock, { color: theme.colors.error }]}>Out of Stock</Text>
            )}
          </View>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description</Text>
          <View style={styles.descriptionContainer}>
            {renderDescription()}
          </View>
          {inStock && (
            <View style={styles.quantitySection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quantity</Text>
              <View style={styles.quantityControls}>
                <TouchableOpacity
                  style={[styles.quantityButton, { backgroundColor: theme.colors.border }]}
                  onPress={() => handleUpdateQuantity(-1)}
                >
                  <Ionicons name="remove" size={18} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.quantityValue, { color: theme.colors.text }]}>{quantity}</Text>
                <TouchableOpacity
                  style={[styles.quantityButton, { backgroundColor: theme.colors.border }]}
                  onPress={() => handleUpdateQuantity(1)}
                >
                  <Ionicons name="add" size={18} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {inStock && (
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
            <Text style={[styles.totalPriceLabel, { color: theme.colors.textSecondary }]}>Total Price</Text>
            <Text style={[styles.totalPrice, { color: theme.colors.brand }]}>
              {currency} {((isDiscounted ? discountedPrice : originalPrice) * quantity).toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.addToCartButton, { backgroundColor: theme.colors.brand }]}
            onPress={handleAddToCart}
            disabled={addingToCart}
          >
            <Ionicons name="cart-outline" size={20} color="white" />
            <Text style={styles.addToCartText}>{isInCart ? 'Go to Cart' : 'Add to Cart'}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 2,
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
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  carouselContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  mainImage: {
    width: '90%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  thumbnailList: {
    marginTop: 8,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  category: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    textAlign: 'right',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  inStock: {
    fontSize: 14,
    fontWeight: '500',
  },
  outOfStock: {
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  descriptionContainer: {
    marginBottom: 10,
  },
  showMoreButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
  quantitySection: {
    marginBottom: 24,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
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
    backgroundColor: 'white',
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
    marginLeft: 8,
  },
});

export default ProductDetailsScreen;