import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type {LucideIcon} from 'lucide-react-native';
import theme from '../constants/theme';
import usePressScale from '../hooks/usePressScale';

export type ButtonIcon = LucideIcon;

const HIT = {top: 8, bottom: 8, left: 8, right: 8};
const GRAD_ACCENT = [...theme.gradients.accent];
const GRAD_TERRACOTTA = [...theme.gradients.terracotta];

/**
 * Rule #20 / button-icon centering: icon is ALWAYS 24x24 inside a fixed box,
 * the label's lineHeight is 24, the gap is 10, nothing is absolutely placed.
 * Pressable is the PARENT, the Animated.View lives inside it (rule #8).
 */
export default function PrimaryButton({
  label,
  Icon,
  onPress,
  width,
  height = 60,
  disabled = false,
  variant = 'accent',
}: {
  label: string;
  Icon?: ButtonIcon;
  onPress: () => void;
  width: number | '100%';
  height?: number;
  disabled?: boolean;
  variant?: 'accent' | 'terracotta';
}) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.96);
  const colors = variant === 'accent' ? GRAD_ACCENT : GRAD_TERRACOTTA;
  const labelColor =
    variant === 'accent' ? theme.colors.text.onAccent : theme.colors.text.primary;
  const shadow =
    variant === 'accent' ? theme.shadows.accent : theme.shadows.card;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{disabled}}
      disabled={disabled}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={[
        styles.press,
        shadow,
        {width, height, opacity: disabled ? 0.45 : 1},
      ]}>
      <Animated.View
        pointerEvents="none"
        style={[styles.fill, {transform: [{scale}]}]}>
        <LinearGradient
          colors={colors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.grad}>
          <View style={styles.row}>
            {Icon ? (
              <View style={styles.iconBox}>
                <Icon size={24} color={labelColor} strokeWidth={2.4} />
              </View>
            ) : null}
            <Text style={[styles.label, {color: labelColor}]} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    borderRadius: 18,
  },
  fill: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  grad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
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
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: 1.8,
  },
});
