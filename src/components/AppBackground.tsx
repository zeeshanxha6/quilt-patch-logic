import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle, Defs, Path, RadialGradient, Stop} from 'react-native-svg';
import {assets} from '../assets';
import {SCREEN_H, SCREEN_W} from '../constants/config';
import theme from '../constants/theme';

export type BackgroundVariant = 'loader' | 'menu' | 'game' | 'result';

const OVERLAYS: Record<BackgroundVariant, string[]> = {
  loader: [...theme.gradients.loader],
  menu: [...theme.gradients.menu],
  game: [...theme.gradients.game],
  result: [...theme.gradients.result],
};

const LOCATIONS: Record<BackgroundVariant, number[]> = {
  loader: [0, 0.5, 1],
  menu: [0, 0.52, 1],
  game: [0, 0.5, 1],
  result: [0, 0.5, 1],
};

/** Thread strokes — the skeuomorphic "loose sewing thread" decor layer. */
function ThreadDecor({variant}: {variant: BackgroundVariant}) {
  const strong = variant === 'loader';
  return (
    <Svg
      width={SCREEN_W}
      height={SCREEN_H}
      style={StyleSheet.absoluteFill}
      pointerEvents="none">
      <Defs>
        <RadialGradient id="glow" cx="50%" cy="42%" r="55%">
          <Stop
            offset="0%"
            stopColor={theme.colors.primary}
            stopOpacity={strong ? 0.22 : 0.14}
          />
          <Stop offset="100%" stopColor={theme.colors.primary} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Circle cx={SCREEN_W / 2} cy={SCREEN_H * 0.42} r={SCREEN_W * 0.62} fill="url(#glow)" />
      <Path
        d={`M -20 ${SCREEN_H * 0.2} Q ${SCREEN_W * 0.45} ${SCREEN_H * 0.1} ${SCREEN_W + 20} ${SCREEN_H * 0.26}`}
        stroke={theme.colors.accent}
        strokeOpacity={strong ? 0.2 : 0.1}
        strokeWidth={2}
        strokeDasharray="9 7"
        fill="none"
      />
      <Path
        d={`M -20 ${SCREEN_H * 0.68} Q ${SCREEN_W * 0.5} ${SCREEN_H * 0.8} ${SCREEN_W + 20} ${SCREEN_H * 0.62}`}
        stroke={theme.colors.primaryLight}
        strokeOpacity={strong ? 0.18 : 0.09}
        strokeWidth={2}
        strokeDasharray="7 6"
        fill="none"
      />
      <Path
        d={`M ${SCREEN_W * 0.12} -20 Q ${SCREEN_W * 0.3} ${SCREEN_H * 0.5} ${SCREEN_W * 0.08} ${SCREEN_H + 20}`}
        stroke={theme.colors.oliveLight}
        strokeOpacity={strong ? 0.14 : 0.07}
        strokeWidth={2}
        strokeDasharray="5 8"
        fill="none"
      />
    </Svg>
  );
}

export default function AppBackground({
  variant,
  children,
}: {
  variant: BackgroundVariant;
  children: React.ReactNode;
}) {
  return (
    <ImageBackground
      source={assets.bg}
      style={styles.root}
      imageStyle={styles.image}
      resizeMode="cover">
      <LinearGradient
        colors={OVERLAYS[variant]}
        locations={LOCATIONS[variant]}
        style={StyleSheet.absoluteFill}
      />
      <ThreadDecor variant={variant} />
      <View style={styles.content}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.deep,
  },
  image: {
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
  },
});
