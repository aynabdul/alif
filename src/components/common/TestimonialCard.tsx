import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  review: string;
  image: string;
  rating?: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { theme } = useTheme();
  const rating = testimonial.rating || 5; 
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.cardBackground,
          borderColor: theme.colors.border,
        }
      ]}
    >
      <View style={styles.header}>
        <Image 
          source={{ uri: testimonial.image }} 
          style={styles.avatar}
          defaultSource={require('../../../assets/default-avatar.png')} // Fallback image
        />
        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {testimonial.name}
          </Text>
          <Text style={[styles.location, { color: theme.colors.textSecondary }]}>
            {testimonial.location}
          </Text>
          <View style={styles.starsContainer}>
            {Array(5).fill(0).map((_, i) => (
              <Ionicons 
                key={i}
                name={i < rating ? "star" : "star-outline"} 
                size={16} 
                color={i < rating ? theme.colors.brand : theme.colors.textSecondary} 
                style={styles.star}
              />
            ))}
          </View>
        </View>
      </View>
      
      <Text style={[styles.review, { color: theme.colors.text }]}>
        "{testimonial.review}"
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 280,
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  review: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});

export default TestimonialCard; 