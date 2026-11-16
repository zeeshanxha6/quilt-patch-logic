import {useCallback, useRef} from 'react';
import {Animated} from 'react-native';

/**
 * The one correct press-feedback implementation for this stack (rule #8):
 * the <Pressable> is the PARENT and drives an Animated.spring on
 * transform:scale — native driver, transform only.
 */
export function usePressScale(to: number = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: 300,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return {scale, onPressIn, onPressOut};
}

export default usePressScale;
