import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  StatusBar,
  Animated,
  Easing,
  Keyboard,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { AuthStackNavigationProp, AuthStackParamList } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/common/Button';
import KeyboardAwareInput from '../components/common/KeyboardAwareInput';
import { Ionicons } from '@expo/vector-icons';

const ChangePasswordScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const route = useRoute<RouteProp<AuthStackParamList, 'ChangePassword'>>();
  const { theme } = useTheme();
  const { changePassword, isLoading, error, clearError } = useAuthStore();

  const { email } = route.params; // Email passed from ForgotPasswordScreen
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  console.log("email called Chnaghe Pass Screen", JSON.stringify(email, null, 2))

  // Animation refs
  const logoAnim = useRef(new Animated.Value(1)).current;
  const errorFadeAnim = useRef(new Animated.Value(0)).current;
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
  //     setKeyboardVisible(true);
  //     Animated.timing(logoAnim, {
  //       toValue: 0.6,
  //       duration: 200,
  //       easing: Easing.ease,
  //       useNativeDriver: true,
  //     }).start();
  //   });
  //   const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
  //     setKeyboardVisible(false);
  //     Animated.timing(logoAnim, {
  //       toValue: 1,
  //       duration: 200,
  //       easing: Easing.ease,
  //       useNativeDriver: true,
  //     }).start();
  //   });

  //   return () => {
  //     keyboardDidHideListener.remove();
  //     keyboardDidShowListener.remove();
  //     if (errorTimerRef.current) {
  //       clearTimeout(errorTimerRef.current);
  //     }
  //   };
  // }, []);

  // Handle error message display and auto-dismiss
  useEffect(() => {
    if (error) {
      Animated.timing(errorFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }

      errorTimerRef.current = setTimeout(() => {
        Animated.timing(errorFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          clearError();
        });
      }, 2000);
    } else {
      errorFadeAnim.setValue(0);
    }

    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, [clearError]);

  const validatePassword = (value: string): boolean => {
    if (!value.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (value: string): boolean => {
    if (!value.trim()) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (value !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleChangePassword = async () => {
    clearError();
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (isPasswordValid && isConfirmPasswordValid) {
      try {
        console.log("Called Change Pass")
        await changePassword(email, password);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } catch (error) {
        // Error is handled by useAuthStore and displayed via error state
      }
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#F5F5F5' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Animated.Image
            source={
              theme.country === 'US'
                ? require('../../assets/logoAmerica.png')
                : require('../../assets/Logo.png')
            }
            style={[styles.logo, { transform: [{ scale: logoAnim }] }]}
            resizeMode="contain"
          />
          <Animated.Text
            style={[
              styles.brandText,
              { color: theme.colors.brand, transform: [{ scale: logoAnim }] },
            ]}
          >
            Alif Cattle & Goat Farm
          </Animated.Text>
        </View>

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Change Password
          </Text>
        </View>

        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Enter and confirm your new password
        </Text>

        <View style={styles.formContainer}>
          <KeyboardAwareInput
            label="New Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
              clearError();
            }}
            placeholder="Enter new password"
            secureTextEntry
            error={passwordError}
            required
          />
          <KeyboardAwareInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              validateConfirmPassword(text);
              clearError();
            }}
            placeholder="Confirm new password"
            secureTextEntry
            error={confirmPasswordError}
            required
          />

          {error && (
            <Animated.View style={[styles.errorContainer, { opacity: errorFadeAnim }]}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            </Animated.View>
          )}

          <Button
            title="SAVE NEW PASSWORD"
            onPress={handleChangePassword}
            loading={isLoading}
            disabled={isLoading || !!passwordError || !!confirmPasswordError}
            style={{ backgroundColor: theme.colors.brand, marginTop: 24 }}
          />

          <TouchableOpacity
            style={styles.backToLoginContainer}
            onPress={handleBackToLogin}
          >
            <Text style={[styles.backToLoginText, { color: theme.colors.brand }]}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#ffeeee',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  backToLoginContainer: {
    alignItems: 'center',
    marginTop: 24,
    padding: 10,
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;