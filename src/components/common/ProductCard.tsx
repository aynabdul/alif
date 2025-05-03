import React, { memo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useWishlistStore } from '../../stores/wishlistStore';
import { Product } from '../../types/api.types';
import { API_BASE_URL } from '../../config/api';

export interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  onWishlistPress?: (isInWishlist: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, onWishlistPress }) => {
  const { theme, country } = useTheme();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);

  const isPakistan = country === 'PAK';
  const originalPrice = isPakistan ? product.OriginalPricePak : product.OriginalPriceUSA;
  const discountedPrice = isPakistan ? product.PriceAfterDiscountPak : product.PriceAfterDiscountUSA;
  const discountPercentage = isPakistan ? product.discountOfferinPak : product.discountOfferinUSA;
  const isDiscounted = isPakistan ? product.IsDiscountedProductInPak : product.IsDiscountedProductInUSA;
  const currency = isPakistan ? 'Rs.' : '$';

  const imageUrl =
    product.ProductImages && product.ProductImages.length > 0
      ? {
          uri: `${API_BASE_URL.replace('/api', '')}${product.ProductImages[0].imageUrl}`,
          width: 140,
          height: 100,
          cache: 'force-cache' as 'force-cache',
        }
      : require('../../../assets/default-product.png');

  const handleWishlistPress = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      // Minimal data for wishlist
      const minimalProductData = {
        id: product.id,
        productName: product.productName,
        OriginalPricePak: product.OriginalPricePak,
        OriginalPriceUSA: product.OriginalPriceUSA,
        PriceAfterDiscountPak: product.PriceAfterDiscountPak,
        PriceAfterDiscountUSA: product.PriceAfterDiscountUSA,
        IsDiscountedProductInPak: product.IsDiscountedProductInPak,
        IsDiscountedProductInUSA: product.IsDiscountedProductInUSA,
        discountOfferinPak: product.discountOfferinPak,
        discountOfferinUSA: product.discountOfferinUSA,
        categoryId: product.categoryId,
        ProductImages: product.ProductImages
          ? [{ imageUrl: product.ProductImages[0]?.imageUrl || '' }]
          : [],
      } as Product;
      addToWishlist(minimalProductData);
    }
    if (onWishlistPress) {
      onWishlistPress(!inWishlist);
    }
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
      <TouchableOpacity
        style={styles.wishlistButton}
        onPress={handleWishlistPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={inWishlist ? 'heart' : 'heart-outline'}
          size={20}
          color={inWishlist ? theme.colors.error : theme.colors.text}
        />
      </TouchableOpacity>
      <Image
        source={imageUrl}
        style={styles.image}
        resizeMode="contain"
        resizeMethod="resize"
        progressiveRenderingEnabled={true}
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    borderRadius: 8,
    marginHorizontal: 6,
    marginBottom: 12,
    // Removed shadow for performance
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2,
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
  wishlistButton: {
    position: 'absolute',
    top: 6,
    right: 6,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 4,
  },
  image: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  detailsContainer: {
    padding: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    height: 36,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 10,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  categoryContainer: {
    alignItems: 'flex-end',
  },
  category: {
    fontSize: 9,
    fontStyle: 'italic',
    maxWidth: 50,
    textAlign: 'right',
  },
});

export default memo(ProductCard);