import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { getPaperTheme } from './src/theme/themes';
import { PaperProvider } from 'react-native-paper';
import RootNavigator from './src/navigation/RootNavigator';
import { initializeStorage } from './src/utils/storage';

SplashScreen.preventAutoHideAsync().catch(() => {});

const ThemedPaperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  return <PaperProvider theme={getPaperTheme(theme)}>{children}</PaperProvider>;
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [appLayout, setAppLayout] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Promise.all([
          initializeStorage(),
          new Promise(resolve => setTimeout(resolve, 1000)),
        ]);
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      setAppLayout(true);
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn('Error hiding splash screen:', e);
      }
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container} onLayout={onLayoutRootView}>
        <StatusBar style="auto" />
        <ThemeProvider>
          <ThemedPaperProvider>
            <RootNavigator />
          </ThemedPaperProvider>
        </ThemeProvider>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});