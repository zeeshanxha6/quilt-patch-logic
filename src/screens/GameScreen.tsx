import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';
import {RotateCcw, Sparkles} from 'lucide-react-native';
import AppBackground from '../components/AppBackground';
import BottomSheet from '../components/BottomSheet';
import GameTimer from '../components/GameTimer';
import PatternPicker from '../components/PatternPicker';
import PrimaryButton from '../components/PrimaryButton';
import QuiltBoard from '../components/QuiltBoard';
import RoundIconButton from '../components/RoundIconButton';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import StatPill from '../components/StatPill';
import {assets} from '../assets';
import {
  boardGeometry,
  CHECK_BTN_W,
  CHECK_HIGHLIGHT_MS,
  CONTROLS_H,
  PACKS,
  SHEET_INNER_W,
  STAT_STRIP_H,
  UNDO_BTN_W,
  WIN_DELAY_MS,
} from '../constants/config';
import theme from '../constants/theme';
import useQuiltGame from '../hooks/useQuiltGame';
import {starsFor} from '../game/progress';
import type {GameResult} from '../game/progress';

export default function GameScreen({
  packIndex,
  quiltNumber,
  seed,
  onGameOver,
}: {
  packIndex: number;
  quiltNumber: number;
  seed: number;
  onGameOver: (result: GameResult) => void;
}) {
  const pack = PACKS[packIndex];
  const game = useQuiltGame(pack.size, pack.patterns, seed);
  const geometry = boardGeometry(pack.size, pack.patterns);

  const [paused, setPaused] = useState(false);
  const enter = useRef(new Animated.Value(0)).current;
  const startedAtRef = useRef(Date.now());
  const finishedRef = useRef(false);
  const winTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (winTimer.current) {
        clearTimeout(winTimer.current);
      }
    },
    [],
  );

  useEffect(() => {
    startedAtRef.current = Date.now();
    finishedRef.current = false;
    enter.setValue(0);
    Animated.timing(enter, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [enter, seed, packIndex]);

  /* Clear the gentle check highlight after its window. */
  useEffect(() => {
    if (game.errorCells.length === 0) {
      return;
    }
    const id = setTimeout(game.clearErrors, CHECK_HIGHLIGHT_MS);
    return () => clearTimeout(id);
  }, [game.errorCells, game.clearErrors]);

  /* Win — the round ends through onGameOver, never by staying on this screen.
     The timer lives in a ref, not in the effect cleanup, so a stray tap during
     the 650ms celebration can never cancel the transition. */
  useEffect(() => {
    if (!game.evaluation.solved || finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    const checksUsed = game.checksUsed;
    const timeMs = Date.now() - startedAtRef.current;
    const solution = game.cells.map(r => r.slice());
    winTimer.current = setTimeout(() => {
      onGameOver({
        won: true,
        packId: packIndex,
        size: pack.size,
        timeMs,
        checksUsed,
        stars: starsFor(checksUsed),
        solution,
      });
    }, WIN_DELAY_MS);
  }, [
    game.evaluation.solved,
    game.checksUsed,
    game.cells,
    onGameOver,
    packIndex,
    pack.size,
  ]);

  const openPause = useCallback(() => setPaused(true), []);
  const closePause = useCallback(() => setPaused(false), []);

  const leave = useCallback(() => {
    if (finishedRef.current) {
      return;
    }
    finishedRef.current = true;
    setPaused(false);
    onGameOver({
      won: false,
      packId: packIndex,
      size: pack.size,
      timeMs: Date.now() - startedAtRef.current,
      checksUsed: game.checksUsed,
      stars: 0,
      solution: game.cells.map(r => r.slice()),
    });
  }, [game.cells, game.checksUsed, onGameOver, packIndex, pack.size]);

  const enterScale = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const {filled, total, validLines, totalLines} = game.evaluation;

  return (
    <AppBackground variant="game">
      <ScreenHeader
        title={pack.label + '  QUILT ' + quiltNumber}
        subtitle={'PACK: ' + pack.name}
        leftSlot={
          <RoundIconButton
            source={assets.iconPause}
            label="PAUSE"
            onPress={openPause}
          />
        }
        rightSlot={<GameTimer running={!paused} startedAt={startedAtRef.current} />}
      />

      <View style={styles.gameArea}>
        <Animated.View
          pointerEvents="box-none"
          style={{opacity: enter, transform: [{scale: enterScale}]}}>
          <QuiltBoard
            cells={game.cells}
            rowClues={game.rowClues}
            colClues={game.colClues}
            patternCount={pack.patterns}
            geometry={geometry}
            validRows={game.evaluation.validRows}
            validCols={game.evaluation.validCols}
            errorCells={game.errorCells}
            onCellPress={game.tapCell}
          />
        </Animated.View>
      </View>

      <View style={styles.statStrip}>
        <StatPill
          value={filled + '/' + total}
          label="FILLED"
          color={theme.colors.accent}
        />
        <StatPill
          value={validLines + '/' + totalLines}
          label="LINES"
          color={theme.colors.primary}
        />
        <StatPill
          value={String(game.checksLeft)}
          label="CHECKS"
          color={theme.colors.text.secondary}
        />
      </View>

      <View style={styles.controls}>
        <PatternPicker
          patternCount={pack.patterns}
          selected={game.selected}
          placed={game.placed}
          needed={game.needed}
          onSelect={game.setSelected}
        />

        <View style={styles.actionRow}>
          <PrimaryButton
            label="CHECK STITCH"
            Icon={Sparkles}
            onPress={game.check}
            width={CHECK_BTN_W}
            height={56}
            disabled={game.checksLeft <= 0}
          />
          <SecondaryButton
            label="UNDO"
            Icon={RotateCcw}
            onPress={game.undo}
            width={UNDO_BTN_W}
            height={56}
          />
        </View>
      </View>

      <BottomSheet visible={paused} title="QUILT PAUSED" onClose={closePause}>
        <SecondaryButton
          label="RESUME"
          onPress={closePause}
          width={SHEET_INNER_W}
          height={52}
        />
        <SecondaryButton
          label="LEAVE TO BASKET"
          onPress={leave}
          width={SHEET_INNER_W}
          height={52}
          tint={theme.colors.primaryLight}
        />
      </BottomSheet>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  statStrip: {
    height: STAT_STRIP_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.26)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(240,236,233,0.10)',
    paddingHorizontal: 12,
  },
  controls: {
    height: CONTROLS_H,
    backgroundColor: theme.colors.bg.surfaceAlt,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(240,236,233,0.12)',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: -8},
    elevation: 18,
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
});
