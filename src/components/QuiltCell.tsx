import React, {useCallback, useEffect, useRef} from 'react';
import {Animated, Image, Pressable, StyleSheet, View} from 'react-native';
import Svg, {Line} from 'react-native-svg';
import {patternById} from '../constants/patterns';
import theme from '../constants/theme';

const HIT = {top: 2, bottom: 2, left: 2, right: 2};

/** Faint gingham weave on an empty patch — the fabric material cue. */
function Gingham({size}: {size: number}) {
  return (
    <Svg width={size} height={size} pointerEvents="none">
      <Line
        x1={size * 0.25}
        y1={0}
        x2={size * 0.25}
        y2={size}
        stroke={theme.colors.text.muted}
        strokeOpacity={0.16}
        strokeWidth={1}
      />
      <Line
        x1={size * 0.75}
        y1={0}
        x2={size * 0.75}
        y2={size}
        stroke={theme.colors.text.muted}
        strokeOpacity={0.16}
        strokeWidth={1}
      />
      <Line
        x1={0}
        y1={size * 0.25}
        x2={size}
        y2={size * 0.25}
        stroke={theme.colors.text.muted}
        strokeOpacity={0.16}
        strokeWidth={1}
      />
      <Line
        x1={0}
        y1={size * 0.75}
        x2={size}
        y2={size * 0.75}
        stroke={theme.colors.text.muted}
        strokeOpacity={0.16}
        strokeWidth={1}
      />
    </Svg>
  );
}

function QuiltCell({
  row,
  col,
  pattern,
  tile,
  isError,
  inValidLine,
  onPress,
}: {
  row: number;
  col: number;
  pattern: number;
  tile: number;
  isError: boolean;
  inValidLine: boolean;
  onPress: (row: number, col: number) => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const prev = useRef(pattern);

  useEffect(() => {
    if (prev.current === pattern) {
      return;
    }
    prev.current = pattern;
    if (pattern === 0) {
      return;
    }
    scale.setValue(0.7);
    Animated.spring(scale, {
      toValue: 1,
      tension: 160,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [pattern, scale]);

  const handlePress = useCallback(() => onPress(row, col), [onPress, row, col]);

  const def = pattern ? patternById(pattern) : null;
  const inner = tile - 6;
  const art = tile - 12;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`patch ${row + 1} ${col + 1}`}
      onPress={handlePress}
      hitSlop={HIT}
      style={[styles.cell, {width: tile, height: tile}]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.inner,
          {
            width: inner,
            height: inner,
            transform: [{scale}],
            backgroundColor: def ? def.tintBg : 'rgba(240,236,233,0.04)',
            borderColor: isError
              ? theme.colors.primaryLight
              : inValidLine
              ? 'rgba(40,224,109,0.55)'
              : 'rgba(240,236,233,0.10)',
            borderWidth: isError ? 2 : 1,
          },
        ]}>
        {def ? (
          <Image
            source={def.sprite}
            style={{width: art, height: art}}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.gingham}>
            <Gingham size={inner} />
          </View>
        )}
        {isError ? <View style={styles.errorWash} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gingham: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(217,123,77,0.16)',
  },
});

export default React.memo(QuiltCell);
