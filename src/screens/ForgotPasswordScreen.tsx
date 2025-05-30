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
  Modal,
  Animated,
  Easing,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/common/Button';
import KeyboardAwareInput from '../components/common/KeyboardAwareInput';
import { Ionicons } from '@expo/vector-icons';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const isFocused = useIsFocused();
  const { theme } = useTheme();
  const { forgetPassword, verifyOtpCode, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  const logoAnim = useRef(new Animated.Value(1)).current;
  const errorFadeAnim = useRef(new Animated.Value(0)).current;
  const modalSlideAnim = useRef(new Animated.Value(300)).current;
  const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      Animated.timing(logoAnim, {
        toValue: 0.6,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

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
  }, [error, clearError]);

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

  const validateOtp = (value: string): boolean => {
    if (!value.trim()) {
      setOtpError('OTP is required');
      return false;
    }
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(value)) {
      setOtpError('OTP must be a 6-digit number');
      return false;
    }
    setOtpError('');
    return true;
  };

  const handleResetPassword = async () => {
    clearError();
    const isEmailValid = validateEmail(email);

    if (isEmailValid) {
      setRequestLoading(true);
      try {
        console.log('ForgotPasswordScreen: Starting forgetPassword for email:', email, 'at:', new Date().toISOString());
        const response = await forgetPassword(email);
        console.log('ForgotPasswordScreen: forgetPassword response:', JSON.stringify(response, null, 2));
        
        setRequestLoading(false);
        if (response?.success) {
          console.log('ForgotPasswordScreen: Showing OTP modal');
          setModalVisible(true);
          Animated.timing(modalSlideAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start();
        } else {
          Alert.alert('Error', response?.message || 'Failed to send OTP. Please try again.');
        }
      } catch (error: any) {
        console.error('ForgotPasswordScreen: Error in handleResetPassword:', error);
        setRequestLoading(false);
        Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
      }
    }
  };

  const handleVerifyOtp = async () => {
    clearError();
    const isOtpValid = validateOtp(otp);

    if (isOtpValid) {
      try {
        await verifyOtpCode(email, otp);
        Animated.timing(modalSlideAnim, {
          toValue: 300,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          setModalVisible(false);
          setOtp('');
          navigation.navigate('ChangePassword', { email });
        });
      } catch (error) {
        // Error handled by useAuthStore
      }
    }
  };

  const handleCloseModal = () => {
    Animated.timing(modalSlideAnim, {
      toValue: 300,
      duration: 300,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setOtp('');
      clearError();
    });
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
            Forgot Password
          </Text>
        </View>

        <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
          Enter your email address to receive a verification code
        </Text>

        <View style={styles.formContainer}>
          <KeyboardAwareInput
            label="Email Address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
              clearError();
            }}
            placeholder="Enter your email"
            keyboardType="email-address"
            error={emailError}
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
            title="SEND VERIFICATION CODE"
            onPress={handleResetPassword}
            loading={isLoading || requestLoading}
            disabled={isLoading || requestLoading || !!emailError}
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="none"
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseModal}
        >
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ translateY: modalSlideAnim }],
                backgroundColor: theme.colors.background,
              },
            ]}
          >
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Enter Verification Code
            </Text>
            <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
              A 6-digit code was sent to {email}
            </Text>
            <KeyboardAwareInput
              label="Verification Code"
              value={otp}
              onChangeText={(text) => {
                setOtp(text);
                validateOtp(text);
                clearError();
              }}
              placeholder="Enter 6-digit code"
              keyboardType="phone-pad"
              error={otpError}
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
            title="VERIFY CODE"
            onPress={handleVerifyOtp}
            loading={isLoading}
            disabled={isLoading || !!otpError}
            style={{ backgroundColor: theme.colors.brand, marginTop: 16 }}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
            <Text style={[styles.modalCloseText, { color: theme.colors.brand }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalCloseButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;