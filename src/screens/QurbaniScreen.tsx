import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  Platform,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../theme/ThemeContext';
import { qurbaniService } from '../services/api.service';
import { Qurbani } from '../types/api.types';
import QurbaniCard from '../components/common/QurbaniCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GuideCard from '../components/Qurbani/GuideCard';

const QurbaniScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [qurbanis, setQurbanis] = useState<Qurbani[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQurbanis();
  }, []);

  const fetchQurbanis = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching all qurbanis for main screen...');
      const response = await qurbaniService.getQurbanis();
      console.log('Qurbani main screen response:', response);
      
      if (response.success && response.data) {
        console.log('Mapping qurbanis for UI:', response.data.length, 'items');
        // Map backend fields to frontend expected fields for backward compatibility
        const mappedQurbanis = response.data.map(qurbani => ({
          ...qurbani,
          qurbaniName: qurbani.title || qurbani.qurbaniName,
          qurbaniDescription: qurbani.description || qurbani.qurbaniDescription,
          qurbaniPricePak: qurbani.priceforpak || qurbani.qurbaniPricePak,
          qurbaniPriceUSA: qurbani.priceforus || qurbani.qurbaniPriceUSA,
          qurbaniQuantity: 10, // Default quantity if not provided
          qurbaniImages: qurbani.QurbaniImages || qurbani.qurbaniImages || []
        }));
        
        console.log('Processed qurbanis:', mappedQurbanis.length);
        setQurbanis(mappedQurbanis);
      } else {
        console.error('API returned success=false or no data:', response);
        setError(`Failed to fetch Qurbani options: ${response.message || 'Unknown error'}`);
      }
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching Qurbanis:', err);
      setError(`Failed to load Qurbani options: ${errorMessage}`);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQurbanis();
    setRefreshing(false);
  };

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.background,
        }
      ]}
    >
      <StatusBar style={theme.statusBarStyle} backgroundColor="transparent" translucent />
      
      <FlatList
        data={qurbanis}
        ListHeaderComponent={<GuideCard />}
        renderItem={({ item }: { item: Qurbani }) => (
          <QurbaniCard qurbani={item} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.qurbaniGrid,
          { paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.brand]}
            tintColor={theme.colors.brand}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.colors.brand} />
              <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                Loading Qurbani options...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No Qurbani options available
              </Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  qurbaniGrid: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default QurbaniScreen;