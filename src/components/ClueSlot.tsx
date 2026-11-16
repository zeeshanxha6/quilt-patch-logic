import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PATTERNS} from '../constants/patterns';
import theme from '../constants/theme';
import {CLUE_ENTRY} from '../constants/config';

/**
 * Edge clue: one coloured digit per pattern, `·` when the line needs none.
 * Fixed-size entries keep the gutters perfectly aligned with the grid.
 */
function ClueSlot({
  counts,
  patternCount,
  orientation,
  satisfied,
  length,
  thickness,
}: {
  counts: number[];
  patternCount: number;
  orientation: 'row' | 'column';
  satisfied: boolean;
  length: number;
  thickness: number;
}) {
  const isColumn = orientation === 'column';
  const entries = [];
  for (let p = 1; p <= patternCount; p++) {
    const value = counts[p] ?? 0;
    entries.push(
      <View key={p} style={styles.entry}>
        <Text
          style={[
            styles.digit,
            {
              color: satisfied
                ? theme.colors.accent
                : value === 0
                ? theme.colors.text.muted
                : PATTERNS[p - 1].color,
            },
          ]}>
          {value === 0 ? '·' : String(value)}
        </Text>
      </View>,
    );
  }

  return (
    <View
      style={[
        styles.slot,
        isColumn
          ? {width: length, height: thickness, flexDirection: 'column-reverse'}
          : {width: thickness, height: length, flexDirection: 'row-reverse'},
        satisfied ? styles.satisfied : null,
      ]}>
      {entries}
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  satisfied: {
    backgroundColor: 'rgba(40,224,109,0.12)',
    opacity: 0.75,
  },
  entry: {
    width: CLUE_ENTRY,
    height: CLUE_ENTRY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  digit: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

export default React.memo(ClueSlot);
