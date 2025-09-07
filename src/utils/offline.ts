import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Product, Category, Qurbani } from '../types/api.types';

// Storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'offline_products',
  CATEGORIES: 'offline_categories',
  QURBANIS: 'offline_qurbanis',
  PENDING_ACTIONS: 'offline_pending_actions',
  LAST_SYNC: 'offline_last_sync'
};

// Pending action types
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE';

export interface PendingAction {
  id: string;
  type: ActionType;
  entity: 'product' | 'order' | 'cart' | 'profile';
  data: any;
  timestamp: number;
}

// Check if the device is online
export const isOnline = async (): Promise<boolean> => {
  const netInfo = await NetInfo.fetch();
  return !!netInfo.isConnected;
};

// Save data for offline use
export const saveProductsOffline = async (products: Product[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
  } catch (error) {
    console.error('Error saving products offline:', error);
  }
};

export const saveCategoriesOffline = async (categories: Category[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (error) {
    console.error('Error saving categories offline:', error);
  }
};

export const saveQurbanisOffline = async (qurbanis: Qurbani[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.QURBANIS, JSON.stringify(qurbanis));
  } catch (error) {
    console.error('Error saving qurbanis offline:', error);
  }
};

// Get offline data
export const getOfflineProducts = async (): Promise<Product[]> => {
  try {
    const productsJson = await AsyncStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return productsJson ? JSON.parse(productsJson) : [];
  } catch (error) {
    console.error('Error getting offline products:', error);
    return [];
  }
};

export const getOfflineCategories = async (): Promise<Category[]> => {
  try {
    const categoriesJson = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return categoriesJson ? JSON.parse(categoriesJson) : [];
  } catch (error) {
    console.error('Error getting offline categories:', error);
    return [];
  }
};

export const getOfflineQurbanis = async (): Promise<Qurbani[]> => {
  try {
    const qurbanisJson = await AsyncStorage.getItem(STORAGE_KEYS.QURBANIS);
    return qurbanisJson ? JSON.parse(qurbanisJson) : [];
  } catch (error) {
    console.error('Error getting offline qurbanis:', error);
    return [];
  }
};

// Get last sync timestamp
export const getLastSyncTime = async (): Promise<number> => {
  try {
    const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
    return timestamp ? parseInt(timestamp, 10) : 0;
  } catch (error) {
    console.error('Error getting last sync time:', error);
    return 0;
  }
};

// Add pending action to the queue
export const addPendingAction = async (action: PendingAction): Promise<void> => {
  try {
    const pendingActionsJson = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
    const pendingActions: PendingAction[] = pendingActionsJson ? JSON.parse(pendingActionsJson) : [];
    
    pendingActions.push(action);
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(pendingActions));
  } catch (error) {
    console.error('Error adding pending action:', error);
  }
};

// Get all pending actions
export const getPendingActions = async (): Promise<PendingAction[]> => {
  try {
    const pendingActionsJson = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
    return pendingActionsJson ? JSON.parse(pendingActionsJson) : [];
  } catch (error) {
    console.error('Error getting pending actions:', error);
    return [];
  }
};

// Remove a pending action
export const removePendingAction = async (actionId: string): Promise<void> => {
  try {
    const pendingActionsJson = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
    let pendingActions: PendingAction[] = pendingActionsJson ? JSON.parse(pendingActionsJson) : [];
    
    pendingActions = pendingActions.filter(action => action.id !== actionId);
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(pendingActions));
  } catch (error) {
    console.error('Error removing pending action:', error);
  }
};

// Clear all pending actions
export const clearPendingActions = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_ACTIONS);
  } catch (error) {
    console.error('Error clearing pending actions:', error);
  }
}; 