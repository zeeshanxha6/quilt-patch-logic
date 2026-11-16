import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {BookOpen, Disc, Layers, Scissors} from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import BottomSheet from '../components/BottomSheet';
import PackChip from '../components/PackChip';
import PrimaryButton from '../components/PrimaryButton';
import RoundIconButton from '../components/RoundIconButton';
import SecondaryButton from '../components/SecondaryButton';
import StitchSeam from '../components/StitchSeam';
import {assets} from '../assets';
import {
  CHIP_GAP,
  CHIP_W,
  PACKS,
  SCREEN_W,
  SECONDARY_BTN_W,
  SHEET_INNER_W,
  TOTAL_QUILTS,
} from '../constants/config';
import theme from '../constants/theme';
import type {Progress} from '../game/progress';
import {isPackUnlocked, totalSolved, unlockRemaining} from '../game/progress';

const GRAD_SHEET = [...theme.gradients.sheet];

export default function MenuScreen({
  progress,
  packIndex,
  onSelectPack,
  onPlay,
  onShelf,
  onRules,
  onReset,
}: {
  progress: Progress;
  packIndex: number;
  onSelectPack: (id: number) => void;
  onPlay: () => void;
  onShelf: () => void;
  onRules: () => void;
  onReset: () => void;
}) {
  const sheet = useRef(new Animated.Value(120)).current;
  const hero = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;
  const [settings, setSettings] = useState(false);
  const [hint, setHint] = useState('');

  useEffect(() => {
    Animated.parallel([
      Animated.spring(sheet, {
        toValue: 0,
        tension: 60,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.timing(hero, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [float, hero, sheet]);

  const handleChip = useCallback(
    (id: number) => {
      if (isPackUnlocked(progress, id)) {
        setHint('');
        onSelectPack(id);
        return;
      }
      const left = unlockRemaining(progress, id);
      const from = PACKS[id - 1].label;
      const to = PACKS[id].label;
      setHint('SEW ' + left + ' MORE ' + from + ' QUILTS TO UNLOCK ' + to);
    },
    [onSelectPack, progress],
  );

  const openSettings = useCallback(() => setSettings(true), []);
  const closeSettings = useCallback(() => setSettings(false), []);
  const handleReset = useCallback(() => {
    onReset();
    setSettings(false);
    setHint('');
  }, [onReset]);

  const solved = totalSolved(progress);
  const pct = Math.round(Math.min(1, solved / TOTAL_QUILTS) * 100);
  const heroShift = float.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });
  const heroScale = hero.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <AppBackground variant="menu">
      <View style={styles.topStrip}>
        <RoundIconButton
          source={assets.iconHome}
          label="SETTINGS"
          onPress={openSettings}
        />
        <View style={styles.spoolPill}>
          <View style={styles.spoolIcon}>
            <Disc size={18} color={theme.colors.accent} strokeWidth={2.2} />
          </View>
          <Text style={styles.spoolValue}>{String(progress.spools)}</Text>
          <Text style={styles.spoolLabel}>SPOOLS</Text>
        </View>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[styles.heroZone, {opacity: hero}]}>
        <Image source={assets.sprite1} style={styles.patchA} resizeMode="contain" />
        <Image source={assets.sprite3} style={styles.patchB} resizeMode="contain" />
        <Animated.Image
          source={assets.logo}
          style={[
            styles.heroLogo,
            {transform: [{translateY: heroShift}, {scale: heroScale}]},
          ]}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        pointerEvents="box-none"
        style={[styles.sheetWrap, {transform: [{translateY: sheet}]}]}>
        <LinearGradient colors={GRAD_SHEET} style={styles.sheet}>
          <View style={styles.sheetSeam} pointerEvents="none">
            <StitchSeam width={SCREEN_W - 2} color="rgba(40,224,109,0.35)" />
          </View>

          <Text style={styles.sheetTitle}>SEWING BASKET</Text>
          <Text style={styles.tagline}>PICK A QUILT SIZE AND START STITCHING</Text>

          <View style={styles.chipRow}>
            {PACKS.map(pack => (
              <PackChip
                key={pack.id}
                id={pack.id}
                label={pack.label}
                width={CHIP_W}
                active={pack.id === packIndex}
                locked={!isPackUnlocked(progress, pack.id)}
                onPress={handleChip}
              />
            ))}
          </View>

          {hint ? <Text style={styles.hint}>{hint}</Text> : null}

          <View style={styles.progressRow}>
            <Text style={styles.progressLabel}>
              {solved + ' / ' + TOTAL_QUILTS + ' QUILTS SEWN'}
            </Text>
            <Text style={styles.progressPack}>{PACKS[packIndex].name}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {flex: pct}]} />
            <View style={{flex: 100 - pct}} />
          </View>

          <View style={styles.ctaWrap}>
            <PrimaryButton
              label="START QUILT"
              Icon={Scissors}
              onPress={onPlay}
              width={SHEET_INNER_W}
              height={60}
            />
          </View>

          <View style={styles.secondaryRow}>
            <SecondaryButton
              label="BLANKET SHELF"
              Icon={Layers}
              onPress={onShelf}
              width={SECONDARY_BTN_W}
            />
            <SecondaryButton
              label="HOW TO SEW"
              Icon={BookOpen}
              onPress={onRules}
              width={SECONDARY_BTN_W}
            />
          </View>
        </LinearGradient>
      </Animated.View>

      <BottomSheet visible={settings} title="SEWING TABLE" onClose={closeSettings}>
        <Text style={styles.settingsBody}>
          Quilt Patch Logic is offline and free. Nothing punishes you here — a
          quilt can only be finished or set aside.
        </Text>
        <SecondaryButton
          label="RESET PROGRESS"
          onPress={handleReset}
          width={SHEET_INNER_W}
          height={52}
          tint={theme.colors.primaryLight}
        />
        <SecondaryButton
          label="CLOSE"
          onPress={closeSettings}
          width={SHEET_INNER_W}
          height={52}
        />
      </BottomSheet>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  topStrip: {
    paddingTop: 44,
    height: 116,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spoolPill: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(240,236,233,0.08)',
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
  },
  spoolIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spoolValue: {
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '900',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
  spoolLabel: {
    fontSize: 10,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
  },
  heroZone: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLogo: {
    width: 164,
    height: 164,
  },
  patchA: {
    position: 'absolute',
    top: 12,
    left: 28,
    width: 56,
    height: 56,
    opacity: 0.55,
    transform: [{rotate: '8deg'}],
  },
  patchB: {
    position: 'absolute',
    top: 36,
    right: 26,
    width: 56,
    height: 56,
    opacity: 0.55,
    transform: [{rotate: '-6deg'}],
  },
  sheetWrap: {
    width: SCREEN_W,
  },
  sheet: {
    width: SCREEN_W,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(240,236,233,0.12)',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 26,
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 26,
    shadowOffset: {width: 0, height: -8},
    elevation: 20,
  },
  sheetSeam: {
    position: 'absolute',
    top: 8,
    left: 1,
  },
  sheetTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.primary,
  },
  tagline: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: CHIP_GAP,
  },
  hint: {
    marginTop: 8,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.primaryLight,
  },
  progressRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
    fontVariant: ['tabular-nums'],
  },
  progressPack: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.primary,
  },
  progressTrack: {
    marginTop: 6,
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(240,236,233,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
  },
  ctaWrap: {
    marginTop: 16,
    alignItems: 'center',
  },
  secondaryRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  settingsBody: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    marginBottom: 6,
  },
});
