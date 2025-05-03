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

const FAQsScreen = () => {
  const { theme } = useTheme();

  const faqs = [
    {
      question: 'What is Halal meat?',
      answer: 'Halal meat comes from animals that have been processed according to Islamic law. This includes specific guidelines for humane slaughter and processing.'
    },
    {
      question: 'Do you deliver?',
      answer: 'Yes, we offer delivery services within our service areas in both the USA and Pakistan. Delivery fees and times vary by location.'
    },
    {
      question: 'How do I place an order?',
      answer: 'You can place orders through our mobile app or website. Simply select your products, add them to cart, and proceed to checkout.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, and digital payment methods. Cash on delivery is also available in select areas.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order is confirmed, you can track it through the "My Orders" section in your profile.'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Frequently Asked Questions</Text>
          
          {faqs.map((faq, index) => (
            <View 
              key={index} 
              style={[styles.faqCard, { backgroundColor: theme.colors.cardBackground }]}
            >
              <Text style={[styles.question, { color: theme.colors.text }]}>
                {faq.question}
              </Text>
              <Text style={[styles.answer, { color: theme.colors.textSecondary }]}>
                {faq.answer}
              </Text>
            </View>
          ))}
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
  faqCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FAQsScreen;