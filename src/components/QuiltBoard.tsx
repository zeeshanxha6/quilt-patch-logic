import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Svg, {Line} from 'react-native-svg';
import type {Clues, Grid} from '../game/generator';
import {cellKey} from '../game/rules';
import {BOARD_BORDER, BOARD_PAD} from '../constants/config';
import type {BoardGeometry} from '../constants/config';
import theme from '../constants/theme';
import ClueSlot from './ClueSlot';
import QuiltCell from './QuiltCell';

/** Dashed sage seams across every finished line. Purely decorative overlay. */
function SeamOverlay({
  gridW,
  tile,
  validRows,
  validCols,
}: {
  gridW: number;
  tile: number;
  validRows: boolean[];
  validCols: boolean[];
}) {
  return (
    <Svg
      width={gridW}
      height={gridW}
      style={StyleSheet.absoluteFill}
      pointerEvents="none">
      {validRows.map((ok, r) =>
        ok ? (
          <Line
            key={`r${r}`}
            x1={2}
            y1={r * tile + tile / 2}
            x2={gridW - 2}
            y2={r * tile + tile / 2}
            stroke={theme.colors.accent}
            strokeWidth={2}
            strokeDasharray="7 5"
            strokeLinecap="round"
            opacity={0.9}
          />
        ) : null,
      )}
      {validCols.map((ok, c) =>
        ok ? (
          <Line
            key={`c${c}`}
            x1={c * tile + tile / 2}
            y1={2}
            x2={c * tile + tile / 2}
            y2={gridW - 2}
            stroke={theme.colors.accent}
            strokeWidth={2}
            strokeDasharray="7 5"
            strokeLinecap="round"
            opacity={0.9}
          />
        ) : null,
      )}
    </Svg>
  );
}

export default function QuiltBoard({
  cells,
  rowClues,
  colClues,
  patternCount,
  geometry,
  validRows,
  validCols,
  errorCells,
  onCellPress,
}: {
  cells: Grid;
  rowClues: Clues;
  colClues: Clues;
  patternCount: number;
  geometry: BoardGeometry;
  validRows: boolean[];
  validCols: boolean[];
  errorCells: string[];
  onCellPress: (row: number, col: number) => void;
}) {
  const {clue, tile, gridW, boardW} = geometry;
  const errorSet = useMemo(() => new Set(errorCells), [errorCells]);

  return (
    <View style={[styles.board, {width: boardW}]}>
      <View style={styles.topRow}>
        <View style={{width: clue, height: clue}} />
        <View style={{flexDirection: 'row'}}>
          {colClues.map((counts, c) => (
            <ClueSlot
              key={`cc${c}`}
              counts={counts}
              patternCount={patternCount}
              orientation="column"
              satisfied={validCols[c]}
              length={tile}
              thickness={clue}
            />
          ))}
        </View>
      </View>

      <View style={styles.bodyRow}>
        <View style={{width: clue}}>
          {rowClues.map((counts, r) => (
            <ClueSlot
              key={`rc${r}`}
              counts={counts}
              patternCount={patternCount}
              orientation="row"
              satisfied={validRows[r]}
              length={tile}
              thickness={clue}
            />
          ))}
        </View>

        <View style={{width: gridW, height: gridW}}>
          {cells.map((row, r) => (
            <View key={`r${r}`} style={styles.gridRow}>
              {row.map((pattern, c) => (
                <QuiltCell
                  key={`c${c}`}
                  row={r}
                  col={c}
                  pattern={pattern}
                  tile={tile}
                  isError={errorSet.has(cellKey(r, c))}
                  inValidLine={validRows[r] || validCols[c]}
                  onPress={onCellPress}
                />
              ))}
            </View>
          ))}
          <SeamOverlay
            gridW={gridW}
            tile={tile}
            validRows={validRows}
            validCols={validCols}
          />
        </View>
      </View>

      <View pointerEvents="none" style={styles.topHighlight} />
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.bg.border,
    borderRadius: 16,
    backgroundColor: theme.colors.bg.surface,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 10},
    elevation: 14,
  },
  topRow: {
    flexDirection: 'row',
  },
  bodyRow: {
    flexDirection: 'row',
  },
  gridRow: {
    flexDirection: 'row',
  },
  topHighlight: {
    position: 'absolute',
    top: 2,
    left: 10,
    right: 10,
    height: 1,
    backgroundColor: 'rgba(240,236,233,0.10)',
    borderRadius: 1,
  },
});
