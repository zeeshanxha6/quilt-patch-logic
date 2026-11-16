import React from 'react';
import {Animated, Image, ImageBackground, Pressable, StyleSheet} from 'react-native';
import theme from '../constants/theme';
import {assets} from '../assets';
import usePressScale from '../hooks/usePressScale';

const HIT = {top: 8, bottom: 8, left: 8, right: 8};

/**
 * 48x48 round chrome button on the skeuomorphic brass plate
 * (button_round.png from the asset contract) with a 24x24 glyph on top.
 */
export default function RoundIconButton({
  source,
  onPress,
  label,
}: {
  source: number;
  onPress: () => void;
  label: string;
}) {
  const {scale, onPressIn, onPressOut} = usePressScale(0.92);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      style={styles.press}>
      <Animated.View
        pointerEvents="none"
        style={[styles.fill, {transform: [{scale}]}]}>
        <ImageBackground
          source={assets.buttonRound}
          style={styles.plate}
          imageStyle={styles.plateImage}
          resizeMode="contain">
          <Image source={source} style={styles.glyph} resizeMode="contain" />
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  fill: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.glass,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  plate: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateImage: {
    opacity: 0.55,
  },
  glyph: {
    width: 24,
    height: 24,
  },
});
