// src/screens/TestimonialsSection.tsx
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

const testimonialsPak: Testimonial[] = [
  {
    id: 1,
    name: "Ahmed Raza",
    location: "Lahore, Pakistan",
    review:
      "Alif Cattle & Goat Farm made my Qurbani effortless! The meat was fresh, hygienic, and delivered right on time. Truly reliable and stress-free service!",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Fatima Khan",
    location: "Karachi, Pakistan",
    review:
      "I was amazed by the quality of the beef and mutton! Tender, flavorful, and perfectly cut. Highly recommended for anyone looking for fresh, Halal meat in Pakistan!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Bilal Siddique",
    location: "Islamabad, Pakistan",
    review:
      "Their service exceeded my expectations! Clean packaging, premium quality, and prompt delivery. Alif has become my go-to for fresh meat!",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5,
  },
];

const testimonialsUSA: Testimonial[] = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Allentown, PA",
    review:
      "I recently purchased from Alif Farms, and it was exceptional! The meat was fresh and high quality. Highly recommend!",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
  },
  {
    id: 2,
    name: "Jamal K.",
    location: "Bethlehem, PA",
    review:
      "Alif Farms provides for our restaurant, and the process is seamless. The staff was professional, and the meat was of top quality. It's great to have a trustworthy halal source.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
  },
  {
    id: 3,
    name: "Aisha R.",
    location: "Easton, PA",
    review:
      "I visited Alif Farms to buy some chickens, and I was impressed by the cleanliness and the care they put into their animals. The taste difference is noticeable. Will definitely be returning!",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 5,
  },
  {
    id: 4,
    name: "Omar L.",
    location: "Scranton, PA",
    review:
      "Alif Farms always exceeds our expectations. The meat is fresh, and the service is outstanding. They truly understand the importance of halal practices.",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
  },
  {
    id: 5,
    name: "Fatima S.",
    location: "Reading, PA",
    review:
      "Alif Farms is my go-to for halal meat. Their commitment to ethical farming and quality is evident in every purchase. The staff is friendly and knowledgeable. Highly recommended!",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const { theme, country } = useTheme();
  
  // Select testimonials based on country
  const testimonials = country === 'PAK' ? testimonialsPak : testimonialsUSA;

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Our Satisfied Customers
      </Text>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={testimonials}
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