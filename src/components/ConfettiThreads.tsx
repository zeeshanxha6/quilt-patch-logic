import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {SCREEN_H, SCREEN_W} from '../constants/config';
import theme from '../constants/theme';

const COUNT = 14;

/** Falling thread snippets on a win — transform + opacity only. */
export default function ConfettiThreads({active}: {active: boolean}) {
  const progress = useRef(
    Array.from({length: COUNT}, () => new Animated.Value(0)),
  ).current;

  const seeds = useMemo(
    () =>
      Array.from({length: COUNT}, (_, i) => ({
        x: ((i * 97) % 100) / 100,
        delay: (i % 7) * 110,
        tilt: i % 2 === 0 ? 1 : -1,
        color: i % 3 === 0 ? theme.colors.primaryLight : theme.colors.accent,
      })),
    [],
  );

  useEffect(() => {
    if (!active) {
      return;
    }
    const animations = progress.map((value, i) =>
      Animated.timing(value, {
        toValue: 1,
        duration: 1400 + (i % 5) * 180,
        delay: seeds[i].delay,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    const loop = Animated.loop(Animated.parallel(animations));
    loop.start();
    return () => loop.stop();
  }, [active, progress, seeds]);

  if (!active) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {seeds.map((seed, i) => {
        const translateY = progress[i].interpolate({
          inputRange: [0, 1],
          outputRange: [-40, SCREEN_H * 0.8],
        });
        const rotate = progress[i].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${seed.tilt * 220}deg`],
        });
        const opacity = progress[i].interpolate({
          inputRange: [0, 0.12, 0.75, 1],
          outputRange: [0, 0.95, 0.85, 0],
        });
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={[
              styles.thread,
              {
                left: 12 + seed.x * (SCREEN_W - 32),
                backgroundColor: seed.color,
                opacity,
                transform: [{translateY}, {rotate}],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  thread: {
    position: 'absolute',
    top: 0,
    width: 3,
    height: 12,
    borderRadius: 2,
  },
});
