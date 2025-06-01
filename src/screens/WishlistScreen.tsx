import React, { JSX } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  SectionList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useWishlistStore } from '../stores/wishlistStore';
import { Ionicons } from '@expo/vector-icons';
import ProductCard from '../components/common/ProductCard';
import QurbaniCard from '../components/common/QurbaniCard';
import { StatusBar } from 'expo-status-bar';
import { Product } from '../types/api.types';
import { Qurbani } from '../types/api.types';
import { RootStackNavigationProp } from '../types/navigation.types';

type SectionData = {
  title: string;
  data: (Product | Qurbani)[];
  renderItem: ({ item }: { item: Product | Qurbani }) => JSX.Element;
};

const WishlistScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { 
    getProducts, 
    getQurbanis, 
    clearWishlist,
  } = useWishlistStore();
  
  const products = getProducts();
  const qurbanis = getQurbanis();
  const hasItems = products.length > 0 || qurbanis.length > 0;

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductDetails', { productId });
  };

  const handleQurbaniPress = (qurbaniId: string) => {
    navigation.navigate('QurbaniDetails', { qurbaniId });
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
        Save your favorite items here
      </Text>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: theme.colors.brand }]}
        onPress={() => navigation.navigate('Home' as never)}
      >
        <Text style={styles.browseButtonText}>Browse Items</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.colors.text }]}>My Wishlist</Text>
      {hasItems && (
        <TouchableOpacity onPress={handleClearWishlist}>
          <Text style={[styles.clearButton, { color: theme.colors.error }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const sections: SectionData[] = [
    {
      title: 'Products',
      data: products,
      renderItem: ({ item }) => (
        <View style={styles.cardContainer}>
          <ProductCard
            product={item as Product}
            onPress={() => handleProductPress(String(item.id))}
          />
        </View>
      ),
    },
    {
      title: 'Qurbanis',
      data: qurbanis,
      renderItem: ({ item }) => (
        <View style={styles.cardContainer}>
          <QurbaniCard
            qurbani={item as Qurbani}
            onPress={() => handleQurbaniPress(String(item.id))}
          />
        </View>
      ),
    },
  ];

  const renderSectionHeader = ({ section }: { section: SectionData }) => {
    if (section.data.length === 0) return null;
    return (
      <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
        {section.title}
      </Text>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      {renderHeader()}
      
      {!hasItems ? (
        renderEmptyWishlist()
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderSectionHeader={renderSectionHeader}
          renderItem={({ item, section }) => section.renderItem({ item })}
          ListFooterComponent={<View style={styles.footer} />}
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
  listContent: {
    paddingBottom: 40,
  },
  cardContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  footer: {
    height: 20,
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