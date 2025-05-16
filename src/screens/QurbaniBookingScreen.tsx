import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  SectionList,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { qurbaniService } from '../services/api.service';
import { StatusBar } from 'expo-status-bar';
import { Qurbani } from '../types/api.types';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types/navigation.types';
import GuideCard from '../components/Qurbani/GuideCard';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../stores/cartStore';
import { IMAGE_PLACEHOLDERS } from '../constants';
import { API_BASE_URL } from '../config/api';
import QurbaniCard from '../components/common/QurbaniCard';

const QurbaniBookingScreen = () => {
  const { theme, country } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { addItem, country: storeCountry } = useCartStore();
  const [qurbanis, setQurbanis] = useState<Qurbani[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQurbanis();
  }, [country]);

  const fetchQurbanis = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching qurbanis for booking screen...');
      const response = await qurbaniService.getQurbanis();
      console.log('Qurbani booking screen response:', response);
      
      if (response.success && response.data) {
        console.log('Filtering qurbanis for booking:', response.data);
        // Filter by both page type AND country selection
        const userCountry = country === 'PAK' ? 'Pakistan' : 'America';
        const bookingQurbanis = response.data.filter(
          qurbani => (qurbani.showinwhichpage === 'bookqurbani' || qurbani.showinwhichpage === 'booking') && 
                    (!qurbani.countrySelection || qurbani.countrySelection === userCountry)
        );
        console.log(`Found booking qurbanis for ${userCountry}:`, bookingQurbanis.length);
        setQurbanis(bookingQurbanis);
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

  // Group qurbanis by category
  const qurbanisByCategory = useMemo(() => {
    const grouped: { [key: string]: Qurbani[] } = {};
    
    // Group by category
    qurbanis.forEach(qurbani => {
      const category = qurbani.catagory || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(qurbani);
    });
    
    // Convert to sections for SectionList
    return Object.keys(grouped).map(category => ({
      title: category,
      data: [grouped[category]] // Wrap in array for renderItem to receive array for horizontal FlatList
    }));
  }, [qurbanis]);

  const renderQurbaniItem = ({ item }: { item: Qurbani }) => (
    <QurbaniCard qurbani={item} />
  );

  const renderCategorySection = ({ item, section }: { item: Qurbani[], section: { title: string } }) => (
    <FlatList
      horizontal
      data={item}
      renderItem={renderQurbaniItem}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalListContent}
    />
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.brand} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading Qurbani options...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} backgroundColor="transparent" translucent />
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        </View>
      ) : qurbanis.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            No Qurbani options available for booking
          </Text>
        </View>
      ) : (
        <SectionList
          sections={qurbanisByCategory}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>{title}</Text>
          )}
          renderItem={renderCategorySection}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <>
              <Text style={[styles.title, { color: theme.colors.text }]}>Book your Qurbani</Text>
              <GuideCard />
            </>
          }
          contentContainerStyle={styles.content}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
    padding: 16,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  horizontalListContent: {
    paddingBottom: 16,
  },
});

export default QurbaniBookingScreen;