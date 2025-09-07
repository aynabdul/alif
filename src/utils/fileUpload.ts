import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { isOnline } from './offline';
import { addPendingAction } from './offline';

/**
 * Request camera and media library permissions
 */
export const requestMediaPermissions = async (): Promise<boolean> => {
  try {
    // Request camera permissions
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    
    // Request media library permissions
    const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraPermission.granted && mediaLibraryPermission.granted;
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

/**
 * Pick an image from camera
 */
export const pickImageFromCamera = async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error taking picture:', error);
    return null;
  }
};

/**
 * Pick an image from media library
 */
export const pickImageFromGallery = async (): Promise<string | null> => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      return result.assets[0].uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error picking image from gallery:', error);
    return null;
  }
};

/**
 * Get file info from URI
 */
export const getFileInfo = async (uri: string) => {
  const fileInfo = await FileSystem.getInfoAsync(uri);
  return fileInfo;
};

/**
 * Create a form data object with the image
 */
export const createFormData = (
  uri: string, 
  name: string, 
  type: string = 'image/jpeg'
): FormData => {
  const formData = new FormData();
  
  // Add image to form data
  formData.append('file', {
    uri,
    name: name,
    type,
  } as any);
  
  return formData;
};

/**
 * Prepare image for upload to server
 */
export const prepareImageForUpload = async (uri: string): Promise<{ uri: string; name: string; type: string }> => {
  // Get file info
  const fileInfo = await getFileInfo(uri);
  
  // Generate a unique file name
  const fileName = `${Date.now()}_${uri.split('/').pop()}`;
  
  // Determine file type based on extension
  const fileExtension = uri.split('.').pop()?.toLowerCase() || 'jpg';
  const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
  
  return {
    uri,
    name: fileName,
    type: mimeType,
  };
};

/**
 * Upload file to server or store for offline upload
 */
export const uploadFile = async (
  uri: string, 
  endpoint: string,
  onComplete?: (response: any) => void
): Promise<boolean> => {
  try {
    // Check if device is online
    const online = await isOnline();
    
    // Prepare the image
    const imageData = await prepareImageForUpload(uri);
    
    if (online) {
      // Create form data
      const formData = createFormData(imageData.uri, imageData.name, imageData.type);
      
      // Upload directly to server
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const responseJson = await response.json();
      
      if (onComplete) {
        onComplete(responseJson);
      }
      
      return true;
    } else {
      // Store for later upload when online
      await addPendingAction({
        id: Date.now().toString(),
        type: 'CREATE',
        entity: 'product',
        data: {
          imageUri: uri,
          endpoint,
        },
        timestamp: Date.now(),
      });
      
      if (onComplete) {
        onComplete({ offline: true, message: 'Image queued for upload when online' });
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    return false;
  }
}; 