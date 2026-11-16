import {useCallback, useMemo, useRef, useState} from 'react';
import {Vibration} from 'react-native';
import {
  colCluesOf,
  emptyGrid,
  generateQuilt,
  rowCluesOf,
} from '../game/generator';
import type {Grid} from '../game/generator';
import {
  evaluateBoard,
  neededCounts,
  overflowCells,
  placedCounts,
} from '../game/rules';
import {CHECKS_PER_QUILT, UNDO_LIMIT} from '../constants/config';

export type QuiltGame = ReturnType<typeof useQuiltGame>;

type Move = {row: number; col: number; before: number};

export function useQuiltGame(
  size: number,
  patternCount: number,
  seed: number,
) {
  const puzzle = useMemo(() => {
    const solution = generateQuilt(size, patternCount, seed);
    return {
      solution,
      rowClues: rowCluesOf(solution, patternCount),
      colClues: colCluesOf(solution, patternCount),
    };
  }, [size, patternCount, seed]);

  const [cells, setCells] = useState<Grid>(() => emptyGrid(size));
  const [selected, setSelected] = useState(1);
  const [checksLeft, setChecksLeft] = useState(CHECKS_PER_QUILT);
  const [errorCells, setErrorCells] = useState<string[]>([]);

  /** Mutable data read inside callbacks lives in refs, never in state (rule #8). */
  const undoStack = useRef<Move[]>([]);
  const [moveCount, setMoveCount] = useState(0);

  const evaluation = useMemo(
    () => evaluateBoard(cells, puzzle.rowClues, puzzle.colClues, patternCount),
    [cells, puzzle, patternCount],
  );

  const placed = useMemo(
    () => placedCounts(cells, patternCount),
    [cells, patternCount],
  );
  const needed = useMemo(
    () => neededCounts(puzzle.rowClues, patternCount),
    [puzzle, patternCount],
  );

  const tapCell = useCallback(
    (row: number, col: number) => {
      const current = cells[row][col];
      const next = selected === 0 || current === selected ? 0 : selected;
      if (next === current) {
        return;
      }
      undoStack.current.push({row, col, before: current});
      if (undoStack.current.length > UNDO_LIMIT) {
        undoStack.current.shift();
      }
      const grid = cells.map(r => r.slice());
      grid[row][col] = next;
      setCells(grid);
      setMoveCount(n => n + 1);
      setErrorCells(prev => (prev.length ? [] : prev));
      Vibration.vibrate(10);
    },
    [cells, selected],
  );

  const undo = useCallback(() => {
    const move = undoStack.current.pop();
    if (!move) {
      return;
    }
    setCells(prev => {
      const grid = prev.map(r => r.slice());
      grid[move.row][move.col] = move.before;
      return grid;
    });
    setMoveCount(n => Math.max(0, n - 1));
    setErrorCells([]);
    Vibration.vibrate(10);
  }, []);

  const check = useCallback(() => {
    if (checksLeft <= 0) {
      return 0;
    }
    setChecksLeft(n => n - 1);
    const flagged = overflowCells(
      cells,
      puzzle.rowClues,
      puzzle.colClues,
      patternCount,
    );
    setErrorCells(flagged);
    Vibration.vibrate(18);
    return flagged.length;
  }, [cells, checksLeft, patternCount, puzzle]);

  const clearErrors = useCallback(() => setErrorCells([]), []);

  const reveal = useCallback(() => {
    setCells(puzzle.solution.map(r => r.slice()));
    undoStack.current = [];
  }, [puzzle]);

  return {
    cells,
    rowClues: puzzle.rowClues,
    colClues: puzzle.colClues,
    solution: puzzle.solution,
    evaluation,
    placed,
    needed,
    selected,
    setSelected,
    tapCell,
    undo,
    check,
    clearErrors,
    reveal,
    checksLeft,
    errorCells,
    checksUsed: CHECKS_PER_QUILT - checksLeft,
    canUndo: moveCount > 0,
  };
}

export default useQuiltGame;
