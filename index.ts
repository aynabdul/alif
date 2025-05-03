/**
 * Entry point for the Animal Farm App
 */
import 'expo-dev-client';
import { Platform, LogBox } from 'react-native';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import App from './App';

// Ensure splash screen remains visible until explicitly hidden
SplashScreen.preventAutoHideAsync().catch(() => {
  console.warn("SplashScreen.preventAutoHideAsync() promise rejected");
});

// Ignore AsyncStorage warnings
LogBox.ignoreLogs([
  'AsyncStorage has been extracted from react-native',
  'NativeModule: AsyncStorage is null',
  'Warning: TRenderEngineProvider',
]);

// Register the root component
registerRootComponent(App);

// Export the default component for legacy/web support
export default App;
