import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StatusBar,
  Animated,
  Easing,

} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import KeyboardAwareInput from '../components/common/KeyboardAwareInput';
import Button from '../components/common/Button';
import { resetRoot } from '../navigation/navigationUtils';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { signIn, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Default to hidden
  const [loginError, setLoginError] = useState<string | null>(null);

  // Animation for logo
  const logoAnim = useRef(new Animated.Value(1)).current;
  const errorFadeAnim = useRef(new Animated.Value(0)).current;
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        Animated.timing(logoAnim, {
          toValue: 0.6,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  // Handle error message display and auto-dismiss
  useEffect(() => {
    if (loginError || error) {
      // Fade in the error message
      Animated.timing(errorFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Set timer to clear error after 2 seconds
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      
      errorTimerRef.current = setTimeout(() => {
        // Fade out the error message
        Animated.timing(errorFadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Clear the error after animation completes
          setLoginError(null);
          clearError();
        });
      }, 2000);
    } else {
      // Reset animation when error is cleared
      errorFadeAnim.setValue(0);
    }
    
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, [loginError, error]);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      setEmailError('Please enter your email');
      return false;
    }
    if (!emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (value: string): boolean => {
    if (!value) {
      setPasswordError('Please enter your password');
      return false;
    }
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    clearError();
    setLoginError(null);
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      try {
        await signIn(email, password);
        console.log('Signed in successfully');
        resetRoot('Profile'); // Redirect to Profile
      } catch (error) {
        let errorMessage = 'Something went wrong. Please try again.';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null) {
          const errorObj = error as any;
          
          if (errorObj.response?.status === 401) {
            errorMessage = 'Invalid email or password';
          } else if (errorObj.response?.status === 404) {
            errorMessage = 'Account not found. Please sign up';
          } else if (errorObj.message?.includes('Network Error')) {
            errorMessage = 'No internet connection. Please check your network';
          } else if (errorObj.message) {
            errorMessage = errorObj.message;
          }
        }
        
        setLoginError(errorMessage);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#F5F5F5' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20} // Adjusted offset
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.logoContainer]}>
          <Animated.Image 
            source={theme.country === 'US' ? require('../../assets/logoAmerica.png') : require('../../assets/Logo.png')}
            style={[
              styles.logo,
              { transform: [{ scale: logoAnim }] }
            ]} 
            resizeMode="contain"
          />
          <Animated.Text style={[
            styles.brandText, 
            { color: theme.colors.brand, transform: [{ scale: logoAnim }] }
          ]}>
            Alif Cattle & Goat Farm
          </Animated.Text>
        </View>

        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Sign In
          </Text>
        </View>

        <View style={styles.formContainer}>
          <KeyboardAwareInput
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
              if (loginError) setLoginError(null);
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={emailError}
            required
          />
          
          <KeyboardAwareInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
              if (loginError) setLoginError(null);
            }}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            error={passwordError}
            required
            rightIcon={
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Ionicons 
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={22} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
            }
          />
          
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.colors.brand }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          {(loginError || error) && (
            <Animated.View style={[styles.errorContainer, { opacity: errorFadeAnim }]}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {loginError || error}
              </Text>
            </Animated.View>
          )}

          <Button
            title="SIGN IN"
            onPress={handleLogin}
            loading={isLoading}
            style={{ backgroundColor: theme.colors.brand, marginTop: 24 }}
          />
          
          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: theme.colors.textSecondary }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.signupLink, { color: theme.colors.brand }]}>
                {' Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerContainer: {
    alignItems: 'center', // Center title
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  logoContainerCollapsed: {
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoCollapsed: {
    width: 80,
    height: 80,
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  brandTextCollapsed: {
    fontSize: 16,
    marginTop: 5,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 