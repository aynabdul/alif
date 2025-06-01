import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Beef, Drumstick, Ham } from 'lucide-react-native';
import { Category } from '../../types/api.types';

export interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

// Custom icon mapping with Lucide icons
const categoryIconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  'BEEF': Beef,
  'MUTTON': Drumstick, // Using PiggyBank as a placeholder for ham/mutton
  'CHICKEN': Ham,
};

const getCategoryIcon = (categoryName: string) => {
  const normalizedName = categoryName?.toUpperCase()?.trim() || '';

  // Check for exact matches first
  if (categoryIconMap[normalizedName]) {
    return categoryIconMap[normalizedName];
  }

  // Check for partial matches
  if (normalizedName.includes('BEEF')) return Beef;
  if (normalizedName.includes('MUTTON') || normalizedName.includes('GOAT'))
    return Drumstick;
  if (normalizedName.includes('CHICKEN') || normalizedName.includes('POULTRY'))
    return Ham;
  return undefined;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const { theme } = useTheme();
  const IconComponent = getCategoryIcon(category.categoryName);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
        {IconComponent && <IconComponent size={22} color={theme.colors.brand} />}
      </View>
      <Text style={[styles.name, { color: theme.colors.text }]} numberOfLines={1}>
        {category.categoryName}
      </Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 80,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default CategoryCard;