import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import ProductCard from '../components/common/ProductCard';
import CategoryCard from '../components/common/CategoryCard';
import { categoryService, productService } from '../services/api.service';
import { Product, Category } from '../types/api.types';
import { AppStackNavigationProp } from '../types/navigation.types';
import TestimonialsSection from '../components/home/TestimonialsSection';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProductWithDates extends Product {
  updatedAt?: string;
  createdAt?: string;
}

const TAB_BAR_HEIGHT = 60; // Match with AppNavigator

const HomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<AppStackNavigationProp>();
  const insets = useSafeAreaInsets();

  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const NetInfo = require('@react-native-community/netinfo').default;
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected) {
        setError('No internet connection.');
        setLoading(false);
        return;
      }

      const [categoriesResponse, productsResponse] = await Promise.all([
        categoryService.getCategories(),
        productService.getProducts(),
      ]);

      if (categoriesResponse.success) {
        console.log('Categories response data:', categoriesResponse.data);
        setCategories(categoriesResponse.data || []);
      } else {
        console.warn('Categories fetch failed:', categoriesResponse.message);
      }

      if (productsResponse.success) {
        const productsWithDates = productsResponse.data as ProductWithDates[];
        console.log('Products received:', productsWithDates.length);
        const homeScreenProducts = productsWithDates
          .filter((product) => product.showOnHomeScreen)
          .sort((a, b) => {
            const dateA = a.updatedAt
              ? new Date(a.updatedAt).getTime()
              : a.createdAt
              ? new Date(a.createdAt).getTime()
              : Date.now();
            const dateB = b.updatedAt
              ? new Date(b.updatedAt).getTime()
              : b.createdAt
              ? new Date(b.createdAt).getTime()
              : Date.now();
            return dateB - dateA;
          })
          .slice(0, 8);

        const remainingCount = 8 - homeScreenProducts.length;
        const additionalProducts = remainingCount > 0
          ? productsWithDates
              .filter((product) => !product.showOnHomeScreen)
              .slice(0, remainingCount)
          : [];

        setPopularProducts([...homeScreenProducts, ...additionalProducts]);
        console.log('Popular products set:', homeScreenProducts.length, 'additional:', additionalProducts.length);
      } else {
        console.warn('Products fetch failed:', productsResponse.message);
        setError(productsResponse.message || 'Failed to load products.');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryProducts', { categoryId: category.id.toString(), categoryName: category.categoryName });
  }, [navigation]);

  const handleProductPress = useCallback((productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  }, [navigation]);

  const handleSeeAllCategories = useCallback(() => {
    navigation.navigate('AllProducts');
  }, [navigation]);

  const handleSeeAllProducts = useCallback(() => {
    navigation.navigate('AllProducts');
  }, [navigation]);

  const renderProduct = useCallback(({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => handleProductPress(item.id.toString())}
    />
  ), [handleProductPress]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: TAB_BAR_HEIGHT + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.brand]}
            tintColor={theme.colors.brand}
          />
        }
      >
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
            <TouchableOpacity onPress={fetchData}>
              <Text style={[styles.retryText, { color: theme.colors.brand }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {categories.length > 0 && (
          <View style={styles.categoriesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Categories</Text>
              <TouchableOpacity onPress={handleSeeAllCategories}>
                <Text style={[styles.seeAll, { color: theme.colors.brand }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onPress={() => handleCategoryPress(category)}
                />
              ))}
            </ScrollView>
          </View>
        )}
        
        {popularProducts.length > 0 && (
          <View style={styles.popularContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Popular Products</Text>
              <TouchableOpacity onPress={handleSeeAllProducts}>
                <Text style={[styles.seeAll, { color: theme.colors.brand }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={popularProducts}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id.toString()}
              initialNumToRender={4}
              maxToRenderPerBatch={4}
              windowSize={5}
              style={styles.productsList}
              contentContainerStyle={styles.productsListContent}
            />
          </View>
        )}
        
        <TestimonialsSection />
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
  scrollContent: {
    flexGrow: 1,
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
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  retryText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  categoriesContainer: {
    marginTop: 16,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  popularContainer: {
    marginTop: 24,
  },
  productsList: {
    overflow: 'visible',
  },
  productsListContent: {
    paddingHorizontal: 16,
  },
});

export default HomeScreen;