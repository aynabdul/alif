// src/components/ProductCard.tsx
import React, { memo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useWishlistStore } from '../../stores/wishlistStore';
import { useCartStore } from '../../stores/cartStore';
import { Product } from '../../types/api.types';
import { API_BASE_URL } from '../../config/api';

export interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const { theme, country } = useTheme();
  const { addItem } = useCartStore();
  const { isInWishlist, addProductToWishlist, removeFromWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);

  const isPakistan = country === 'PAK';
  const originalPrice = isPakistan ? product.OriginalPricePak : product.OriginalPriceUSA;
  const discountedPrice = isPakistan ? product.PriceAfterDiscountPak : product.PriceAfterDiscountUSA;
  const discountPercentage = isPakistan ? product.discountOfferinPak : product.discountOfferinUSA;
  const isDiscounted = isPakistan ? product.IsDiscountedProductInPak : product.IsDiscountedProductInUSA;
  const currency = isPakistan ? 'PKR' : '$';

  const imageUrl =
    product.ProductImages && product.ProductImages.length > 0
      ? {
          uri: `${API_BASE_URL}${product.ProductImages[0].imageUrl}`,
          width: 150,
          height: 140,
          cache: 'force-cache' as 'force-cache',
        }
      : require('../../../assets/default-product.png');

  const handleWishlistPress = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      Alert.alert('Removed', `${product.productName} has been removed from your wishlist.`);
    } else {
      addProductToWishlist(product);
      Alert.alert('Added', `${product.productName} has been added to your wishlist.`);
    }
  };

  const handleAddToCart = () => {
    const price = isDiscounted ? discountedPrice : originalPrice;
    addItem({
      id: product.id,
      name: product.productName,
      price,
      quantity: 1,
      image: imageUrl,
      categoryId: product.categoryId,
      currency,
    });
    Alert.alert('Success', `${product.productName} has been added to your cart.`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.cardBackground }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {isDiscounted && discountPercentage > 0 && (
        <View style={[styles.discountTag, { backgroundColor: theme.colors.brand }]}>
          <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
        </View>
      )}
      
      <Image
        source={imageUrl}
        style={styles.image}
        resizeMode="contain"
      />
      
      <View style={styles.detailsContainer}>
        <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
          {product.productName}
        </Text>
        <View style={styles.priceRow}>
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
          {product.Category && (
            <View style={styles.categoryContainer}>
              <Text style={[styles.category, { color: theme.colors.textSecondary }]}>
                {product.Category.categoryName}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.wishlistButton, { backgroundColor: theme.colors.secondary }]}
          onPress={handleWishlistPress}
        >
          <Ionicons
            name={inWishlist ? 'heart' : 'heart-outline'}
            size={20}
            color={inWishlist ? theme.colors.error : 'white'}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.cartButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 170, 
    height: 310,
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  discountTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  discountText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 170, // Increased height for better proportions
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  detailsContainer: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 1,
    height: 32,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  categoryContainer: {
    alignItems: 'flex-end',
  },
  category: {
    fontSize: 10,
    fontStyle: 'italic',
    maxWidth: 50,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ProductCard);