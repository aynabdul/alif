import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, NavigationState } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation.types';
import { useAuthStore } from '../stores/authStore';
import { useTheme } from '../theme/ThemeContext';
import { navigationRef } from './navigationUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { useSystemUI } from '../hooks/useSystemUI';

// Navigators
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

// Screens
import CountrySelectScreen from '../screens/CountrySelectScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const COUNTRY_SELECTION_DATE_KEY = '@country_selection_date';
const COUNTRY_SELECTION_INTERVAL = 2 * 60 * 1000;

const RootNavigator = () => {
  const { theme, lastSelectionDate } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [needsCountrySelection, setNeedsCountrySelection] = useState(false);
  const [navigationReady, setNavigationReady] = useState(false);
  const { showSystemUI, hideSystemUI } = useSystemUI(true);

  useEffect(() => {
    const checkCountrySelectionNeeded = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const savedDateStr = await AsyncStorage.getItem(COUNTRY_SELECTION_DATE_KEY);
        if (!savedDateStr) {
          setNeedsCountrySelection(true);
        } else {
          const lastSelectionDate = Number(savedDateStr);
          const currentTime = Date.now();
          const timeSinceLastSelection = currentTime - lastSelectionDate;
          if (timeSinceLastSelection > COUNTRY_SELECTION_INTERVAL) {
            setNeedsCountrySelection(true);
          } else {
            setNeedsCountrySelection(false);
          }
        }
      } catch (error) {
        console.error('Error checking country selection:', error);
        setNeedsCountrySelection(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkCountrySelectionNeeded();
  }, [lastSelectionDate]);

  const onNavigationStateChange = (state: NavigationState | undefined) => {
    if (state) {
      showSystemUI();
    }
  };

  const onNavigationReady = () => {
    setNavigationReady(true);
    hideSystemUI();
    if (!isLoading && !authLoading && navigationReady) {
      setTimeout(async () => {
        try {
          await SplashScreen.hideAsync();
          hideSystemUI();
        } catch (error) {
          console.warn('Error hiding splash screen:', error);
        }
      }, 150);
    }
  };

  if (isLoading || authLoading) {
    return null;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={theme.navigationTheme}
      onReady={onNavigationReady}
      onStateChange={onNavigationStateChange}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'fade',
        }}
      >
        {needsCountrySelection ? (
          <Stack.Screen
            name="CountrySelect"
            component={CountrySelectScreen}
            options={{
              animation: 'none',
              contentStyle: { backgroundColor: theme.colors.background },
            }}
          />
        ) : (
          <>
            <Stack.Screen name="Main" component={AppNavigator} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;