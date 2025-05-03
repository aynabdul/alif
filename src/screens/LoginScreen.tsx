import React, { useState, useEffect } from 'react';
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
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import KeyboardAwareInput from '../components/common/KeyboardAwareInput';
import Button from '../components/common/Button';
import { resetRoot } from '../navigation/navigationUtils';

const LoginScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<AuthScreenNavigationProp<'Login'>>();
  const { signIn, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [userType, setUserType] = useState<'customer' | 'admin'>('customer');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      setEmailError('Email is required');
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

  const handleLogin = async () => {
    clearError();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (isEmailValid && isPasswordValid) {
      try {
        await signIn(email, password);
        resetRoot('Main');
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: '#F5F5F5' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.logoContainer, keyboardVisible && styles.logoContainerCollapsed]}>
          <Image 
            source={require('../../assets/Logo.png')}
            style={[styles.logo, keyboardVisible && styles.logoCollapsed]} 
            resizeMode="contain"
          />
          <Text style={[styles.brandText, { color: theme.colors.brand }, keyboardVisible && styles.brandTextCollapsed]}>
            Alif Cattle & Goat Farm
          </Text>
        </View>

        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Sign in to your Account
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Enter your email and password to login
          </Text>
        </View>

        <View style={styles.userTypeContainer}>
          <TouchableOpacity 
            style={[
              styles.userTypeButton, 
              userType === 'customer' ? { 
                backgroundColor: theme.colors.brand,
                borderColor: theme.colors.brand 
              } : null
            ]}
            onPress={() => setUserType('customer')}
          >
            <Text 
              style={[
                styles.userTypeText, 
                userType === 'customer' ? { color: '#FFFFFF' } : null
              ]}
            >
              Customer
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.userTypeButton, 
              userType === 'admin' ? { 
                backgroundColor: theme.colors.brand,
                borderColor: theme.colors.brand 
              } : null
            ]}
            onPress={() => setUserType('admin')}
          >
            <Text 
              style={[
                styles.userTypeText, 
                userType === 'admin' ? { color: '#FFFFFF' } : null
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <KeyboardAwareInput
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
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
            }}
            placeholder="Enter your password"
            secureTextEntry
            error={passwordError}
            required
          />
          
          <TouchableOpacity 
            style={styles.forgotPasswordContainer}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.colors.brand }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          {error && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            </View>
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
  headerContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    overflow: 'hidden',
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userTypeText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#666',
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
  errorContainer: {
    backgroundColor: '#ffeeee',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
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