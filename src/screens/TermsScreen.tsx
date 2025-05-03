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

const TermsScreen = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Terms & Conditions</Text>
          
          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Acceptance of Terms
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              By accessing and using Alif Cattle & Goat Farm's services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Order & Delivery
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              All orders are subject to product availability and confirmation. Delivery times are estimates and may vary based on location and circumstances. We reserve the right to refuse service to anyone.
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Payment Terms
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              Prices are subject to change without notice. Payment must be made in full at the time of order placement unless otherwise agreed upon in writing.
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Returns & Refunds
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              Due to the nature of our products, returns are only accepted in cases of damaged or incorrect items. Claims must be made within 24 hours of delivery.
            </Text>
          </View>

          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Updates to Terms
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              We reserve the right to modify these terms at any time. Continued use of our services after changes constitutes acceptance of new terms.
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

export default TermsScreen;