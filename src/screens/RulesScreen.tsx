import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Check, LayoutGrid, Layers, Scissors} from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StitchSeam from '../components/StitchSeam';
import {PATTERNS} from '../constants/patterns';
import {SCREEN_W, SHEET_INNER_W} from '../constants/config';
import theme from '../constants/theme';
import type {ButtonIcon} from '../components/PrimaryButton';

const STEPS: {Icon: ButtonIcon; title: string; body: string; tint: string}[] = [
  {
    Icon: LayoutGrid,
    title: 'READ THE EDGE',
    body: 'Numbers on the top and the left say how many patches of each pattern that line needs.',
    tint: theme.colors.primary,
  },
  {
    Icon: Scissors,
    title: 'TAP TO PATCH',
    body: 'Pick a fabric below the board, then tap a cell. Tap it again with the same fabric to clear it.',
    tint: theme.colors.primaryLight,
  },
  {
    Icon: Check,
    title: 'WATCH THE SEAM',
    body: 'A mint stitch sews itself across every line that is correct. Finish them all to complete the quilt.',
    tint: theme.colors.accent,
  },
];

const PATCH = Math.min(46, Math.floor((SCREEN_W - 56 - 4 * 10) / 5));

export default function RulesScreen({
  onBack,
  onPlay,
}: {
  onBack: () => void;
  onPlay: () => void;
}) {
  return (
    <AppBackground variant="game">
      <ScreenHeader
        title="HOW TO SEW"
        subtitle="THREE STEPS"
        leftSlot={
          <SecondaryButton label="BACK" onPress={onBack} width={66} height={44} />
        }
      />

      <View style={styles.body}>
        {STEPS.map(step => (
          <View key={step.title} style={styles.card}>
            <View
              style={[styles.iconWrap, {backgroundColor: step.tint + '22'}]}>
              <step.Icon size={24} color={step.tint} strokeWidth={2.2} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{step.title}</Text>
              <Text style={styles.cardBody}>{step.body}</Text>
            </View>
          </View>
        ))}

        <View style={styles.legendBox}>
          <Text style={styles.legendTitle}>THE FIVE FABRICS</Text>
          <View style={styles.legendSeam} pointerEvents="none">
            <StitchSeam width={SHEET_INNER_W - 28} />
          </View>
          <View style={styles.legendRow}>
            {PATTERNS.map(p => (
              <View key={p.id} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendSwatch,
                    {width: PATCH, height: PATCH, backgroundColor: p.tintBg},
                  ]}>
                  <Image
                    source={p.sprite}
                    style={{width: PATCH - 12, height: PATCH - 12}}
                    resizeMode="contain"
                  />
                </View>
                <Text style={[styles.legendLabel, {color: p.color}]} numberOfLines={1}>
                  {p.short}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerHint}>NO TIMER PRESSURE · NOTHING TO LOSE</Text>
        <PrimaryButton
          label="START QUILT"
          Icon={Layers}
          onPress={onPlay}
          width={SHEET_INNER_W}
          height={56}
        />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.bg.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(240,236,233,0.10)',
    padding: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    letterSpacing: 1.4,
    color: theme.colors.text.primary,
  },
  cardBody: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500',
    color: theme.colors.text.secondary,
  },
  legendBox: {
    marginTop: 2,
    backgroundColor: 'rgba(42,28,19,0.82)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(240,236,233,0.10)',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  legendSeam: {
    marginTop: 8,
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    alignItems: 'center',
    width: PATCH + 6,
  },
  legendSwatch: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(240,236,233,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendLabel: {
    marginTop: 6,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
    alignItems: 'center',
    gap: 10,
  },
  footerHint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: theme.colors.text.muted,
  },
});
