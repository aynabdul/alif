import { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';

export const useSystemUI = (hidden: boolean = true) => {
  useEffect(() => {
    const configureSystemUI = async () => {
      try {
        // Handle StatusBar
        StatusBar.setHidden(hidden);
        
        // Handle Navigation Bar on Android
        if (Platform.OS === 'android') {
          await NavigationBar.setVisibilityAsync(hidden ? 'hidden' : 'visible');
          if (!hidden) {
            // Auto-hide after 3 seconds if shown
            setTimeout(async () => {
              await NavigationBar.setVisibilityAsync('hidden');
              StatusBar.setHidden(true);
            }, 3000);
          }
        }
      } catch (error) {
        console.warn('Error configuring system UI:', error);
      }
    };

    configureSystemUI();
  }, [hidden]);

  return {
    showSystemUI: async () => {
      StatusBar.setHidden(false);
      if (Platform.OS === 'android') {
        await NavigationBar.setVisibilityAsync('visible');
      }
    },
    hideSystemUI: async () => {
      StatusBar.setHidden(true);
      if (Platform.OS === 'android') {
        await NavigationBar.setVisibilityAsync('hidden');
      }
    }
  };
};