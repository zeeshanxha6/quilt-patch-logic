import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import theme from '../constants/theme';

/**
 * The SINGLE stat component used on Game, GameOver and Shelf.
 * No raster icons by design (rule #21): an 8x8 accent dot carries the
 * semantics, so every pill in a row is pixel-identical in shape.
 * `width:'100%'` not `flex:1` — the parent slot is already flex:1 (rule #19a).
 */
export default function StatCard({
  value,
  label,
  valueColor = theme.colors.text.primary,
}: {
  value: string;
  label: string;
  valueColor?: string;
}) {
  return (
    <View style={[styles.card, {borderColor: valueColor + '55'}]}>
      <View style={[styles.dot, {backgroundColor: valueColor}]} />
      <Text style={[styles.value, {color: valueColor}]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(58,42,29,0.72)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
  label: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.text.muted,
  },
});
