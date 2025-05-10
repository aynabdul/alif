import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { qurbaniService } from '../services/api.service';
import { StatusBar } from 'expo-status-bar';
import { Qurbani } from '../types/api.types';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types/navigation.types';
import GuideCard from '../components/Qurbani/GuideCard';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../stores/cartStore';
import { IMAGE_PLACEHOLDERS } from '../constants';
import { API_BASE_URL } from '../config/api';

const QurbaniBookingScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { addItem, country: storeCountry } = useCartStore();
  const [qurbanis, setQurbanis] = useState<Qurbani[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQurbanis();
  }, []);

  const fetchQurbanis = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching qurbanis for booking screen...');
      const response = await qurbaniService.getQurbanis();
      console.log('Qurbani booking screen response:', response);
      
      if (response.success && response.data) {
        console.log('Filtering qurbanis for booking:', response.data);
        const bookingQurbanis = response.data.filter(
          qurbani => qurbani.showinwhichpage === 'bookqurbani' || qurbani.showinwhichpage === 'booking'
        );
        console.log('Found booking qurbanis:', bookingQurbanis.length);
        setQurbanis(bookingQurbanis);
      } else {
        console.error('API returned success=false or no data:', response);
        setError(`Failed to fetch Qurbani options: ${response.message || 'Unknown error'}`);
      }
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching Qurbanis:', err);
      setError(`Failed to load Qurbani options: ${errorMessage}`);
      setLoading(false);
    }
  };

  // Helper function to process image URLs
  const getProcessedImageUrl = (imageUrl: string) => {
    if (imageUrl && imageUrl.startsWith('/')) {
      const baseUrlWithoutApi = API_BASE_URL.replace(/\/api$/, '');
      return `${baseUrlWithoutApi}${imageUrl}`;
    }
    return imageUrl;
  };

  const handleQurbaniPress = (qurbaniId: string | number) => {
    navigation.navigate('QurbaniDetails', { qurbaniId });
  };

  const handleAddToCart = (qurbani: Qurbani) => {
    const name = qurbani.title || qurbani.qurbaniName || '';
    const price = storeCountry === 'US' 
      ? (qurbani.priceforus || qurbani.qurbaniPriceUSA || 0) 
      : (qurbani.priceforpak || qurbani.qurbaniPricePak || 0);
      
    const imageUrl = getFirstImageUrl(qurbani);
    
    addItem({
      id: qurbani.id,
      name: name,
      price: price,
      quantity: 1,
      image: { uri: imageUrl },
      type: 'qurbani',
    });
  };

  const getFirstImageUrl = (qurbani: Qurbani) => {
    let imageUrl = IMAGE_PLACEHOLDERS.PRODUCT;
    
    if (qurbani.qurbaniImages && qurbani.qurbaniImages.length > 0) {
      imageUrl = qurbani.qurbaniImages[0].imageUrl;
    } else if (qurbani.QurbaniImages && qurbani.QurbaniImages.length > 0) {
      imageUrl = qurbani.QurbaniImages[0].imageUrl;
    }
    
    return getProcessedImageUrl(imageUrl);
  };

  const getDisplayPrice = (qurbani: Qurbani) => {
    const price = storeCountry === 'US' 
      ? (qurbani.priceforus || qurbani.qurbaniPriceUSA || 0)
      : (qurbani.priceforpak || qurbani.qurbaniPricePak || 0);
      
    const currency = storeCountry === 'US' ? 'USD' : 'PKR';
    const discount = price * 0.1; // Example: 10% discount
    const discountedPrice = price - discount;

    return { price, discountedPrice, currency, hasDiscount: true };
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading Qurbani options...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>Book your Qurbani</Text>
        <GuideCard />
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        ) : qurbanis.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No Qurbani options available for booking
            </Text>
          </View>
        ) : (
          <View style={styles.qurbaniList}>
            {qurbanis.map(qurbani => {
              const { price, discountedPrice, currency, hasDiscount } = getDisplayPrice(qurbani);
              const imageUrl = getFirstImageUrl(qurbani);
              const name = qurbani.title || qurbani.qurbaniName || '';
              const subtitle = qurbani.subtitle || '';

              return (
                <TouchableOpacity
                  key={qurbani.id}
                  style={[styles.qurbaniCard, { backgroundColor: theme.colors.card }]}
                  onPress={() => handleQurbaniPress(qurbani.id)}
                >
                  <Image
                    source={{ uri: getProcessedImageUrl(imageUrl) }}
                    style={styles.qurbaniImage}
                    defaultSource={require('../../assets/default-product.png')}
                  />
                  <View style={styles.qurbaniInfo}>
                    <Text style={[styles.qurbaniTitle, { color: theme.colors.text }]}>
                      {name}
                    </Text>
                    <Text style={[styles.qurbaniSubtitle, { color: theme.colors.textSecondary }]}>
                      {subtitle}
                    </Text>
                    <View style={styles.priceRow}>
                      {hasDiscount ? (
                        <>
                          <Text style={[styles.price, { color: theme.colors.text, textDecorationLine: 'line-through' }]}>
                            {`${currency} ${price}`}
                          </Text>
                          <Text style={[styles.discountedPrice, { color: theme.colors.primary }]}>
                            {`${currency} ${discountedPrice}`}
                          </Text>
                        </>
                      ) : (
                        <Text style={[styles.price, { color: theme.colors.text }]}>
                          {`${currency} ${price}`}
                        </Text>
                      )}
                      <TouchableOpacity onPress={() => handleAddToCart(qurbani)}>
                        <Ionicons name="cart-outline" size={24} color={theme.colors.primary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  qurbaniList: {
    gap: 16,
  },
  qurbaniCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qurbaniImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  qurbaniInfo: {
    flex: 1,
  },
  qurbaniTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  qurbaniSubtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default QurbaniBookingScreen;