import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { QurbaniDetailsRouteProp } from '../types/navigation.types';
import { qurbaniService } from '../services/api.service';
import { Qurbani, QurbaniImage } from '../types/api.types';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../stores/cartStore';
import { IMAGE_PLACEHOLDERS } from '../constants';
import { API_BASE_URL } from '../config/api';

const QurbaniDetailsScreen = () => {
  const route = useRoute<QurbaniDetailsRouteProp>();
  const { theme } = useTheme();
  const { addItem, country: storeCountry } = useCartStore();
  const { qurbaniId } = route.params;

  const [qurbani, setQurbani] = useState<Qurbani | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQurbaniDetails();
  }, [qurbaniId]);

  const fetchQurbaniDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching qurbani details for ID:', qurbaniId, 'Type:', typeof qurbaniId);
      const response = await qurbaniService.getQurbaniById(qurbaniId);
      console.log('Qurbani details response:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        console.log('Setting qurbani data:', JSON.stringify(response.data, null, 2));
        setQurbani(response.data);
      } else {
        console.error('API returned success=false or no data:', JSON.stringify(response, null, 2));
        setError(`Failed to fetch Qurbani details: ${response.message || 'Unknown error'}`);
      }
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching Qurbani details:', err);
      setError(`Failed to load Qurbani details: ${errorMessage}`);
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

  const handleAddToCart = () => {
    if (qurbani) {
      const name = qurbani.title || qurbani.qurbaniName || '';
      const price = storeCountry === 'US' 
        ? (qurbani.priceforus || qurbani.qurbaniPriceUSA || 0) 
        : (qurbani.priceforpak || qurbani.qurbaniPricePak || 0);
      
      const imageUrl = getFirstImageUrl();
      
      addItem({
        id: qurbani.id,
        name: name,
        price: price,
        quantity: 1,
        image: { uri: imageUrl },
        type: 'qurbani',
      });
    }
  };

  const getFirstImageUrl = () => {
    if (!qurbani) return IMAGE_PLACEHOLDERS.PRODUCT;
    
    let imageUrl = IMAGE_PLACEHOLDERS.PRODUCT;
    
    if (qurbani.qurbaniImages && qurbani.qurbaniImages.length > 0) {
      imageUrl = qurbani.qurbaniImages[0].imageUrl;
    } else if (qurbani.QurbaniImages && qurbani.QurbaniImages.length > 0) {
      imageUrl = qurbani.QurbaniImages[0].imageUrl;
    }
    
    return getProcessedImageUrl(imageUrl);
  };

  const getDisplayPrice = () => {
    if (!qurbani) return { price: 0, discountedPrice: 0, currency: '', hasDiscount: false };
    
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
            Loading Qurbani details...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !qurbani) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error || 'Qurbani not found'}
          </Text>
        </View>
      </View>
    );
  }

  const { price, discountedPrice, currency, hasDiscount } = getDisplayPrice();
  const name = qurbani.title || qurbani.qurbaniName || '';
  const subtitle = qurbani.subtitle || '';
  const description = qurbani.description || qurbani.qurbaniDescription || '';
  const images = qurbani.QurbaniImages || qurbani.qurbaniImages || [];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>{name}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}

        {/* Display all images */}
        {images && images.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: getProcessedImageUrl(image.imageUrl) }}
                style={styles.qurbaniImage}
                defaultSource={require('../../assets/default-product.png')}
              />
            ))}
          </ScrollView>
        ) : (
          <Image
            source={require('../../assets/default-product.png')}
            style={styles.qurbaniImage}
          />
        )}

        <Text style={[styles.description, { color: theme.colors.text }]}>
          {description}
        </Text>

        <View style={styles.priceSection}>
          <View style={styles.priceBlock}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              Price (Pakistan)
            </Text>
            <Text style={[styles.price, { color: theme.colors.text }]}>
              PKR {qurbani.priceforpak || qurbani.qurbaniPricePak || 0}
            </Text>
            {qurbani.skunopak && (
              <Text style={[styles.sku, { color: theme.colors.textSecondary }]}>
                SKU: {qurbani.skunopak}
              </Text>
            )}
          </View>
          <View style={styles.priceBlock}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              Price (USA)
            </Text>
            <Text style={[styles.price, { color: theme.colors.text }]}>
              USD {qurbani.priceforus || qurbani.qurbaniPriceUSA || 0}
            </Text>
            {qurbani.skunous && (
              <Text style={[styles.sku, { color: theme.colors.textSecondary }]}>
                SKU: {qurbani.skunous}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.displayPriceSection}>
          <Text style={[styles.displayPriceLabel, { color: theme.colors.textSecondary }]}>
            Your Price ({storeCountry.toUpperCase()})
          </Text>
          {hasDiscount ? (
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: theme.colors.text, textDecorationLine: 'line-through' }]}>
                {`${currency} ${price}`}
              </Text>
              <Text style={[styles.discountedPrice, { color: theme.colors.primary }]}>
                {`${currency} ${discountedPrice}`}
              </Text>
            </View>
          ) : (
            <Text style={[styles.price, { color: theme.colors.text }]}>
              {`${currency} ${price}`}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.addToCartButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart-outline" size={20} color="white" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  imageGallery: {
    marginBottom: 16,
  },
  qurbaniImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priceBlock: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 8,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  displayPriceSection: {
    marginBottom: 16,
  },
  displayPriceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  discountedPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sku: {
    fontSize: 12,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default QurbaniDetailsScreen;