import React, {useCallback, useMemo} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import AppBackground from '../components/AppBackground';
import PrimaryButton from '../components/PrimaryButton';
import QuiltThumb from '../components/QuiltThumb';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import {PACKS, SCREEN_W, SHEET_INNER_W, TOTAL_QUILTS} from '../constants/config';
import theme from '../constants/theme';
import type {Progress} from '../game/progress';
import {totalSolved} from '../game/progress';
import type {Grid} from '../game/generator';
import {formatTime} from '../utils/format';
import {Scissors} from 'lucide-react-native';

const COLUMNS = 3;
const GAP = 12;
const SIDE = Math.floor((SCREEN_W - 40 - GAP * (COLUMNS - 1)) / COLUMNS);
const SLOTS = 12;

type Slot = {key: string; solution: Grid | null; label: string};

export default function ShelfScreen({
  progress,
  onBack,
  onPlay,
}: {
  progress: Progress;
  onBack: () => void;
  onPlay: () => void;
}) {
  const solved = totalSolved(progress);

  const data = useMemo<Slot[]>(() => {
    const out: Slot[] = [];
    for (let i = 0; i < SLOTS; i++) {
      const quilt = progress.solved[i];
      out.push({
        key: quilt ? quilt.id : 'empty-' + i,
        solution: quilt ? quilt.solution : null,
        label: PACKS[i % PACKS.length].label,
      });
    }
    return out;
  }, [progress.solved]);

  const renderItem = useCallback(
    ({item}: {item: Slot}) => (
      <View style={styles.slot}>
        <QuiltThumb solution={item.solution} label={item.label} side={SIDE} />
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Slot) => item.key, []);

  return (
    <AppBackground variant="result">
      <ScreenHeader
        title="BLANKET SHELF"
        subtitle="FOLDED AND COUNTED"
        leftSlot={
          <SecondaryButton
            label="BACK"
            onPress={onBack}
            width={66}
            height={44}
          />
        }
      />

      <View style={styles.statRow}>
        <View style={styles.statSlot}>
          <StatCard
            value={solved + '/' + TOTAL_QUILTS}
            label="SOLVED"
            valueColor={theme.colors.accent}
          />
        </View>
        <View style={styles.statSlot}>
          <StatCard
            value={progress.bestMs > 0 ? formatTime(progress.bestMs) : '--:--'}
            label="BEST"
            valueColor={theme.colors.primaryLight}
          />
        </View>
        <View style={styles.statSlot}>
          <StatCard
            value={String(progress.streak)}
            label="STREAK"
            valueColor={theme.colors.primary}
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>FOLDED QUILTS</Text>

      <FlatList
        data={data}
        numColumns={COLUMNS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        initialNumToRender={12}
        windowSize={5}
        style={styles.listBox}
      />

      <View style={styles.footer}>
        <Text style={styles.footerHint}>EVERY FINISHED QUILT LANDS HERE</Text>
        <PrimaryButton
          label="START QUILT"
          Icon={Scissors}
          onPress={onPlay}
          width={SHEET_INNER_W}
          height={56}
        />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  statRow: {
    marginTop: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 10,
  },
  statSlot: {
    flex: 1,
  },
  sectionLabel: {
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 20,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  listBox: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  column: {
    gap: GAP,
    marginBottom: GAP,
  },
  slot: {
    width: SIDE,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
    alignItems: 'center',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(240,236,233,0.10)',
    backgroundColor: 'rgba(0,0,0,0.24)',
  },
  footerHint: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
  },
});
