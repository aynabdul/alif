import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import TestimonialCard from '../common/TestimonialCard';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  review: string;
  image: string;
  rating?: number;
}

// Sample testimonials data
const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Raza",
    location: "Lahore, Pakistan",
    review: "Alif Cattle & Goat Farm made my Qurbani effortless! The meat was fresh, hygienic, and delivered right on time. Truly reliable and stress-free service!",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5
  },
  {
    id: 2,
    name: "Fatima Khan",
    location: "Karachi, Pakistan",
    review: "I was amazed by the quality of the beef and mutton! Tender, flavorful, and perfectly cut. Highly recommended for anyone looking for fresh, Halal meat in Pakistan!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5
  },
  {
    id: 3,
    name: "Bilal Siddique",
    location: "Islamabad, Pakistan",
    review: "Their service exceeded my expectations! Clean packaging, premium quality, and prompt delivery. Alif has become my go-to for fresh meat!",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5
  },
];

const TestimonialsSection = () => {
  const { theme } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Our Satisfied Customers
      </Text>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={TESTIMONIALS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TestimonialCard testimonial={item} />}
        contentContainerStyle={styles.testimonialsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  testimonialsList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default TestimonialsSection; 