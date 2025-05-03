import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { AppStackParamList, AppStackNavigationProp } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import Button from '../components/common/Button';
import { productService } from '../services/api.service';
import { Product } from '../types/api.types';
import WebView from 'react-native-webview';
import { API_BASE_URL } from '../config/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ProductDetailsRouteProp = RouteProp<AppStackParamList, 'ProductDetails'>;

const TAB_BAR_HEIGHT = 60; 

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
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
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
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading product details...</Text>
        </View>
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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {addingToCart && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: theme.colors.cardBackground }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.cardBackground }]}
            onPress={handleWishlistToggle}
          >
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={24}
              color={inWishlist ? theme.colors.error : theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: theme.colors.cardBackground }]}
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
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom }}
      >
        <View style={styles.imageContainer}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => `image_${index}`}
            onMomentumScrollEnd={(e) => {
              const newIndex = Math.floor(e.nativeEvent.contentOffset.x / windowWidth);
              setActiveImageIndex(newIndex);
            }}
            renderItem={({ item }) => (
              <Image source={item} style={[styles.mainImage, { width: windowWidth }]} resizeMode="contain" />
            )}
          />
          {images.length > 1 && (
            <View style={styles.imageDots}>
              {images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.dot, { backgroundColor: activeImageIndex === index ? theme.colors.brand : theme.colors.border }]}
                  onPress={() => setActiveImageIndex(index)}
                />
              ))}
            </View>
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
            <WebView
              source={{
                html: `
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body {
                          font-family: -apple-system, system-ui;
                          color: ${theme.colors.textSecondary};
                          font-size: 14px;
                          line-height: 1.5;
                          margin: 0;
                          padding: 0;
                        }
                        p {
                          margin: 0;
                          padding: 0;
                        }
                      </style>
                    </head>
                    <body>
                      ${product.productDescription || '<p>No description available.</p>'}
                    </body>
                  </html>
                `
              }}
              style={{ height: 200 }}
              scrollEnabled={true}
              originWhitelist={['*']}
              showsVerticalScrollIndicator={false}
            />
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
          {inStock && (
            <View style={styles.cartSection}>
              <View style={styles.totalPriceContainer}>
                <Text style={[styles.totalPriceLabel, { color: theme.colors.textSecondary }]}>Total Price</Text>
                <Text style={[styles.totalPrice, { color: theme.colors.brand }]}>
                  {currency} {((isDiscounted ? discountedPrice : originalPrice) * quantity).toFixed(2)}
                </Text>
              </View>
              <Button
                title={isInCart ? 'Go to Cart' : 'Add to Cart'}
                onPress={handleAddToCart}
                style={{ backgroundColor: theme.colors.brand }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
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
  imageContainer: {
    marginBottom: 24,
  },
  mainImage: {
    height: 250,
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  category: {
    fontSize: 14,
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
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
    marginBottom: 24,
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
  cartSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
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
});

export default ProductDetailsScreen;