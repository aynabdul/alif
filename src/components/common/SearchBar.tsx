import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onPress?: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onPress,
  placeholder = 'Search for products...'
}) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.border
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons 
        name="search" 
        size={20} 
        color={theme.colors.textSecondary} 
      />
      <Text 
        style={[styles.placeholder, { color: theme.colors.textSecondary }]}
      >
        {placeholder}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  placeholder: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default SearchBar; 