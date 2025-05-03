import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../theme/ThemeContext';

const PrivacyPolicyScreen = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Privacy Policy</Text>
          
          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Information We Collect
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              We collect information that you provide directly to us, including your name, email address, phone number, and delivery address when you create an account or place an order.
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              How We Use Your Information
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              We use the information we collect to process your orders, communicate with you about your orders, and provide customer support. We may also use your information to send you marketing communications about our products and services.
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Data Security
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              We implement appropriate security measures to protect your personal information. However, please note that no method of transmission over the internet is 100% secure.
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Contact Us
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              If you have any questions about our Privacy Policy, please contact us at privacy@alifcattle.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default PrivacyPolicyScreen;