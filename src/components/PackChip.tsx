import React, {useCallback} from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {Lock} from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

const HIT = {top: 8, bottom: 8, left: 4, right: 4};

export default function PackChip({
  id,
  label,
  width,
  active,
  locked,
  onPress,
}: {
  id: number;
  label: string;
  width: number;
  active: boolean;
  locked: boolean;
  onPress: (id: number) => void;
}) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.94);
  const handlePress = useCallback(() => onPress(id), [id, onPress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{selected: active}}
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={[styles.press, {width, height: 48}]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          {
            transform: [{scale}],
            backgroundColor: active
              ? 'rgba(40,224,109,0.14)'
              : 'rgba(240,236,233,0.06)',
            borderColor: active ? theme.colors.accent : theme.colors.glassBorder,
            opacity: locked ? 0.55 : 1,
          },
        ]}>
        {locked ? (
          <Lock size={14} color={theme.colors.text.muted} strokeWidth={2.2} />
        ) : (
          <Text
            style={[
              styles.label,
              {
                color: active
                  ? theme.colors.text.primary
                  : theme.colors.text.secondary,
              },
            ]}
            numberOfLines={1}>
            {label}
          </Text>
        )}
        {active ? <View style={styles.dot} /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: 14,
  },
  fill: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  dot: {
    marginTop: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
  },
});
