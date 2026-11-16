import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import theme from '../constants/theme';
import {SCREEN_W} from '../constants/config';
import StitchSeam from './StitchSeam';

/**
 * Shared header for every screen with a chrome bar (Game, GameOver, Shelf,
 * Rules). Same component everywhere — only the slots change.
 */
export default function ScreenHeader({
  title,
  subtitle,
  leftSlot,
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}) {
  return (
    <View style={styles.root}>
      <View style={styles.row}>
        <View style={styles.side}>{leftSlot}</View>
        <View style={styles.center}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.sideRight}>{rightSlot}</View>
      </View>
      <View style={styles.seam}>
        <StitchSeam width={SCREEN_W} color="rgba(240,236,233,0.16)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 116,
    paddingTop: 44,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(240,236,233,0.10)',
    justifyContent: 'center',
  },
  row: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: {
    width: 80,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sideRight: {
    width: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.6,
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: theme.colors.text.muted,
  },
  seam: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.8,
  },
});
