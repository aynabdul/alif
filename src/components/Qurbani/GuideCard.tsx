// src/components/qurbani/GuideCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const GuideCard = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.85;

  const steps = [
    {
      id: 1,
      title: 'Choose Your Qurbani Package',
      description: 'Select the perfect Qurbani package that suits your needs',
      icon: 'paw-outline' as any,
    },
    {
      id: 2,
      title: 'Choose a Payment Method',
      description: 'Securely pay for your Qurbani with your preferred payment option',
      icon: 'card-outline' as any,
    },
    {
      id: 3,
      title: 'We Will Do Qurbani on Your Behalf',
      description: 'Our experts will perform the Qurbani according to Islamic traditions',
      icon: 'cut-outline' as any,
    },
    {
      id: 4,
      title: 'Meat Distribution',
      description: 'The meat will be distributed to charitable organizations and those in need',
      icon: 'gift-outline' as any,
    },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        How It Works
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepsContainer}
      >
        {steps.map((step) => (
          <View
            key={step.id}
            style={[
              styles.stepCard,
              { 
                backgroundColor: theme.colors.card,
                width: cardWidth / 2 - 20,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: theme.colors.primaryLight },
              ]}
            >
              <Ionicons
                name={step.icon}
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.stepNumberContainer}>
              <Text
                style={[
                  styles.stepNumber,
                  { backgroundColor: theme.colors.primary, color: '#fff' },
                ]}
              >
                {step.id}
              </Text>
            </View>
            <Text
              style={[styles.stepTitle, { color: theme.colors.text }]}
              numberOfLines={2}
            >
              {step.title}
            </Text>
            <Text
              style={[
                styles.stepDescription,
                { color: theme.colors.textSecondary },
              ]}
              numberOfLines={3}
            >
              {step.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginLeft: 16,
  },
  stepsContainer: {
    paddingLeft: 16,
    paddingRight: 6,
  },
  stepCard: {
    padding: 16,
    borderRadius: 12,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: 180,
    position: 'relative',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumberContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export default GuideCard;