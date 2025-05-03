import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import TextField from '../components/common/TextField';

const SearchScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    'Goat', 'Lamb', 'Beef', 'Qurbani', 'Delivery'
  ]);
  
  // Mock data for products
  const allProducts = [
    { id: '1', name: 'Premium Lamb', price: '$120', category: 'Lamb', image: require('../../assets/icon.png') },
    { id: '2', name: 'Organic Beef', price: '$150', category: 'Beef', image: require('../../assets/icon.png') },
    { id: '3', name: 'Fresh Goat', price: '$110', category: 'Goat', image: require('../../assets/icon.png') },
    { id: '4', name: 'Milk Gallon', price: '$5', category: 'Dairy', image: require('../../assets/icon.png') },
    { id: '5', name: 'Goat Qurbani', price: '$250', category: 'Qurbani', image: require('../../assets/icon.png') },
    { id: '6', name: 'Sheep Qurbani', price: '$200', category: 'Qurbani', image: require('../../assets/icon.png') },
    { id: '7', name: 'Cow Share', price: '$150', category: 'Qurbani', image: require('../../assets/icon.png') },
    { id: '8', name: 'Aged Beef', price: '$180', category: 'Beef', image: require('../../assets/icon.png') },
  ];
  
  // Search function
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    // Simulate API call delay
    const timeoutId = setTimeout(() => {
      const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  const handleSearch = (text) => {
    setSearchQuery(text);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };
  
  const handleSelectRecentSearch = (term) => {
    setSearchQuery(term);
  };
  
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
  };
  
  const saveRecentSearch = (term) => {
    if (term.trim() === '') return;
    
    if (!recentSearches.includes(term)) {
      const updatedSearches = [term, ...recentSearches.slice(0, 4)];
      setRecentSearches(updatedSearches);
    }
  };
  
  const handleProductPress = (productId) => {
    saveRecentSearch(searchQuery);
    navigation.navigate('ProductDetails', { productId });
  };
  
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.productItem, { backgroundColor: theme.colors.card }]}
      onPress={() => handleProductPress(item.id)}
    >
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: theme.colors.text }]}>{item.name}</Text>
        <Text style={[styles.productCategory, { color: theme.colors.textSecondary }]}>
          {item.category}
        </Text>
        <Text style={[styles.productPrice, { color: theme.colors.primary }]}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextField
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            autoFocus
            leftIcon={<Ionicons name="search" size={20} color={theme.colors.textSecondary} />}
            rightIcon={
              searchQuery ? (
                <TouchableOpacity onPress={handleClearSearch}>
                  <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              ) : null
            }
            containerStyle={styles.searchField}
          />
        </View>
      </View>
      
      {isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
        />
      ) : searchQuery.trim() !== '' ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={60} color={theme.colors.textSecondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No results found
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            We couldn't find any products matching "{searchQuery}"
          </Text>
        </View>
      ) : (
        <View style={styles.recentSearchesContainer}>
          <View style={styles.recentSearchesHeader}>
            <Text style={[styles.recentSearchesTitle, { color: theme.colors.text }]}>
              Recent Searches
            </Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={handleClearRecentSearches}>
                <Text style={[styles.clearText, { color: theme.colors.primary }]}>Clear All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentSearches.length > 0 ? (
            <View style={styles.recentSearchesList}>
              {recentSearches.map((term, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.recentSearchItem, { backgroundColor: theme.colors.card }]}
                  onPress={() => handleSelectRecentSearch(term)}
                >
                  <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
                  <Text style={[styles.recentSearchText, { color: theme.colors.text }]}>
                    {term}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={[styles.noRecentSearches, { color: theme.colors.textSecondary }]}>
              No recent searches
            </Text>
          )}
          
          <View style={styles.suggestedContainer}>
            <Text style={[styles.suggestedTitle, { color: theme.colors.text }]}>
              Popular Categories
            </Text>
            <View style={styles.categoriesList}>
              <TouchableOpacity 
                style={[styles.categoryTag, { backgroundColor: theme.colors.card }]}
                onPress={() => handleSelectRecentSearch('Qurbani')}
              >
                <Text style={[styles.categoryTagText, { color: theme.colors.text }]}>Qurbani</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.categoryTag, { backgroundColor: theme.colors.card }]}
                onPress={() => handleSelectRecentSearch('Lamb')}
              >
                <Text style={[styles.categoryTagText, { color: theme.colors.text }]}>Lamb</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.categoryTag, { backgroundColor: theme.colors.card }]}
                onPress={() => handleSelectRecentSearch('Beef')}
              >
                <Text style={[styles.categoryTagText, { color: theme.colors.text }]}>Beef</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.categoryTag, { backgroundColor: theme.colors.card }]}
                onPress={() => handleSelectRecentSearch('Goat')}
              >
                <Text style={[styles.categoryTagText, { color: theme.colors.text }]}>Goat</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.categoryTag, { backgroundColor: theme.colors.card }]}
                onPress={() => handleSelectRecentSearch('Dairy')}
              >
                <Text style={[styles.categoryTagText, { color: theme.colors.text }]}>Dairy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  searchContainer: {
    flex: 1,
  },
  searchField: {
    marginBottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 14,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  recentSearchesContainer: {
    flex: 1,
    paddingTop: 20,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearText: {
    fontSize: 14,
  },
  recentSearchesList: {
    marginBottom: 25,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentSearchText: {
    fontSize: 15,
    marginLeft: 12,
  },
  noRecentSearches: {
    paddingVertical: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  suggestedContainer: {
    marginTop: 10,
  },
  suggestedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  categoryTagText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SearchScreen; 