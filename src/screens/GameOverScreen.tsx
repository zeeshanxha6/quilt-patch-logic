import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Home, Layers, RotateCcw} from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import ConfettiThreads from '../components/ConfettiThreads';
import PrimaryButton from '../components/PrimaryButton';
import QuiltReveal from '../components/QuiltReveal';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import StitchSeam from '../components/StitchSeam';
import {PACKS, SCREEN_W, SECONDARY_BTN_W, SHEET_INNER_W} from '../constants/config';
import theme from '../constants/theme';
import type {GameResult, Progress} from '../game/progress';
import {formatTime} from '../utils/format';

const SEAM_W = Math.round(SCREEN_W * 0.7);

function Stars({count}: {count: number}) {
  const glyphs = [0, 1, 2].map(i => (
    <Text
      key={i}
      style={[
        styles.star,
        {
          color:
            i < count ? theme.colors.primary : 'rgba(240,236,233,0.18)',
        },
      ]}>
      ★
    </Text>
  ));
  return <View style={styles.starRow}>{glyphs}</View>;
}

export default function GameOverScreen({
  result,
  progress,
  onPlayAgain,
  onShelf,
  onMenu,
}: {
  result: GameResult;
  progress: Progress;
  onPlayAgain: () => void;
  onShelf: () => void;
  onMenu: () => void;
}) {
  const won = result.won;
  const pack = PACKS[result.packId];

  return (
    <AppBackground variant="result">
      <ConfettiThreads active={won} />

      <ScreenHeader
        title={won ? 'FINISHED QUILT' : 'SET ASIDE'}
        subtitle={pack.label + '  PACK: ' + pack.name}
      />

      <View style={styles.body}>
        <Text style={styles.title}>{won ? 'QUILT FINISHED' : 'SET ASIDE'}</Text>
        <View style={styles.titleSeam} pointerEvents="none">
          <StitchSeam
            width={SEAM_W}
            color={won ? theme.colors.accent : theme.colors.primaryLight}
          />
        </View>

        <View style={styles.revealWrap}>
          <QuiltReveal grid={result.solution} />
        </View>

        <Stars count={won ? result.stars : 0} />

        <View style={styles.statRow}>
          <View style={styles.statSlot}>
            <StatCard
              value={formatTime(result.timeMs)}
              label="TIME"
              valueColor={theme.colors.text.primary}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={String(result.checksUsed)}
              label="CHECKS"
              valueColor={theme.colors.primaryLight}
            />
          </View>
          <View style={styles.statSlot}>
            <StatCard
              value={String(progress.streak)}
              label="STREAK"
              valueColor={theme.colors.accent}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerHint}>
          {won
            ? 'FOLDED ONTO THE BLANKET SHELF'
            : 'NOTHING LOST — PICK IT UP ANY TIME'}
        </Text>
        <PrimaryButton
          label="SEW AGAIN"
          Icon={RotateCcw}
          onPress={onPlayAgain}
          width={SHEET_INNER_W}
          height={60}
        />
        <View style={styles.secondaryRow}>
          <SecondaryButton
            label="BLANKET SHELF"
            Icon={Layers}
            onPress={onShelf}
            width={SECONDARY_BTN_W}
          />
          <SecondaryButton
            label="BACK TO BASKET"
            Icon={Home}
            onPress={onMenu}
            width={SECONDARY_BTN_W}
          />
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 2,
    color: theme.colors.text.primary,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowRadius: 10,
    textShadowOffset: {width: 0, height: 3},
  },
  titleSeam: {
    marginTop: 12,
    marginBottom: 14,
  },
  revealWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  starRow: {
    marginTop: 14,
    flexDirection: 'row',
    gap: 10,
  },
  star: {
    fontSize: 26,
    lineHeight: 30,
  },
  statRow: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'stretch',
  },
  statSlot: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 26,
    alignItems: 'center',
    gap: 12,
  },
  footerHint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
});
