// src/screens/ContactScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const ContactScreen = () => {
  const { theme, country } = useTheme();

  // Determine contact details based on country
  const isPakistan = country === 'PAK';
  const phoneNumber = isPakistan ? '0305-2023333' : '(888)321-ALIF';
  const locationAddress = isPakistan ? 'A&T Farms and Goat Farms' : '124 Mahoning Dr E, Lehighton, PA 18235';
  const googleMapsUrl = isPakistan
    ? 'https://www.google.com/maps/place/A%26T+farms+and+Goat+farms/@31.502411,74.492748,16z/data=!4m6!3m5!1s0x39190fe2f1a72309:0xfe835f57a2fd9ac3!8m2!3d31.502411!4d74.492748!16s%2Fg%2F11rb5hxgs9?hl=en&entry=ttu&g_ep=EgoyMDI1MDUwNy4wIKXMDSoASAFQAw%3D%3D'
    : 'https://www.google.com/maps/place/124+Mahoning+Dr+E,+Lehighton,+PA+18235,+USA/@40.8233944,-75.7330596,13z/data=!4m6!3m5!1s0x89c5b326cc4983fd:0xb57848c20b8a849e!8m2!3d40.8274891!4d-75.7310466!16s%2Fg%2F11bw43x7wn?hl=en&entry=ttu&g_ep=EgoyMDI1MDUwNy4wIKXMDSoASAFQAw%3D%3D';

  const handlePhonePress = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:admin@aliffarms.com');
  };

  const handleLocationPress = () => {
    if (Platform.OS === 'web') {
      // On web, open the Google Maps URL directly
      Linking.openURL(googleMapsUrl);
    } else {
      // On mobile, use the native maps URI scheme
      const address = Platform.select({
        ios: `maps:0,0?q=${encodeURIComponent(locationAddress)}`,
        android: `geo:0,0?q=${encodeURIComponent(locationAddress)}`,
      });
      Linking.openURL(address || '');
    }
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.aliffarms.com');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Contact Us</Text>
          
          <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.contactMethod}>
              <TouchableOpacity style={styles.contactButton} onPress={handlePhonePress}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.brand + '20' }]}>
                  <Ionicons name="call-outline" size={24} color={theme.colors.brand} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactLabel, { color: theme.colors.textSecondary }]}>Phone Number</Text>
                  <Text style={[styles.contactValue, { color: theme.colors.text }]}>{phoneNumber}</Text>
                  <Text style={[styles.contactHint, { color: theme.colors.textSecondary }]}>Tap to call</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <View style={styles.contactMethod}>
              <TouchableOpacity style={styles.contactButton} onPress={handleEmailPress}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.brand + '20' }]}>
                  <Ionicons name="mail-outline" size={24} color={theme.colors.brand} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactLabel, { color: theme.colors.textSecondary }]}>Email Address</Text>
                  <Text style={[styles.contactValue, { color: theme.colors.text }]}>admin@aliffarms.com</Text>
                  <Text style={[styles.contactHint, { color: theme.colors.textSecondary }]}>Tap to send email</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <View style={styles.contactMethod}>
              <TouchableOpacity style={styles.contactButton} onPress={handleLocationPress}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.brand + '20' }]}>
                  <Ionicons name="location-outline" size={24} color={theme.colors.brand} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactLabel, { color: theme.colors.textSecondary }]}>Location</Text>
                  <Text style={[styles.contactValue, { color: theme.colors.text }]}>{locationAddress}</Text>
                  <Text style={[styles.contactHint, { color: theme.colors.textSecondary }]}>Tap to view map</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            <View style={styles.contactMethod}>
              <TouchableOpacity style={styles.contactButton} onPress={handleWebsitePress}>
                <View style={[styles.iconContainer, { backgroundColor: theme.colors.brand + '20' }]}>
                  <Ionicons name="globe-outline" size={24} color={theme.colors.brand} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactLabel, { color: theme.colors.textSecondary }]}>Website</Text>
                  <Text style={[styles.contactValue, { color: theme.colors.text }]}>www.aliffarms.com</Text>
                  <Text style={[styles.contactHint, { color: theme.colors.textSecondary }]}>Tap to visit</Text>
                </View>
              </TouchableOpacity>
            </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactMethod: {
    marginVertical: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactHint: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    marginVertical: 16,
    opacity: 0.1,
  },
});

export default ContactScreen;