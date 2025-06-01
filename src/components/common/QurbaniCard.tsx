// src/components/qurbani/QurbaniCard.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../types/navigation.types';
import { Qurbani } from '../../types/api.types';
import { useTheme } from '../../theme/ThemeContext';
import { useCartStore } from '../../stores/cartStore';
import { useWishlistStore } from '../../stores/wishlistStore';
import { IMAGE_PLACEHOLDERS } from '../../constants';
import { API_BASE_URL } from '../../config/api';

interface QurbaniCardProps {
  qurbani: Qurbani;
  onPress?: () => void;
}

const QurbaniCard: React.FC<QurbaniCardProps> = ({ qurbani, onPress }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { theme, country } = useTheme();
  const { addItem } = useCartStore();
  const { addQurbaniToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(qurbani.id);
  
  // Get price based on country
  const isPakistan = country === 'PAK';
  const startPrice = isPakistan ? 
    (qurbani.priceforpak || qurbani.qurbaniPricePak || 0) : 
    (qurbani.priceforus || qurbani.qurbaniPriceUSA || 0);
  
  const endPrice = isPakistan ? 
    (qurbani.endpriceforpak || qurbani.qurbaniPricePak || startPrice) : 
    (qurbani.endpriceforus || qurbani.qurbaniPriceUSA || startPrice);
  
  const currencySymbol = isPakistan ? 'PKR' : '$';
  
  // Get name, subtitle, and category
  const name = qurbani.qurbaniName || qurbani.title || 'Unnamed Qurbani';
  const subtitle = qurbani.subtitle || '';
  const category = qurbani.catagory || qurbani.catagory || '';
  
  // Get the first qurbani image or use placeholder
  let imageUrl = IMAGE_PLACEHOLDERS.PRODUCT;
  
  if (qurbani.qurbaniImages && qurbani.qurbaniImages.length > 0 && qurbani.qurbaniImages[0].imageUrl) {
    imageUrl = qurbani.qurbaniImages[0].imageUrl;
  } else if (qurbani.QurbaniImages && qurbani.QurbaniImages.length > 0 && qurbani.QurbaniImages[0].imageUrl) {
    imageUrl = qurbani.QurbaniImages[0].imageUrl;
  }
  
  if (imageUrl && imageUrl.startsWith('/')) {
    imageUrl = `${API_BASE_URL}${imageUrl}`;
  }
  
  const handlePress = () => {
    navigation.navigate('QurbaniDetails', { qurbaniId: qurbani.id });
  };

  const handleAddToCart = () => {
    navigation.navigate('QurbaniDetails', { qurbaniId: qurbani.id });
  };

  const handleWishlistPress = () => {
    if (inWishlist) {
      removeFromWishlist(qurbani.id);
      Alert.alert('Removed', `${name} has been removed from your wishlist.`);
    } else {
      addQurbaniToWishlist(qurbani);
      Alert.alert('Added', `${name} has been added to your wishlist.`);
    }
  };
  
  // Format price display as range only if there's an actual range
  const shouldShowRange = startPrice !== endPrice;
  const priceDisplay = shouldShowRange
    ? `${currencySymbol}${startPrice.toFixed(2)} - ${currencySymbol}${endPrice.toFixed(2)}`
    : `${currencySymbol}${startPrice.toFixed(2)}`;
  
  const cardPressHandler = onPress || handlePress;
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.cardBackground }]}
      onPress={cardPressHandler}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      
      <View style={styles.detailsContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={2}>
            {name}
          </Text>
        </View>
        
        {subtitle && (
          <Text 
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        )}
        
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: theme.colors.brand }]}>
            {priceDisplay}
          </Text>
          {shouldShowRange}
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
    width: 202,
    height: 320,
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  detailsContainer: {
    padding: 8,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 1,
    height: 32,
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceNote: {
    fontSize: 10,
    marginTop: 2,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
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

export default QurbaniCard;