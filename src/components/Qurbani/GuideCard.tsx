// src/components/qurbani/GuideCard.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  Animated,
  ListRenderItem,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Fontisto from '@expo/vector-icons/Fontisto';

// Wrap FlatList with Animated.createAnimatedComponent for native animations
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

// Define step type for type safety
interface Step {
  id: number;
  title: string;
  description: string;
  icon: {
    type: 'ionicons' | 'fontisto';
    name: string;
  };
  uniqueKey?: string; // Optional uniqueKey for the infinite steps
}

const GuideCard = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.75; // Card width for better readability
  const flatListRef = useRef<FlatList<Step>>(null); // Explicitly type FlatList ref with Step
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollOffset = useRef(new Animated.Value(0)).current;

  // Define steps with updated knife icon for step 3
  const steps: Step[] = [
    {
      id: 1,
      title: 'Choose Your Qurbani Package',
      description: 'Select the perfect Qurbani package that suits your needs.',
      icon: { type: 'ionicons', name: 'paw-outline' },
    },
    {
      id: 2,
      title: 'Choose a Payment Method',
      description: 'Securely pay for your Qurbani with your preferred option.',
      icon: { type: 'ionicons', name: 'card-outline' },
    },
    {
      id: 3,
      title: 'We Perform Qurbani for You',
      description: 'Our experts will perform the Qurbani as per Islamic traditions.',
      icon: { type: 'fontisto', name: 'surgical-knife' },
    },
    {
      id: 4,
      title: 'Meat Distribution',
      description: 'The meat will be distributed to those in need and charities.',
      icon: { type: 'ionicons', name: 'gift-outline' },
    },
  ];

  // Duplicate steps for infinite scrolling, ensuring unique keys
  const infiniteSteps: Step[] = [...steps, ...steps, ...steps].map((item, index) => ({
    ...item,
    uniqueKey: `${item.id}-${index}`, // Add a unique key for each duplicated item
  }));
  const totalWidth = cardWidth * infiniteSteps.length;

  // Smooth continuous auto-scroll with seamless loop
  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scrollOffset, {
        toValue: totalWidth,
        duration: totalWidth * 13, // Speed: 13ms per pixel
        useNativeDriver: true,
      })
    );

    const subscription = scrollOffset.addListener(({ value }) => {
      const normalizedOffset = value % totalWidth; // Seamless loop using modulo
      flatListRef.current?.scrollToOffset({ offset: normalizedOffset, animated: false });
      scrollX.setValue(normalizedOffset); // Sync scrollX for animations
    });

    animation.start();

    return () => {
      animation.stop();
      scrollOffset.removeListener(subscription);
    };
  }, [cardWidth]);

  // Handle scroll event for pagination dots
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true }
  );

  // Render each step card with explicit Step type
  const renderStep: ListRenderItem<Step> = ({ item }) => {
    return (
      <View
        style={[
          styles.stepCard,
          { width: cardWidth },
          { backgroundColor: theme.colors.card },
        ]}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: theme.colors.primaryLight },
          ]}
        >
          {item.icon.type === 'fontisto' ? (
            <Fontisto
              name={item.icon.name as any}
              size={24}
              color={theme.colors.primary}
            />
          ) : (
            <Ionicons
              name={item.icon.name as any}
              size={24}
              color={theme.colors.primary}
            />
          )}
        </View>
        <Text
          style={[styles.stepTitle, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text
          style={[styles.stepDescription, { color: theme.colors.textSecondary }]}
          numberOfLines={3}
        >
          {item.description}
        </Text>
      </View>
    );
  };

  // Pagination dots
  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {steps.map((_, index) => {
          const dotScale = scrollX.interpolate({
            inputRange: [
              (index - 1) * cardWidth,
              index * cardWidth,
              (index + 1) * cardWidth,
            ],
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * cardWidth,
              index * cardWidth,
              (index + 1) * cardWidth,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [{ scale: dotScale }],
                  opacity: dotOpacity,
                  backgroundColor: theme.colors.primary,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

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

      <AnimatedFlatList
        ref={flatListRef}
        data={infiniteSteps}
        renderItem={renderStep}
        keyExtractor={(item) => item.uniqueKey || `${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stepsContainer}
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: cardWidth,
          offset: cardWidth * index,
          index,
        })}
      />

      {renderPagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    marginLeft: 16,
    textAlign: 'left',
  },
  stepsContainer: {
    paddingHorizontal: 16,
  },
  stepCard: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 8,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'left',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default GuideCard;