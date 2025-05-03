import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../../types/api.types';

export interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
}

const categoryIconMap: Record<string, string> = {
  'ALIF BEEF': 'nutrition',
  'ALIF MUTTON': 'restaurant',
  'ALIF CHICKEN': 'restaurant-outline',
  'ALIF SEAFOOD': 'fish',
  DAIRY: 'water',
  OFFERS: 'pricetags',
  QURBANI: 'gift',
};

const getCategoryIcon = (categoryName: string): string => {
  const normalizedName = categoryName?.toUpperCase() || '';
  if (categoryIconMap[normalizedName]) {
    return categoryIconMap[normalizedName];
  }
  if (normalizedName.includes('BEEF')) return 'nutrition';
  if (normalizedName.includes('MUTTON') || normalizedName.includes('GOAT')) return 'restaurant';
  if (normalizedName.includes('CHICKEN')) return 'restaurant-outline';
  if (normalizedName.includes('SEAFOOD') || normalizedName.includes('FISH')) return 'fish';
  if (normalizedName.includes('DAIRY') || normalizedName.includes('MILK')) return 'water';
  if (normalizedName.includes('OFFER') || normalizedName.includes('DISCOUNT')) return 'pricetags';
  return 'paw';
};

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onPress }) => {
  const { theme } = useTheme();
  const iconName = getCategoryIcon(category.categoryName);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
        <Ionicons name={iconName as any} size={22} color={theme.colors.brand} />
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