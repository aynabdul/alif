import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Keyboard, Platform, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

interface KeyboardAwareInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  secureTextEntry?: boolean;
  countryCode?: string;
  onCountryCodePress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const KeyboardAwareInput: React.FC<KeyboardAwareInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  keyboardType = 'default',
  secureTextEntry = false,
  countryCode = '+92',
  onCountryCodePress,
  leftIcon,
  rightIcon,
}) => {
  const { theme } = useTheme();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const errorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    Animated.timing(errorAnim, {
      toValue: error ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [error]);

  const handleFocus = () => {
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    inputRef.current?.blur();
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: error ? theme.colors.error : theme.colors.text }]}>
            {label}
            {required && <Text style={{ color: theme.colors.error }}> *</Text>}
          </Text>
        </View>
      )}

      <View style={[
        styles.inputContainer, 
        { 
          borderColor: error 
            ? theme.colors.error 
            : isFocused 
              ? theme.colors.brand 
              : theme.colors.border 
        }
      ]}>
        {keyboardType === 'phone-pad' && (
          <TouchableOpacity
            style={styles.countryCodeContainer}
            onPress={onCountryCodePress}
            accessibilityLabel="Select country code"
          >
            <Text style={[styles.countryCode, { color: theme.colors.text }]}>
              {countryCode}
            </Text>
            <Ionicons name="chevron-down" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        )}

        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}

        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              marginLeft: keyboardType === 'phone-pad' ? 0 : (leftIcon ? 0 : 10),
            },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={label}
          accessibilityHint={placeholder}
        />

        {rightIcon ? (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        ) : (
          <TouchableOpacity
            style={styles.keyboardIcon}
            onPress={isKeyboardVisible ? handleBlur : handleFocus}
            accessibilityLabel={isKeyboardVisible ? 'Hide keyboard' : 'Show keyboard'}
          >
            <Ionicons
              name={isKeyboardVisible ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Animated.View style={[
          styles.errorContainer,
          { opacity: errorAnim }
        ]}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error}
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 8,
    height: 50,
    backgroundColor: '#F5F5F5',
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
    height: '100%',
  },
  countryCode: {
    fontSize: 16,
    marginRight: 4,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingHorizontal: 12,
  },
  keyboardIcon: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#ffeeee',
    borderWidth: 1,
    borderColor: '#ffcccc',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    textAlign: 'center',
  },
  leftIconContainer: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingHorizontal: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default KeyboardAwareInput;