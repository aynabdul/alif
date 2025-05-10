import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../types/navigation.types';
import { Qurbani } from '../../types/api.types';
import { useTheme } from '../../theme/ThemeContext';
import { useCartStore } from '../../stores/cartStore';
import { IMAGE_PLACEHOLDERS } from '../../constants';
import Card from './Card';
import { API_BASE_URL } from '../../config/api';

interface QurbaniCardProps {
  qurbani: Qurbani;
}

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // Full width card with padding

const QurbaniCard: React.FC<QurbaniCardProps> = ({ qurbani }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { theme } = useTheme();
  const { addItem, country } = useCartStore();
  
  // Get price based on country and support both naming conventions
  const price = country === 'US' 
    ? (qurbani.qurbaniPriceUSA || qurbani.priceforus || 0)
    : (qurbani.qurbaniPricePak || qurbani.priceforpak || 0);
  
  const currencySymbol = country === 'US' ? '$' : '₨';
  
  // Get name and description
  const name = qurbani.qurbaniName || qurbani.title || '';
  const description = qurbani.qurbaniDescription || qurbani.description || '';
  
  // Format date if available, or use placeholder
  const formattedDate = qurbani.qurbaniDate 
    ? new Date(qurbani.qurbaniDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Available for booking';
  
  // Get the first qurbani image or use placeholder
  let imageUrl = IMAGE_PLACEHOLDERS.PRODUCT;
  
  if (qurbani.qurbaniImages && qurbani.qurbaniImages.length > 0 && qurbani.qurbaniImages[0].imageUrl) {
    imageUrl = qurbani.qurbaniImages[0].imageUrl;
  } else if (qurbani.QurbaniImages && qurbani.QurbaniImages.length > 0 && qurbani.QurbaniImages[0].imageUrl) {
    imageUrl = qurbani.QurbaniImages[0].imageUrl;
  }
  
  // If the image URL is relative, prepend the API base URL
  if (imageUrl && imageUrl.startsWith('/')) {
    const baseUrlWithoutApi = API_BASE_URL.replace(/\/api$/, '');
    imageUrl = `${baseUrlWithoutApi}${imageUrl}`;
  }
  
  const handlePress = () => {
    navigation.navigate('QurbaniDetails', { 
      qurbaniId: qurbani.id
    });
  };

  const handleAddToCart = () => {
    addItem({
      id: qurbani.id,
      name: name,
      price: price,
      quantity: 1,
      image: { uri: imageUrl },
      type: 'qurbani'
    });
  };
  
  return (
    <Card
      style={styles.card}
      onPress={handlePress}
    >
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={16} color={theme.colors.primary} />
        <Text style={[styles.date, { color: theme.colors.primary }]}>
          {formattedDate}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Image 
          source={{ uri: imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        <View style={styles.detailsContainer}>
          <Text 
            style={styles.title}
            numberOfLines={2}
          >
            {name}
          </Text>
          
          <Text 
            style={styles.description}
            numberOfLines={3}
          >
            {description}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: theme.colors.primary }]}>
                {currencySymbol}{price.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Available:</Text>
              <Text style={[styles.quantity, { 
                color: (qurbani.qurbaniQuantity || 10) > 0 
                  ? theme.colors.success 
                  : theme.colors.error 
              }]}>
                {qurbani.qurbaniQuantity || 10} {(qurbani.qurbaniQuantity || 10) === 1 ? 'animal' : 'animals'}
              </Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}
              onPress={handlePress}
            >
              <Text style={styles.detailsButtonText}>View Details</Text>
              <Ionicons name="arrow-forward" size={16} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.cartButton, { backgroundColor: theme.colors.secondary }]}
              onPress={handleAddToCart}
            >
              <Ionicons name="cart-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    margin: 16,
    padding: 0,
    overflow: 'hidden',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  content: {
    flexDirection: 'row',
    padding: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QurbaniCard; 