import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useWishlistStore } from '../stores/wishlistStore';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/common/ProductCard';
import { StatusBar } from 'expo-status-bar';

const WishlistScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();

  const handleProductPress = (productId: string) => {
    // @ts-ignore
    navigation.navigate('ProductDetails', { productId });
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  const renderEmptyWishlist = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color={theme.colors.grays[300]} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Your wishlist is empty
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Save your favorite products here
      </Text>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: theme.colors.brand }]}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Text style={styles.browseButtonText}>Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.colors.text }]}>My Wishlist</Text>
      {items.length > 0 && (
        <TouchableOpacity onPress={handleClearWishlist}>
          <Text style={[styles.clearButton, { color: theme.colors.error }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      {renderHeader()}
      {items.length === 0 ? (
        renderEmptyWishlist()
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          key={'single-column'} // Prevent "changing numColumns" warning
          contentContainerStyle={styles.productsList}
          renderItem={({ item }) => (
            <View style={styles.productCardContainer}>
              <ProductCard
                product={item}
                onPress={() => handleProductPress(String(item.id))}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsList: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  productCardContainer: {
    width: '100%',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WishlistScreen;
