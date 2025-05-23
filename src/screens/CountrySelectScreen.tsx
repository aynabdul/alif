// src/screens/CountrySelectScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../types/navigation.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { resetRoot } from '../navigation/navigationUtils';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useAuthStore } from '../stores/authStore';

type CountrySelectScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'CountrySelect'>;

interface Country {
  code: 'US' | 'PAK';
  name: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'PAK', name: 'Pakistan', flag: '🇵🇰' },
];

const { width } = Dimensions.get('window');

const CountrySelectScreen = () => {
  const navigation = useNavigation<CountrySelectScreenNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'CountrySelect'>>();
  const { theme, setCountry } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const clearCart = useCartStore(state => state.clearCart);
  const clearWishlist = useWishlistStore(state => state.clearWishlist);
  const signOut = useAuthStore(state => state.signOut);
  
  const handleCountrySelect = async (country: Country) => {
    setIsLoading(true);
    
    try {
      // Clear cart and wishlist
      clearCart();
      clearWishlist();
      
      // Sign out the user
      await signOut();
      
      // Set new country
      await setCountry(country.code);
      
      // Navigate as before
      if (route.params?.onSelect) {
        navigation.goBack();
      } else {
        resetRoot('Main');
      }
    } catch (error) {
      console.error('Failed to change country:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      <View style={styles.innerContainer}>
    {isLoading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )}
      <View style={styles.mainContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              source={require('../../assets/logoAmerica.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Image 
              source={require('../../assets/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.brandText, { color: theme.colors.brand }]}>
            Alif Cattle & Goat Farm
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <View style={[styles.content, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Choose Your Region
            </Text>
            
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Select your region to explore tailored farm offerings and pricing.
            </Text>
            
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={[
                  styles.countryItem,
                  { 
                    borderBottomColor: theme.colors.border,
                    backgroundColor: theme.colors.cardBackground,
                  },
                ]}
                onPress={() => handleCountrySelect(country)}
                activeOpacity={0.7}
              >
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <View style={styles.countryInfo}>
                  <Text style={[styles.countryName, { color: theme.colors.text }]}>
                    {country.name}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 55,
  },
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    width: '100%',
    paddingTop: 0,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8, // Reduced gap
  },
  logo: {
    width: 90,
    height: 90,
    marginHorizontal: 15, // Adjusted spacing between logos
  },
  brandText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16, // Reduced gap to title
  },
  contentContainer: {
    alignItems: 'center',
  },
  content: {
    width: width * 0.85,
    maxWidth: 400,
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  countryFlag: {
    fontSize: 30,
    marginRight: 20,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default CountrySelectScreen;