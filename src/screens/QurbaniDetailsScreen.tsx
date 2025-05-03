import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { QurbaniDetailsRouteProp } from '../types/navigation.types';
import { qurbaniService } from '../services/api.service';
import { Qurbani } from '../types/api.types';
import { StatusBar } from 'expo-status-bar';

const QurbaniDetailsScreen = () => {
  const route = useRoute<QurbaniDetailsRouteProp>();
  const { theme } = useTheme();
  const { qurbaniId } = route.params;

  const [qurbani, setQurbani] = useState<Qurbani | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQurbaniDetails();
  }, [qurbaniId]);

  const fetchQurbaniDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await qurbaniService.getQurbaniById(qurbaniId);
      if (response.success && response.data) {
        setQurbani(response.data);
      } else {
        setError('Failed to fetch Qurbani details');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Qurbani details:', err);
      setError('Failed to load Qurbani details. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading Qurbani details...
          </Text>
        </View>
      </View>
    );
  }

  if (error || !qurbani) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            {error || 'Qurbani not found'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} backgroundColor="transparent" translucent />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>{qurbani.title}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {qurbani.subtitle}
        </Text>
        <Text style={[styles.description, { color: theme.colors.text }]}>
          {qurbani.description}
        </Text>
        
        <View style={styles.priceSection}>
          <View style={styles.priceBlock}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              Price (Pakistan)
            </Text>
            <Text style={[styles.price, { color: theme.colors.text }]}>
              PKR {qurbani.priceforpak?.toFixed(2)}
            </Text>
            <Text style={[styles.sku, { color: theme.colors.textSecondary }]}>
              SKU: {qurbani.skunopak}
            </Text>
          </View>
          
          <View style={styles.priceBlock}>
            <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
              Price (USA)
            </Text>
            <Text style={[styles.price, { color: theme.colors.text }]}>
              USD {qurbani.priceforus?.toFixed(2)}
            </Text>
            <Text style={[styles.sku, { color: theme.colors.textSecondary }]}>
              SKU: {qurbani.skunous}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  priceBlock: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 8,
  },
  priceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sku: {
    fontSize: 12,
  },
});

export default QurbaniDetailsScreen;