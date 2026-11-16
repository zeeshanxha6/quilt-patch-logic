import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';
import type {ButtonIcon} from './PrimaryButton';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/** Same icon contract as PrimaryButton: 24x24 box, lineHeight 24, gap 10. */
export default function SecondaryButton({
  label,
  Icon,
  onPress,
  width,
  height = 48,
  tint = theme.colors.text.primary,
}: {
  label: string;
  Icon?: ButtonIcon;
  onPress: () => void;
  width: number | '100%';
  height?: number;
  tint?: string;
}) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.95);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={[styles.press, {width, height}]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.fill, {transform: [{scale}]}]}>
        <View style={styles.row}>
          {Icon ? (
            <View style={styles.iconBox}>
              <Icon size={24} color={tint} strokeWidth={2} />
            </View>
          ) : null}
          <Text style={[styles.label, {color: tint}]} numberOfLines={1}>
            {label}
          </Text>
        </View>
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
    backgroundColor: 'rgba(240,236,233,0.07)',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  iconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
