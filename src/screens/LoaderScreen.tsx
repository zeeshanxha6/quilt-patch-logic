import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Svg, {Circle} from 'react-native-svg';
import AppBackground from '../components/AppBackground';
import StitchSeam from '../components/StitchSeam';
import {assets} from '../assets';
import {
  LOADER_DURATION_MS,
  LOADER_FADE_MS,
  LOADER_PROGRESS_MS,
} from '../constants/config';
import theme from '../constants/theme';

const BAR_W = 212;
const RING = 220;
const GRAD_BAR = [theme.colors.primary, theme.colors.accent];

export default function LoaderScreen({onDone}: {onDone: () => void}) {
  const fade = useRef(new Animated.Value(1)).current;
  const plate = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;
  const bar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(plate, {
        toValue: 1,
        tension: 52,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(logoFade, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();

    /* width is the ONE allowed non-native-driver animation (rule #8). */
    Animated.timing(bar, {
      toValue: BAR_W,
      duration: LOADER_PROGRESS_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();

    const exit = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }).start(() => onDone());
    }, LOADER_DURATION_MS - LOADER_FADE_MS);

    return () => {
      clearTimeout(exit);
      loop.stop();
    };
  }, [bar, fade, logoFade, onDone, plate, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  const plateScale = plate.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1],
  });

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.root, {opacity: fade}]}>
      <AppBackground variant="loader">
        <View style={styles.center}>
          <View style={styles.spoolZone}>
            <Animated.View
              pointerEvents="none"
              style={[styles.ring, {transform: [{rotate}]}]}>
              <Svg width={RING} height={RING}>
                <Circle
                  cx={RING / 2}
                  cy={RING / 2}
                  r={RING / 2 - 4}
                  stroke={theme.colors.accent}
                  strokeOpacity={0.45}
                  strokeWidth={2}
                  strokeDasharray="10 14"
                  fill="none"
                />
              </Svg>
            </Animated.View>

            <Animated.View
              pointerEvents="none"
              style={[
                styles.plate,
                {opacity: plate, transform: [{scale: plateScale}]},
              ]}>
              <Animated.Image
                source={assets.logo}
                style={[styles.logo, {opacity: logoFade}]}
                resizeMode="contain"
              />
            </Animated.View>
          </View>

          <Text style={styles.titleTop}>QUILT PATCH</Text>
          <Text style={styles.titleBottom}>LOGIC</Text>
          <Text style={styles.tagline}>STITCH THE NUMBERS</Text>

          <View style={styles.barTrack}>
            <Animated.View
              pointerEvents="none"
              style={[styles.barFill, {width: bar}]}>
              <LinearGradient
                colors={GRAD_BAR}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.barGrad}
              />
            </Animated.View>
          </View>

          <View style={styles.barSeam}>
            <StitchSeam
              width={BAR_W}
              color="rgba(40,224,109,0.40)"
              thickness={1}
              dash="6 5"
            />
          </View>

          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </AppBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.deeper,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  spoolZone: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  ring: {
    position: 'absolute',
    width: RING,
    height: RING,
  },
  plate: {
    width: 176,
    height: 176,
    borderRadius: 88,
    backgroundColor: 'rgba(240,236,233,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(240,236,233,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 12},
    elevation: 14,
  },
  logo: {
    width: 148,
    height: 148,
  },
  titleTop: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 10,
    textShadowOffset: {width: 0, height: 3},
  },
  titleBottom: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    letterSpacing: 3,
    color: theme.colors.primary,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 10,
    textShadowOffset: {width: 0, height: 3},
  },
  tagline: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 4,
    color: theme.colors.text.secondary,
  },
  barTrack: {
    marginTop: 34,
    width: BAR_W,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(240,236,233,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(240,236,233,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    borderRadius: 2,
  },
  barGrad: {
    flex: 1,
    borderRadius: 2,
  },
  barSeam: {
    marginTop: 14,
    opacity: 0.9,
  },
  loading: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 3,
    color: theme.colors.text.muted,
  },
});
