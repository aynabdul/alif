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

interface QurbaniCardProps {
  qurbani: Qurbani;
}

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // Full width card with padding

const QurbaniCard: React.FC<QurbaniCardProps> = ({ qurbani }) => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { theme } = useTheme();
  const { country } = useCartStore();
  
  // Get price based on country
  const price = country === 'us' 
    ? qurbani.qurbaniPriceUSA 
    : qurbani.qurbaniPricePak;
  
  const currencySymbol = country === 'us' ? '$' : '₨';
  
  // Format date
  const qurbaniDate = new Date(qurbani.qurbaniDate);
  const formattedDate = qurbaniDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Get the first qurbani image or use placeholder
  const imageUrl = qurbani.qurbaniImages && qurbani.qurbaniImages.length > 0
    ? qurbani.qurbaniImages[0].imageUrl
    : IMAGE_PLACEHOLDERS.PRODUCT;
  
  const handlePress = () => {
    navigation.navigate('QurbaniDetails', { 
      packageId: qurbani.id.toString()
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
            {qurbani.qurbaniName}
          </Text>
          
          <Text 
            style={styles.description}
            numberOfLines={3}
          >
            {qurbani.qurbaniDescription}
          </Text>
          
          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={[styles.price, { color: theme.colors.primary }]}>
                {currencySymbol}{price.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.quantityContainer}>
              <Text style={styles.quantityLabel}>Available:</Text>
              <Text style={[styles.quantity, { color: qurbani.qurbaniQuantity > 0 ? theme.colors.success : theme.colors.error }]}>
                {qurbani.qurbaniQuantity} {qurbani.qurbaniQuantity === 1 ? 'animal' : 'animals'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.detailsButton, { backgroundColor: theme.colors.primary }]}
            onPress={handlePress}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
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
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});

export default QurbaniCard; 