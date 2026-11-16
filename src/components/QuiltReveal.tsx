import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, View} from 'react-native';
import {patternById} from '../constants/patterns';
import theme from '../constants/theme';
import type {Grid} from '../game/generator';
import {REVEAL_CARD} from '../constants/config';

const CARD = REVEAL_CARD;
const INNER = CARD - 24;

/**
 * The finished quilt, revealed patch by patch. One shared Animated.Value
 * drives every cell through interpolation — native driver, transform+opacity
 * only, so an 81-cell reveal still costs a single JS animation.
 */
export default function QuiltReveal({grid}: {grid: Grid}) {
  const progress = useRef(new Animated.Value(0)).current;
  const size = grid.length;
  const count = size * size;
  const tile = Math.floor(INNER / size);
  const art = Math.max(6, tile - 5);

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: Math.min(1600, count * 26 + 400),
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [count, progress]);

  return (
    <View style={styles.card}>
      <View style={{width: tile * size, height: tile * size}}>
        {grid.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((p, c) => {
              const index = r * size + c;
              const from = index / count;
              const to = Math.min(1, from + 1 / count);
              const opacity = progress.interpolate({
                inputRange: [0, from, to, 1],
                outputRange: [0, 0, 1, 1],
              });
              const scale = progress.interpolate({
                inputRange: [0, from, to, 1],
                outputRange: [0.6, 0.6, 1, 1],
              });
              const def = p > 0 ? patternById(p) : null;
              return (
                <Animated.View
                  key={c}
                  pointerEvents="none"
                  style={[
                    styles.cell,
                    {
                      width: tile,
                      height: tile,
                      opacity,
                      transform: [{scale}],
                    },
                  ]}>
                  <View
                    style={[
                      styles.patch,
                      {
                        width: tile - 2,
                        height: tile - 2,
                        backgroundColor: def
                          ? def.tintBg
                          : 'rgba(240,236,233,0.05)',
                      },
                    ]}>
                    {def ? (
                      <Image
                        source={def.sprite}
                        style={{width: art, height: art}}
                        resizeMode="contain"
                      />
                    ) : null}
                  </View>
                </Animated.View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD,
    height: CARD,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: theme.colors.bg.border,
    backgroundColor: theme.colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 12},
    elevation: 16,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  patch: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
