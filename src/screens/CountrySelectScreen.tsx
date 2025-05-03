import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AuthScreenNavigationProp, AuthStackParamList } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { resetRoot } from '../navigation/navigationUtils';
// import * as SplashScreen from 'expo-splash-screen';

interface Country {
  code: 'US' | 'PAK';
  name: string;
  flag: string;
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'PAK', name: 'Pakistan', flag: '🇵🇰' },
];

const CountrySelectScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp<'CountrySelect'>>();
  const route = useRoute<RouteProp<AuthStackParamList, 'CountrySelect'>>();
  const { theme, setCountry } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Hide splash screen after a short delay to ensure smooth transition
    const timer = setTimeout(async () => {
      setIsReady(true);
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleCountrySelect = async (country: Country) => {
    setIsLoading(true);
    
    try {
      // Set the country in the theme context
      await setCountry(country.code);
      
      // Check if onSelect callback is provided in route params
      if (route.params?.onSelect) {
        navigation.goBack();
      } else {
        // Default behavior - Navigate to the appropriate screen - Main for guest mode
        resetRoot('Main');
      }
    } catch (error) {
      console.error('Failed to set country:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      
      <View style={styles.header}>
        <Image 
          source={require('../../assets/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.brandText, { color: theme.colors.brand }]}>
          ALIF CATTLE & GOAT FARM
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Select Your Country
        </Text>
        
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Choose your country to see available farms
        </Text>
        
        {COUNTRIES.map((country) => (
          <TouchableOpacity
            key={country.code}
            style={[
              styles.countryItem,
              { 
                borderBottomColor: theme.colors.border,
                backgroundColor: theme.colors.cardBackground
              }
            ]}
            onPress={() => handleCountrySelect(country)}
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
  );
};

const styles = StyleSheet.create({
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
    paddingTop: 40,
    paddingBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  countryFlag: {
    fontSize: 32,
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