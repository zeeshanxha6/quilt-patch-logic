import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PATTERNS} from '../constants/patterns';
import theme from '../constants/theme';
import type {Grid} from '../game/generator';

/**
 * Blanket-shelf thumbnail. Solved quilts are redrawn as a flat colour mosaic
 * (not sprites) so 18 thumbnails stay cheap and perfectly uniform.
 */
function QuiltThumb({
  solution,
  label,
  side,
}: {
  solution: Grid | null;
  label: string;
  side: number;
}) {
  if (!solution) {
    return (
      <View style={[styles.empty, {width: side, height: side}]}>
        <Text style={styles.emptyLabel}>{label}</Text>
      </View>
    );
  }

  const inner = side - 12;
  const cell = Math.floor(inner / solution.length);

  return (
    <View style={[styles.frame, {width: side, height: side}]}>
      <View>
        {solution.map((row, r) => (
          <View key={r} style={styles.row}>
            {row.map((p, c) => (
              <View
                key={c}
                style={{
                  width: cell,
                  height: cell,
                  backgroundColor: PATTERNS[p - 1].color,
                  opacity: 0.88,
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.bg.border,
    backgroundColor: theme.colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  empty: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(240,236,233,0.12)',
    backgroundColor: 'rgba(240,236,233,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: theme.colors.text.muted,
  },
  row: {
    flexDirection: 'row',
  },
});

export default React.memo(QuiltThumb);
