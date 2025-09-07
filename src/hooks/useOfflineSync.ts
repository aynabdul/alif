import { useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { 
  getPendingActions, 
  removePendingAction, 
  PendingAction 
} from '../utils/offline';
import { productService, categoryService, qurbaniService } from '../services/api.service';
import { uploadFile } from '../utils/fileUpload';

/**
 * Custom hook for handling offline syncing
 */
export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  // Subscribe to network state changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const online = !!state.isConnected;
      setIsOnline(online);
      
      // If coming back online, trigger sync
      if (online && !isOnline) {
        syncData();
      }
    });
    
    // Load pending actions on mount
    loadPendingActions();
    
    return () => {
      unsubscribe();
    };
  }, [isOnline]);
  
  // Load pending actions from storage
  const loadPendingActions = async () => {
    const actions = await getPendingActions();
    setPendingActions(actions);
  };
  
  // Sync data when coming back online
  const syncData = async () => {
    if (isSyncing || !isOnline) return;
    
    setIsSyncing(true);
    
    try {
      // Load pending actions again to get the latest
      const actions = await getPendingActions();
      
      if (actions.length === 0) {
        setIsSyncing(false);
        setLastSyncTime(new Date());
        return;
      }
      
      // Sort actions by timestamp (oldest first)
      const sortedActions = [...actions].sort((a, b) => a.timestamp - b.timestamp);
      
      // Process each action
      for (const action of sortedActions) {
        await processAction(action);
        // Remove the action after processing
        await removePendingAction(action.id);
      }
      
      // Refresh pending actions
      await loadPendingActions();
      
      // Update last sync time
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Process a single pending action
  const processAction = async (action: PendingAction) => {
    try {
      switch (action.type) {
        case 'CREATE':
          if (action.entity === 'product' && action.data.imageUri) {
            // Handle file uploads
            await uploadFile(action.data.imageUri, action.data.endpoint);
          }
          break;
          
        case 'UPDATE':
          // Handle updates
          break;
          
        case 'DELETE':
          // Handle deletions
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error(`Error processing action ${action.id}:`, error);
      throw error;
    }
  };
  
  // Manual sync trigger
  const triggerSync = () => {
    if (isOnline && !isSyncing) {
      syncData();
    }
  };
  
  return {
    isOnline,
    isSyncing,
    pendingActions,
    lastSyncTime,
    triggerSync,
  };
}; 