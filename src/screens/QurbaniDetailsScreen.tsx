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
import { qurbaniService, slaughterService } from '../services/api.service';
import { Qurbani, Slaughts, SlaughtTime } from '../types/api.types';
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
  const { addQurbaniToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { qurbaniId } = route.params;
  const insets = useSafeAreaInsets();

  const [qurbani, setQurbani] = useState<Qurbani | null>(null);
  const [slaughts, setSlaughts] = useState<Slaughts | null>(null);
  const [slaughtTimes, setSlaughtTimes] = useState<SlaughtTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedHour, setSelectedHour] = useState<string | null>(null);
  const [addToCartStatus, setAddToCartStatus] = useState<"idle" | "error" | "success">("idle");
  const [webViewHeight, setWebViewHeight] = useState(400);
  const [addingToCart, setAddingToCart] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const windowWidth = Dimensions.get('window').width;
  const BOTTOM_BAR_HEIGHT = 80 + (insets.bottom || 16);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch Qurbani details
        const qurbaniResponse = await qurbaniService.getQurbaniById(qurbaniId);
        console.log('Qurbani response:', JSON.stringify(qurbaniResponse, null, 2));
        if (qurbaniResponse.success && qurbaniResponse.data) {
          setQurbani(qurbaniResponse.data);
        } else {
          setError(`Failed to fetch Qurbani details: ${qurbaniResponse.message || 'Unknown error'}`);
        }

        // Fetch slaughts (days and slots)
        const slaughtsResponse = await slaughterService.getSlaughts();
        if (slaughtsResponse.success && slaughtsResponse.data) {
          setSlaughts(slaughtsResponse.data);
        } else {
          setError(`Failed to fetch slaughts: ${slaughtsResponse.message || 'Unknown error'}`);
        }

        // Fetch slaught times (hours for US)
        if (country === 'US') {
          const slaughtTimesResponse = await slaughterService.getSlaughtTimes();
          if (slaughtTimesResponse.success && slaughtTimesResponse.data) {
            setSlaughtTimes(slaughtTimesResponse.data);
          } else {
            setError(`Failed to fetch slaught times: ${slaughtTimesResponse.message || 'Unknown error'}`);
          }
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [qurbaniId, country]);

  // Reset activeImageIndex when images change
  useEffect(() => {
    if (qurbani) {
      const images = (qurbani.QurbaniImages || qurbani.qurbaniImages || []).filter(
        (img): img is { id: string; imageUrl: string; qurbaniId:string } => !!img && typeof img.imageUrl === 'string'
      );
      if (activeImageIndex >= images.length) {
        setActiveImageIndex(0);
      }
    }
  }, [qurbani, activeImageIndex]);

  // Helper: get day slots from API response
  const daySlots = slaughts
    ? [
        { 
          label: 'Day 1', 
          value: country === 'US' ? 'day1USA' : 'day1Pak', 
          slots: country === 'US' ? slaughts.day1USA : slaughts.day1Pak 
        },
        { 
          label: 'Day 2', 
          value: country === 'US' ? 'day2USA' : 'day2Pak', 
          slots: country === 'US' ? slaughts.day2USA : slaughts.day2Pak 
        },
        { 
          label: 'Day 3', 
          value: country === 'US' ? 'day3USA' : 'day3Pak', 
          slots: country === 'US' ? slaughts.day3USA : slaughts.day3Pak 
        },
      ]
    : [];

  // Helper: get hours for selected day (US only)
  const hourSlots = selectedDay
    ? slaughtTimes.filter((time) => time.eidDay === selectedDay && time.totalQuota > 0)
    : [];

  // Helper: get images
  const images = qurbani
    ? (qurbani.QurbaniImages || qurbani.qurbaniImages || []).filter(
        (img): img is { id: string; imageUrl: string; qurbaniId: string } => !!img && typeof img.imageUrl === 'string'
      )
    : [];
  const mainImageUrl = images.length > 0 && images[activeImageIndex]?.imageUrl
    ? images[activeImageIndex].imageUrl.startsWith('/')
      ? `${API_BASE_URL}${images[activeImageIndex].imageUrl}`
      : images[activeImageIndex].imageUrl
    : require('../../assets/default-product.png');
  console.log('Images:', JSON.stringify(images, null, 2));
  console.log('Main image URL:', mainImageUrl);

  // Helper: get SKU and price
  const isPakistan = country === 'PAK';
  const sku = isPakistan ? qurbani?.skunopak : qurbani?.skunous;
  const priceStart = isPakistan ? qurbani?.priceforpak : qurbani?.priceforus;
  const priceEnd = isPakistan ? qurbani?.endpriceforpak : qurbani?.endpriceforus;
  const currency = isPakistan ? 'PKR' : 'USD';
