// src/screens/FAQsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const FAQsScreen = () => {
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | false>(0);

  const faqData = [
    {
      question: 'HOW MANY KGS OF MEAT WILL BE DELIVERED IN COW SHARE?',
      answer: '14-16 Kgs of meat will be delivered.',
    },
    {
      question: 'HOW MANY KGS OF MEAT WILL BE DELIVERED IN GOAT?',
      answer: '12-14 Kgs of meat will be delivered.',
    },
    {
      question: 'HOW MANY KGS OF MEAT WILL BE DELIVERED IN WHOLE COW?',
      answer: '100-120 Kgs of meat will be delivered.',
    },
    {
      question: 'DO YOU GUYS HAVE BULLS AND GOATS FOR SALE AS WELL?',
      answer: 'Yes, we have top quality breed Bulls and Goats available for sale, you can visit our farm in Lahore and also view the collection on our website.',
    },
    {
      question: 'WHAT TIME YOU WILL DELIVER THE MEAT ON EID DAY?',
      answer: 'We have two slots for delivery. 1st Slot is 12PM – 3 PM and 2nd Slot is 3PM – 5 PM. (Delivery is first book, first serve)',
    },
    {
      question: "WILL YOU DELIVER THE MEAT AT OUR DOOR AND HOW'S THE PACKING?",
      answer: 'Yes, we will deliver the meat at your doorstep, it will be properly packed by taking all the SOPs and temperature control measures.',
    },
    {
      question: "How do you manage donation meat? Do we get any sort of receipt?",
      answer: 'We have multiple Charity organizations on our panel, we deliver them the meat or their teams pick up the meat from our premises.',
    },
  ];

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? false : index);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Customer Questions</Text>

          {faqData.map((faq, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                style={styles.faqContainer}
                onPress={() => handleToggle(index)}
              >
                <View style={styles.faqHeader}>
                  <View style={styles.borderLeft} />
                  <Text
                    style={[
                      styles.question,
                      { color: expandedIndex === index ? '#ab3824' : theme.colors.text },
                    ]}
                  >
                    {faq.question}
                  </Text>
                  <Ionicons
                    name={expandedIndex === index ? 'remove-outline' : 'add-outline'}
                    size={24}
                    color={theme.colors.text}
                  />
                </View>
                {expandedIndex === index && (
                  <View style={styles.answerContainer}>
                    <Text style={[styles.answer, { color: theme.colors.textSecondary }]}>
                      {faq.answer}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            </React.Fragment>
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
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28, // Adjusted for mobile (web: 3xl/5xl)
    fontWeight: '500',
    marginBottom: 24,
    textTransform: 'uppercase',
  },
  faqContainer: {
    paddingLeft: 8,
    marginBottom: 16,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderLeft: {
    width: 4,
    height: '100%',
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  question: {
    flex: 1,
    fontSize: 16, // Adjusted for mobile (web: 18px)
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  answerContainer: {
    paddingVertical: 8,
    paddingLeft: 12,
  },
  answer: {
    fontSize: 14, // Adjusted for mobile (web: 16px)
    fontWeight: '400',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
});

export default FAQsScreen;