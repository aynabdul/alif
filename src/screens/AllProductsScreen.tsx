import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { categoryService, productService } from '../services/api.service';
import { Product, Category } from '../types/api.types';
import { RootStackNavigationProp } from '../types/navigation.types';
import ProductCard from '../components/common/ProductCard';

const AllProductsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<{[key: string]: Product[]}>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
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

      // Fetch categories
      const categoriesResponse = await categoryService.getCategories();
      
      if (!categoriesResponse.success) {
        setError('Failed to load categories.');
        setLoading(false);
        return;
      }
      
      const fetchedCategories = categoriesResponse.data || [];
      setCategories(fetchedCategories);
      
      // Fetch all products
      const productsResponse = await productService.getProducts();
      
      if (!productsResponse.success) {
        setError('Failed to load products.');
        setLoading(false);
        return;
      }
      
      const allProducts = productsResponse.data || [];
      
      // Group products by category
      const groupedProducts: {[key: string]: Product[]} = {};
      
      // Initialize empty arrays for each category
      fetchedCategories.forEach(category => {
        groupedProducts[category.id.toString()] = [];
      });
      
      // Group products into their categories
      allProducts.forEach(product => {
        if (product.categoryId) {
          const categoryId = product.categoryId.toString();
          if (groupedProducts[categoryId]) {
            groupedProducts[categoryId].push(product);
          }
        }
      });
      
      setProductsByCategory(groupedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleProductPress = useCallback((productId: string) => {
    navigation.navigate('ProductDetails', { productId });
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
      <StatusBar style={theme.statusBarStyle} />
      <ScrollView
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
        {error ? (
          <View style={[styles.errorContainer, { backgroundColor: theme.colors.error + '20' }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={[styles.pageTitle, { color: theme.colors.text }]}>
              All Products
            </Text>
            
            {categories.map(category => {
              const categoryProducts = productsByCategory[category.id.toString()] || [];
              
              if (categoryProducts.length === 0) return null;
              
              return (
                <View key={category.id.toString()} style={styles.categorySection}>
                  <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
                    {category.categoryName}
                  </Text>
                  
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categoryProducts}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.productsList}
                    contentContainerStyle={styles.productsListContent}
                  />
                </View>
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
    paddingHorizontal: 0,
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
    margin: 16,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  productsList: {
    overflow: 'visible',
  },
  productsListContent: {
    paddingHorizontal: 16,
  },
});

export default AllProductsScreen;