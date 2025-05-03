import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import KeyboardAwareInput from '../components/common/KeyboardAwareInput';
import Button from '../components/common/Button';
import { authService } from '../services/api.service';
import { useAuthStore } from '../stores/authStore';
import { resetRoot } from '../navigation/navigationUtils';

const RegisterScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp<'Register'>>();
  const { theme } = useTheme();
  const { signIn, isLoading, error, clearError } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+92');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [registering, setRegistering] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  React.useEffect(() => {
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

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setNameError('Name is required');
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

  const validatePhone = (value: string): boolean => {
    if (!value.trim()) {
      setPhoneError('Phone number is required');
      return false;
    }
    // Basic validation for phone number
    if (!/^\d{10,11}$/.test(value.trim())) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
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

  const handleRegister = async () => {
    clearError();
    
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isPasswordValid = validatePassword(password);
    
    if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid) {
      setRegistering(true);
      try {
        // Call the signup API directly with phone number
        const response = await authService.signUp(name, email, password, `${countryCode}${phone}`);
        
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
                    // Auto sign in the user
                    await signIn(email, password);
                    // Navigate to the Home screen
                    resetRoot('Main');
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
          Alert.alert("Registration Failed", response.message || "An error occurred during registration");
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Registration failed";
        Alert.alert("Registration Error", errorMessage);
      } finally {
        setRegistering(false);
      }
    }
  };
  
  const handleCountryCodePress = () => {
    navigation.navigate('CountrySelect', {
      onSelect: (countryCode: string) => {
        setCountryCode(countryCode);
      }
    });
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
            Sign up to your Account
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Create an account to continue
          </Text>
        </View>

        <View style={styles.formContainer}>
          <KeyboardAwareInput
            label="Full Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              validateName(text);
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
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={emailError}
            required
          />

          <KeyboardAwareInput
            label="Phone Number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              validatePhone(text);
            }}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            countryCode={countryCode}
            onCountryCodePress={handleCountryCodePress}
            error={phoneError}
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

          {error && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {error}
              </Text>
            </View>
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
                {' '}Sign In
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
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
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