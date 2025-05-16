import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
  StatusBar,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import KeyboardAwareInput from '../components/common/KeyboardAwareInput';
import Button from '../components/common/Button';
import { authService } from '../services/api.service';
import { useAuthStore } from '../stores/authStore';
import { resetRoot } from '../navigation/navigationUtils';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { theme } = useTheme();
  const { signIn, isLoading, error, clearError } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  const [registering, setRegistering] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Default to hidden
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Default to hidden
  const [registerError, setRegisterError] = useState<string | null>(null);

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
    if (registerError || error) {
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
          setRegisterError(null);
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
  }, [registerError, error]);

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setNameError('Please enter your full name');
      return false;
    }
    if (value.trim().length < 3) {
      setNameError('Name must be at least 3 characters');
      return false;
    }
    setNameError('');
    return true;
  };

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
      setPasswordError('Please enter a password');
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
    if (!value) {
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

  const handleRegister = async () => {
    clearError();
    setRegisterError(null);
    
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      setRegistering(true);
      try {
        const response = await authService.signUp(name, email, password);
        
        if (response.status === 201) {
          Alert.alert(
            "Registration Successful",
            "Your account has been created. Would you like to sign in now?",
            [
              { 
                text: "Not Now", 
                onPress: () => navigation.navigate('Login'),
                style: 'cancel'
              },
              {
                text: "Sign In",
                onPress: async () => {
                  try {
                    await signIn(email, password);
                    console.log('Signed in successfully');
                    resetRoot('Profile'); // Redirect to Profile after auto-sign-in
                  } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : "Sign in failed";
                    Alert.alert("Sign In Error", errorMessage);
                    navigation.navigate('Login');
                  }
                }
              }
            ]
          );
        } else {
          throw new Error(response.message || "Registration failed");
        }
      } catch (error) {
        let errorMessage = 'Something went wrong. Please try again.';
        
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null) {
          const errorObj = error as any;
          
          if (errorObj.response?.data?.message?.includes('already exists') || errorObj.response?.status === 400) {
            errorMessage = 'An account with this email already exists';
          } else if (errorObj.response?.status === 400) {
            errorMessage = 'Invalid registration information';
          } else if (errorObj.message?.includes('Network Error')) {
            errorMessage = 'No internet connection. Please check your network';
          } else if (errorObj.message) {
            errorMessage = errorObj.message;
          }
        }
        
        setRegisterError(errorMessage);
      } finally {
        setRegistering(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
            Sign Up
          </Text>
        </View>

        <View style={styles.formContainer}>
          <KeyboardAwareInput
            label="Full Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              validateName(text);
              if (registerError) setRegisterError(null);
            }}
            placeholder="Enter your full name"
            error={nameError}
            required
          />

          <KeyboardAwareInput
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
              if (registerError) setRegisterError(null);
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
              if (confirmPassword) {
                validateConfirmPassword(confirmPassword);
              }
              if (registerError) setRegisterError(null);
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

          <KeyboardAwareInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              validateConfirmPassword(text);
              if (registerError) setRegisterError(null);
            }}
            placeholder="Confirm your password"
            secureTextEntry={!showConfirmPassword}
            error={confirmPasswordError}
            required
            rightIcon={
              <TouchableOpacity onPress={toggleConfirmPasswordVisibility}>
                <Ionicons 
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} 
                  size={22} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
            }
          />

          {(registerError || error) && (
            <Animated.View style={[styles.errorContainer, { opacity: errorFadeAnim }]}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {registerError || error}
              </Text>
            </Animated.View>
          )}

          <Button
            title="SIGN UP"
            onPress={handleRegister}
            loading={registering || isLoading}
            disabled={registering || isLoading}
            style={{ backgroundColor: theme.colors.brand, marginTop: 24 }}
          />

          <View style={styles.loginLinkContainer}>
            <Text style={[styles.loginLinkText, { color: theme.colors.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginLink, { color: theme.colors.brand }]}>
                {' Sign In'}
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

  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen; 