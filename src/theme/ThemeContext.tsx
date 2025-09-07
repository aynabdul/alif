import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usTheme, pakTheme, getNavigationTheme, CustomTheme } from './themes';
import { navigationRef } from '../navigation/navigationUtils';

type CountryType = 'US' | 'PAK';

type ThemeContextType = {
  theme: CustomTheme;
  country: CountryType;
  setCountry: (country: CountryType) => void;
  promptCountrySelection: () => void;
  isLoading: boolean;
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
// const COUNTRY_SELECTION_INTERVAL = 2 * 60 * 1000; 

// 7 days = 604800000 milliseconds (use this in production)
const COUNTRY_SELECTION_INTERVAL = 7 * 24 * 60 * 60 * 1000; 

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [country, setCountryState] = useState<CountryType>('US');
  const [isLoading, setIsLoading] = useState(true);
  const [lastSelectionDate, setLastSelectionDate] = useState<number | null>(null);

  useEffect(() => {
    const loadCountryPreference = async () => {
      try {
        const savedCountry = await AsyncStorage.getItem(COUNTRY_PREFERENCE_KEY);
        const savedDateStr = await AsyncStorage.getItem(COUNTRY_SELECTION_DATE_KEY);

        if (savedCountry) setCountryState(savedCountry as CountryType);
        if (savedDateStr) setLastSelectionDate(Number(savedDateStr));
      } catch (error) {
        console.error('Failed to load country preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCountryPreference();
  }, []);

  const setCountry = async (newCountry: CountryType) => {
    try {
      await AsyncStorage.setItem(COUNTRY_PREFERENCE_KEY, newCountry);
      const currentTime = Date.now();
      await AsyncStorage.setItem(COUNTRY_SELECTION_DATE_KEY, currentTime.toString());

      setCountryState(newCountry);
      setLastSelectionDate(currentTime);
    } catch (error) {
      console.error('Failed to save country preference:', error);
    }
  };

  const promptCountrySelection = () => {
    if (navigationRef && navigationRef.current) {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: 'CountrySelect' }],
      });
    }
  };

  // MEMOIZE activeTheme and theme
  const activeTheme = useMemo(() => (country === 'US' ? usTheme : pakTheme), [country]);
  const theme = useMemo(
    () => ({
      ...activeTheme,
      navigationTheme: getNavigationTheme(activeTheme),
    }),
    [activeTheme]
  );

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