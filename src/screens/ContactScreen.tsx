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
  const { theme } = useTheme();

  const handlePhonePress = () => {
    Linking.openURL('tel:+1888321ALIF');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:contact@alifcattle.com');
  };

  const handleLocationPress = () => {
    const address = Platform.select({
      ios: 'maps:0,0?q=Alif+Cattle+%26+Goat+Farm',
      android: 'geo:0,0?q=Alif+Cattle+%26+Goat+Farm',
    });
    Linking.openURL(address || '');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.alifcattle.com');
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
                  <Text style={[styles.contactValue, { color: theme.colors.text }]}>+1 888 321 ALIF</Text>
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
                  <Text style={[styles.contactValue, { color: theme.colors.text }]}>contact@alifcattle.com</Text>
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
                  <Text style={[styles.contactValue, { color: theme.colors.text }]}>123 Farm Road, Rural County</Text>
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
                  <Text style={[styles.contactValue, { color: theme.colors.text }]}>www.alifcattle.com</Text>
                  <Text style={[styles.contactHint, { color: theme.colors.textSecondary }]}>Tap to visit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Business Hours</Text>
            <View style={styles.businessHours}>
              <View style={styles.dayRow}>
                <Text style={[styles.day, { color: theme.colors.textSecondary }]}>Monday - Friday</Text>
                <Text style={[styles.hours, { color: theme.colors.text }]}>9:00 AM - 6:00 PM</Text>
              </View>
              <View style={styles.dayRow}>
                <Text style={[styles.day, { color: theme.colors.textSecondary }]}>Saturday</Text>
                <Text style={[styles.hours, { color: theme.colors.text }]}>10:00 AM - 4:00 PM</Text>
              </View>
              <View style={styles.dayRow}>
                <Text style={[styles.day, { color: theme.colors.textSecondary }]}>Sunday</Text>
                <Text style={[styles.hours, { color: theme.colors.text }]}>Closed</Text>
              </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  businessHours: {
    gap: 12,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  day: {
    fontSize: 14,
  },
  hours: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ContactScreen;