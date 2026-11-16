import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Clock} from 'lucide-react-native';
import theme from '../constants/theme';
import useTimer from '../hooks/useTimer';
import {formatTime} from '../utils/format';

/**
 * Isolated so the ticking clock re-renders 40 bytes of text and never the
 * quilt board (react-state-minimize).
 */
export default function GameTimer({
  running,
  startedAt,
}: {
  running: boolean;
  startedAt: number;
}) {
  const ms = useTimer(running, startedAt);
  return (
    <View style={styles.row}>
      <View style={styles.iconBox}>
        <Clock size={16} color={theme.colors.text.secondary} strokeWidth={2.2} />
      </View>
      <Text style={styles.value}>{formatTime(ms)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBox: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 15,
    lineHeight: 16,
    fontWeight: '800',
    color: theme.colors.text.primary,
    fontVariant: ['tabular-nums'],
  },
});
