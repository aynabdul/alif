import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetRoot } from '../navigation/navigationUtils';

export const handleUnauthorized = async () => {
  console.log('Handling unauthorized access (401)');
  try {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('isAdmin');
    await AsyncStorage.removeItem('resetCodeVerified');
    setTimeout(() => {
      resetRoot('Auth');
    }, 500);
  } catch (error) {
    console.error('Error handling unauthorized:', error);
  }
};