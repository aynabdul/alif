import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface CircularLoaderProps {
  color: string;
  opacity?: number;
  size?: number;
}

const CircularLoader: React.FC<CircularLoaderProps> = ({ 
  color, 
  opacity = 0.6,
  size = 40 
}) => {
  const rotateAnim = new Animated.Value(0);
  const bars = Array(8).fill(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ rotate: spin }] }]}>
      {bars.map((_, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              backgroundColor: color,
              opacity,
              transform: [
                { rotate: `${(index * 360) / 8}deg` },
                { translateY: -size / 2 },
              ],
            },
          ]}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 35,
    height: 35,
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    width: 4,
    height: 12,
    borderRadius: 2,
    left: '50%',
    top: '50%',
    marginLeft: -2,
    marginTop: -6,
  },
});

export default CircularLoader; 