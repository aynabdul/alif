import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 60; 

const AboutScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + insets.bottom }}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>About Us</Text>

          {/* Our Story Section */}
          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Image
              source={require('../../assets/Logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Our Story</Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              At Alif Cattle & Goat Farm, we are committed to providing fresh, high-quality meat sourced from
              healthy, well-raised stock. Our journey began with a simple mission—to bring farm-fresh
              chicken, mutton, and beef directly to your table with guaranteed freshness and hygiene.
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              Years of experience in livestock farming, we ensure that every cut meets the highest
              standards of quality. From farm to fork, we prioritize ethical practices, cleanliness, and customer
              satisfaction. Whether you’re buying for your home or for premium cuts, we take pride in delivering
              meat that you can trust.
            </Text>
            <Text style={[styles.paragraph, { color: theme.colors.textSecondary }]}>
              Join us in our mission to serve fresh, healthy, and delicious meat—because quality matters!
            </Text>
          </View>

          {/* Why Choose Us Section */}
          <View style={[styles.section, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Why Choose Us?</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary, marginBottom: 24 }]}>
              Our passionate team ensures top-quality meat and excellent service, bringing freshness straight to you!
            </Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <Ionicons name="leaf-outline" size={24} color={theme.colors.brand} />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>100% Organic Meat</Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    Healthy & Fresh
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <Ionicons name="headset-outline" size={24} color={theme.colors.brand} />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Great Support 24/7</Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    Instant Access to Contact
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <Ionicons name="star-outline" size={24} color={theme.colors.brand} />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Customer Feedback</Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    Our Happy Customers
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.brand} />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Secure Payment</Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    Buying Meat is Safe
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View style={styles.featureItem}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <Ionicons name="car-outline" size={24} color={theme.colors.brand} />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>Free Shipping</Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    Free Shipping Discount
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                    <Ionicons name="leaf-outline" size={24} color={theme.colors.brand} />
                  </View>
                  <Text style={[styles.featureTitle, { color: theme.colors.text }]}>100% Organic Meat</Text>
                  <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                    Healthy & Fresh Meat
                  </Text>
                </View>
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
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresContainer: {
    marginTop: 16,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  featureItem: {
    width: '48%', // Two items per row with some spacing
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AboutScreen;