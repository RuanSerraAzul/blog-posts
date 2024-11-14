import { useRef } from 'react';
import { Animated } from 'react-native';

export const useAnimation = (initialValue = 0) => {
  const animatedValue = useRef(new Animated.Value(initialValue)).current;

  const animate = (toValue: number, speed = 200, useNativeDriver = true) => {
    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver,
      damping: 20,
      stiffness: 90,
      mass: 0.5,
      velocity: 0.5
    }).start();
  };

  return { animatedValue, animate };
}; 