// Replace the existing displayPrice calculation with this:
  const displayPrice = selectedDay
  ? selectedDay.includes('day1') 
    ? (isPakistan ? qurbani?.endpriceforpak : qurbani?.endpriceforus) || 0
    : (isPakistan ? qurbani?.priceforpak : qurbani?.priceforus) || 0
  : null;

  // Helper: get category
  const category = qurbani?.catagory || qurbani?.catagory || '';

  // Helper: description
  const description = qurbani?.description || qurbani?.qurbaniDescription || '';

  // Wishlist logic
  const inWishlist = qurbani ? isInWishlist(qurbani.id) : false;
  const handleWishlistToggle = () => {
    if (!qurbani) return;
    if (inWishlist) {
      removeFromWishlist(qurbani.id);
      Alert.alert('Removed', 'Qurbani removed from your wishlist');
    } else {
      addQurbaniToWishlist(qurbani);
      Alert.alert('Added to Wishlist', 'Qurbani added to your wishlist');
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    if (!selectedDay || (country === 'US' && !selectedHour)) {
      setAddToCartStatus('error');
      Alert.alert('Selection Required', country === 'US' ? 'Please select a day and hour.' : 'Please select a day.');
      return;
    }

    setAddingToCart(true);
    try {
      if (qurbani) {
        const cartItem = {
          id: qurbani.id, // Original ID, will be transformed by generateCartItemId
          name: qurbani.title || qurbani.qurbaniName || '',
          price: displayPrice || 0,
          quantity: 1,
          image: { uri: typeof mainImageUrl === 'string' ? mainImageUrl : undefined },
          type: 'qurbani' as const,
          day: selectedDay,
          hour: country === 'US' ? (selectedHour ?? undefined) : undefined,
        };
        addItem(cartItem);
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

  // Check if Add to Cart button should be enabled
  const isAddToCartEnabled = country === 'US' ? !!selectedDay && !!selectedHour : !!selectedDay;

  // Render description WebView
  const renderDescription = () => {
    if (!description) return null;
    
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
              backgroundColor: ${theme.colors.border};
              margin: 16px 0;
            }
          </style>
        </head>
        <body>
          ${description}
          <script>
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
            document.addEventListener('DOMContentLoaded', function() {
              setTimeout(updateHeight, 300);
            });
            window.onload = function() {
              setTimeout(updateHeight, 500);
            };
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
          opacity: 0.99,
          marginBottom: 0
        }}
        scrollEnabled={true}
        originWhitelist={['*']}
        showsVerticalScrollIndicator={true}
        scalesPageToFit={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={(event) => {
          const height = parseInt(event.nativeEvent.data);
          if (!isNaN(height) && height > 0) {
            setWebViewHeight(height + 10);
          }
        }}
        onError={(e) => console.error('WebView error:', e.nativeEvent)}
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  if (error || !qurbani || !slaughts) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.colors.text }}>{error || 'Qurbani or slaught data not found'}</Text>
      </View>
    );
  }

  const cartItems = useCartStore.getState().items;
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {addingToCart && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      {/* Header bar */}
      <View style={[styles.headerBar, { backgroundColor: theme.colors.cardBackground }]}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={handleWishlistToggle}>
            <Ionicons name={inWishlist ? 'heart' : 'heart-outline'} size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.navigate('Cart' as never)}>
            <Ionicons name="cart-outline" size={24} color={theme.colors.text} />
            {cartItems.length > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.badgeText}>{cartItems.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: BOTTOM_BAR_HEIGHT }}>
        {/* Image carousel */}
        <View style={styles.carouselContainer}>
          <Image
            source={typeof mainImageUrl === 'string' ? { uri: mainImageUrl } : mainImageUrl}
            style={styles.mainImage}
            resizeMode="contain"
          />
          {images.length > 1 && (
            <FlatList
              data={images}
              horizontal
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => setActiveImageIndex(index)}>
                  <Image
                    source={{
                      uri: item.imageUrl.startsWith('/')
                        ? `${API_BASE_URL}${item.imageUrl}`
                        : item.imageUrl
                    }}
                    style={[styles.thumbnail, { borderColor: activeImageIndex === index ? theme.colors.primary : 'transparent' }]}
                    resizeMode="contain"
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
          {category && <Text style={[styles.category, { color: theme.colors.textSecondary }]}>{category}</Text>}
        </View>
        {/* SKU and price range */}
        <View style={styles.skuPriceSection}>
          {sku && <Text style={[styles.sku, { color: theme.colors.text }]}>SKU: {sku}</Text>}
          <Text style={[styles.priceRange, { color: theme.colors.brand }]}>
            {currency} {priceStart} - {currency} {priceEnd}
          </Text>
        </View>
        {/* Description section */}
        <View style={styles.descriptionSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Description</Text>
          {renderDescription()}
        </View>
        {/* Day selection */}
        <View style={styles.dayDropdownSection}>
          <Text style={[styles.dayLabel, { color: theme.colors.text }]}>Select Day</Text>
          <ScrollView horizontal style={styles.dayScroll} showsHorizontalScrollIndicator={false}>
            {daySlots.map((day) => (
              <TouchableOpacity
                key={day.value}
                style={[
                  styles.dayOption,
                  {
                    backgroundColor: selectedDay === day.value ? theme.colors.primary : theme.colors.cardBackground,
                    opacity: day.slots > 0 ? 1 : 0.5,
                  },
                ]}
                onPress={() => {
                  if (day.slots > 0) {
                    setSelectedDay(day.value);
                    setSelectedHour(null);
                  }
                }}
                disabled={day.slots <= 0}
              >
                <Text
                  style={{
                    color: selectedDay === day.value ? 'white' : theme.colors.text,
                    fontWeight: '600',
                  }}
                >
                  {day.label} ({day.slots} slots)
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Hour selection (US only) */}
        {country === 'US' && selectedDay && (
          <View style={styles.dayDropdownSection}>
            <Text style={[styles.dayLabel, { color: theme.colors.text }]}>Select Hour</Text>
            <ScrollView horizontal style={styles.dayScroll} showsHorizontalScrollIndicator={false}>
              {hourSlots.map((hour) => (
                <TouchableOpacity
                  key={hour.id}
                  style={[
                    styles.dayOption,
                    {
                      backgroundColor: selectedHour === hour.hour ? theme.colors.primary : theme.colors.cardBackground,
                      opacity: hour.totalQuota > 0 ? 1 : 0.5,
                    },
                  ]}
                  onPress={() => {
                    if (hour.totalQuota > 0) {
                      setSelectedHour(hour.hour);
                    }
                  }}
                  disabled={hour.totalQuota <= 0}
                >
                  <Text
                    style={{
                      color: selectedHour === hour.hour ? 'white' : theme.colors.text,
                      fontWeight: '600',
                    }}
                  >
                    {hour.hour}:00 ({hour.totalQuota} slots)
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
      {/* Sticky bottom bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.cardBackground,
            borderTopColor: theme.colors.border,
            paddingBottom: insets.bottom || 16,
          },
        ]}
      >
        <View style={styles.totalPriceContainer}>
          <Text style={[styles.totalPriceLabel, { color: theme.colors.textSecondary }]}>Price</Text>
          <Text style={[styles.totalPrice, { color: theme.colors.brand }]}>
            {displayPrice ? `${currency} ${displayPrice}` : 'Select a day'}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            {
              backgroundColor: isAddToCartEnabled ? theme.colors.primary : theme.colors.disabled,
            },
          ]}
          onPress={handleAddToCart}
          disabled={!isAddToCartEnabled}
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
    paddingBottom: 4,
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
  headerSection: {
    padding: 16,
    paddingBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  category: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  skuPriceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  sku: {
    fontSize: 14,
    marginRight: 16,
  },
  priceRange: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descriptionSection: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dayDropdownSection: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dayScroll: {
    flexDirection: 'row',
  },
  dayOption: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 12,
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
    marginLeft: 8,
  },
});

export default QurbaniDetailsScreen;