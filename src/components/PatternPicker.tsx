import React, {useCallback} from 'react';
import {Animated, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Eraser} from 'lucide-react-native';
import {PATTERNS} from '../constants/patterns';
import {CONTROLS_INNER_W} from '../constants/config';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const GAP = 8;

function Swatch({
  id,
  width,
  selected,
  onSelect,
  placed,
  needed,
}: {
  id: number;
  width: number;
  selected: boolean;
  onSelect: (id: number) => void;
  placed: number;
  needed: number;
}) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.93);
  const handlePress = useCallback(() => onSelect(id), [id, onSelect]);
  const def = id > 0 ? PATTERNS[id - 1] : null;
  const art = Math.round(width * 0.62);
  const done = needed > 0 && placed === needed;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={def ? def.short : 'ERASER'}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={[styles.press, {width, height: 86}]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.column, {transform: [{scale}]}]}>
        <View
          style={[
            styles.swatch,
            {
              width,
              height: width,
              backgroundColor: def ? def.tintBg : 'rgba(240,236,233,0.07)',
              borderColor: selected ? theme.colors.accent : 'transparent',
            },
            selected ? theme.shadows.accent : null,
          ]}>
          {def ? (
            <Image
              source={def.sprite}
              style={{width: art, height: art}}
              resizeMode="contain"
            />
          ) : (
            <Eraser size={26} color={theme.colors.text.secondary} strokeWidth={2} />
          )}
        </View>
        <Text
          style={[
            styles.counter,
            {color: done ? theme.colors.accent : theme.colors.text.secondary},
          ]}
          numberOfLines={1}>
          {def ? `${placed}/${needed}` : 'CLEAR'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export default function PatternPicker({
  patternCount,
  selected,
  placed,
  needed,
  onSelect,
}: {
  patternCount: number;
  selected: number;
  placed: number[];
  needed: number[];
  onSelect: (id: number) => void;
}) {
  const count = patternCount + 1;
  const width = Math.min(
    60,
    Math.floor((CONTROLS_INNER_W - GAP * (count - 1)) / count),
  );

  const ids: number[] = [];
  for (let p = 1; p <= patternCount; p++) {
    ids.push(p);
  }
  ids.push(0);

  return (
    <View style={styles.row}>
      {ids.map(id => (
        <Swatch
          key={id}
          id={id}
          width={width}
          selected={selected === id}
          onSelect={onSelect}
          placed={placed[id] ?? 0}
          needed={needed[id] ?? 0}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: GAP,
  },
  press: {
    alignItems: 'center',
  },
  column: {
    alignItems: 'center',
  },
  swatch: {
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    fontVariant: ['tabular-nums'],
  },
});
