/**
 * Storage utility for reliable persistence across platforms
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fallback in-memory storage
const memoryStorage = new Map<string, string>();

// Initialize storage
export const initializeStorage = async () => {
  try {
    // Test AsyncStorage
    await AsyncStorage.setItem('test', 'test');
    await AsyncStorage.removeItem('test');
    return true;
  } catch (error) {
    console.warn('AsyncStorage not available, using in-memory storage');
    return false;
  }
};

/**
 * Get an item from storage with fallback to memory if AsyncStorage fails
 */
export const getItem = async (key: string): Promise<string | null> => {
  try {
    // Try AsyncStorage first
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (error) {
    console.warn('AsyncStorage.getItem failed, using memory fallback:', error);
    // Fall back to memory storage
    return memoryStorage.get(key) || null;
  }
};

/**
 * Set an item in storage with fallback to memory if AsyncStorage fails
 */
export const setItem = async (key: string, value: string): Promise<void> => {
  try {
    // Try AsyncStorage first
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn('AsyncStorage.setItem failed, using memory fallback:', error);
    // Fall back to memory storage
    memoryStorage.set(key, value);
  }
};

/**
 * Remove an item from storage
 */
export const removeItem = async (key: string): Promise<void> => {
  try {
    // Try AsyncStorage first
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('AsyncStorage.removeItem failed, using memory fallback:', error);
    // Fall back to memory storage
    memoryStorage.delete(key);
  }
};

// Export a complete storage interface
export const storage = {
  getItem,
  setItem,
  removeItem,
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      memoryStorage.clear();
    }
  }
}; 