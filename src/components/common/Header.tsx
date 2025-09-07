import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import HamburgerMenu from './HamburgerMenu';
import { Category } from '../../types/api.types';
import { RootStackNavigationProp } from '../../types/navigation.types';

interface HeaderProps {
  categories: Category[];
}

const Header: React.FC<HeaderProps> = ({ categories }) => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();

  const handlePhonePress = () => {
    navigation.navigate('Contact');
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <HamburgerMenu categories={categories} />
      <TouchableOpacity style={styles.phoneButton} onPress={handlePhonePress}>
        <Ionicons name="call-outline" size={18} color={theme.colors.text} />
        <Text style={[styles.phoneText, { color: theme.colors.text }]}>
          Get in Touch
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    backgroundColor: 'red', 
  },
  phoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default Header;