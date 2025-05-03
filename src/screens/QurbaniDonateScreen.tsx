import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { qurbaniService } from '../services/api.service';
import { StatusBar } from 'expo-status-bar';
import { Qurbani } from '../types/api.types';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types/navigation.types';

const QurbaniDonateScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const [qurbanis, setQurbanis] = useState<Qurbani[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQurbanis();
  }, []);

  const fetchQurbanis = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await qurbaniService.getQurbanis();
      if (response.success && response.data) {
        const donateQurbanis = response.data.filter(
          qurbani => qurbani.showinwhichpage === 'donate'
        );
        setQurbanis(donateQurbanis);
      } else {
        setError('Failed to fetch donation options');
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching donations:', err);
      setError('Failed to load donation options. Please try again.');
      setLoading(false);
    }
  };

  const handleQurbaniPress = (qurbaniId: string) => {
    navigation.navigate('QurbaniDetails', { qurbaniId });
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading donation options...
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
        <Text style={[styles.title, { color: theme.colors.text }]}>Qurbani Donations</Text>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
          </View>
        ) : qurbanis.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No donation options available at the moment
            </Text>
          </View>
        ) : (
          <View style={styles.qurbaniList}>
            {qurbanis.map(qurbani => (
              <TouchableOpacity
                key={qurbani.id}
                style={[styles.qurbaniCard, { backgroundColor: theme.colors.cardBackground }]}
                onPress={() => handleQurbaniPress(qurbani.id.toString())}
              >
                <Text style={[styles.qurbaniTitle, { color: theme.colors.text }]}>
                  {qurbani.title}
                </Text>
                <Text style={[styles.qurbaniSubtitle, { color: theme.colors.textSecondary }]}>
                  {qurbani.subtitle}
                </Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                    Donate
                  </Text>
                  <Text style={[styles.price, { color: theme.colors.text }]}>
                    {`PKR ${qurbani.priceforpak} / USD ${qurbani.priceforus}`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  qurbaniList: {
    gap: 16,
  },
  qurbaniCard: {
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  qurbaniTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  qurbaniSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceLabel: {
    fontSize: 14,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QurbaniDonateScreen;