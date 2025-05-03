import React, { useState, useEffect } from 'react';
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
  Alert,
  Keyboard
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthScreenNavigationProp } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/common/Button';
import KeyboardAwareInput from '../components/common/KeyboardAwareInput';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp<'ForgotPassword'>>();
  const { theme } = useTheme();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    if (!value.trim()) {
      setEmailError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };
  
  const handleResetPassword = async () => {
    clearError();
    
    const isEmailValid = validateEmail(email);
    
    if (isEmailValid) {
      try {
        await resetPassword(email);
        setIsSubmitted(true);
      } catch (error) {
        Alert.alert('Error', 'Failed to send reset password email. Please try again.');
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

        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Forgot Password
          </Text>
        </View>
          
        {!isSubmitted ? (
          <>
            <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
            
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
              
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {error}
                  </Text>
                </View>
              )}
              
              <Button
                title="SEND RESET LINK"
                onPress={handleResetPassword}
                loading={isLoading}
                disabled={isLoading}
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
          </>
        ) : (
          <View style={styles.successContainer}>
            <Ionicons name="checkmark-circle" size={80} color={theme.colors.success || theme.colors.brand} />
            <Text style={[styles.successTitle, { color: theme.colors.text }]}>
              Email Sent!
            </Text>
            <Text style={[styles.successMessage, { color: theme.colors.textSecondary }]}>
              We've sent a password reset link to {email}. Please check your email and follow the instructions.
            </Text>
            <Button
              title="BACK TO LOGIN"
              onPress={handleBackToLogin}
              style={{ backgroundColor: theme.colors.brand, marginTop: 30 }}
            />
          </View>
        )}
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
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
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
  successContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
});

export default ForgotPasswordScreen; 