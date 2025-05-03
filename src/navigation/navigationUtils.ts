// Navigation utilities for use outside of React components
import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation.types';

// Create a navigation reference that can be used outside of React components
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    // @ts-ignore: We're passing params as any
    navigationRef.navigate(name, params);
  }
}

/**
 * Go back to the previous screen
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/**
 * Reset the navigation state to a new state
 */
export function resetRoot(routeName: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot({
      index: 0,
      routes: [{ name: routeName, params }],
    });
  }
}

/**
 * Get the current route name
 */
export function getCurrentRouteName(): string | undefined {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.name;
  }
  return undefined;
}


export function getCurrentRouteParams(): any | undefined {
  if (navigationRef.isReady()) {
    return navigationRef.getCurrentRoute()?.params;
  }
  return undefined;
} 