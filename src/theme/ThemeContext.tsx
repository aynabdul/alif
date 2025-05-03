import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usTheme, pakTheme, getNavigationTheme, CustomTheme } from './themes';
import { Alert } from 'react-native';
import { navigationRef } from '../navigation/navigationUtils';

type CountryType = 'US' | 'PAK';

type ThemeContextType = {
  theme: CustomTheme;
  country: CountryType;
  setCountry: (country: CountryType) => void;
  promptCountrySelection: () => void;
  isLoading: boolean;
  // For checking when the country selection was last made
  lastSelectionDate: number | null;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: usTheme,
  country: 'US',
  setCountry: () => {},
  promptCountrySelection: () => {},
  isLoading: true,
  lastSelectionDate: null,
});

export const useTheme = () => useContext(ThemeContext);

const COUNTRY_PREFERENCE_KEY = '@country_preference';
const COUNTRY_SELECTION_DATE_KEY = '@country_selection_date';

// For testing, set to 2 minutes (will be changed to 7 days in production)
// 2 minutes = 120000 milliseconds
const COUNTRY_SELECTION_INTERVAL = 2 * 60 * 1000; 

// 7 days = 604800000 milliseconds (use this in production)
// const COUNTRY_SELECTION_INTERVAL = 7 * 24 * 60 * 60 * 1000; 

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [country, setCountryState] = useState<CountryType>('US');
  const [isLoading, setIsLoading] = useState(true);
  const [lastSelectionDate, setLastSelectionDate] = useState<number | null>(null);

  // Load saved country preference
  useEffect(() => {
    const loadCountryPreference = async () => {
      try {
        const savedCountry = await AsyncStorage.getItem(COUNTRY_PREFERENCE_KEY);
        const savedDateStr = await AsyncStorage.getItem(COUNTRY_SELECTION_DATE_KEY);
        
        if (savedCountry) {
          setCountryState(savedCountry as CountryType);
        }
        
        if (savedDateStr) {
          setLastSelectionDate(Number(savedDateStr));
        }
      } catch (error) {
        console.error('Failed to load country preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountryPreference();
  }, []);

  // Save country preference when it changes
  const setCountry = async (newCountry: CountryType) => {
    try {
      await AsyncStorage.setItem(COUNTRY_PREFERENCE_KEY, newCountry);
      const currentTime = Date.now();
      await AsyncStorage.setItem(COUNTRY_SELECTION_DATE_KEY, currentTime.toString());
      
      setCountryState(newCountry);
      setLastSelectionDate(currentTime);

      console.log(`Country set to ${newCountry}, next selection will be prompted in ${COUNTRY_SELECTION_INTERVAL / (60 * 1000)} minutes`);
    } catch (error) {
      console.error('Failed to save country preference:', error);
    }
  };

  // Prompt user to select country
  const promptCountrySelection = () => {
    // Check if navigation is available
    if (navigationRef && navigationRef.current) {
      // Navigate to the CountrySelect screen
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: 'CountrySelect' }],
      });
    } else {
      console.warn('Navigation reference not available for country selection prompt');
    }
  };
  
  // Determine active theme based on country
  const activeTheme = country === 'US' ? usTheme : pakTheme;
  
  // Add navigation theme to the theme object
  const theme = {
    ...activeTheme,
    navigationTheme: getNavigationTheme(activeTheme)
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        country,
        setCountry,
        promptCountrySelection,
        isLoading,
        lastSelectionDate,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}; 