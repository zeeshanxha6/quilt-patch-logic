import type {Clues, Grid} from './generator';

export type BoardEvaluation = {
  validRows: boolean[];
  validCols: boolean[];
  validLines: number;
  totalLines: number;
  filled: number;
  total: number;
  solved: boolean;
};

function countLine(values: number[], patternCount: number): number[] {
  const counts = new Array(patternCount + 1).fill(0);
  for (let i = 0; i < values.length; i++) {
    counts[values[i]] += 1;
  }
  return counts;
}

function lineValid(
  values: number[],
  clue: number[],
  patternCount: number,
): boolean {
  const counts = countLine(values, patternCount);
  if (counts[0] > 0) {
    return false;
  }
  for (let p = 1; p <= patternCount; p++) {
    if (counts[p] !== clue[p]) {
      return false;
    }
  }
  return true;
}

export function columnOf(cells: Grid, c: number): number[] {
  const out: number[] = [];
  for (let r = 0; r < cells.length; r++) {
    out.push(cells[r][c]);
  }
  return out;
}

export function evaluateBoard(
  cells: Grid,
  rowClues: Clues,
  colClues: Clues,
  patternCount: number,
): BoardEvaluation {
  const size = cells.length;
  const validRows: boolean[] = [];
  const validCols: boolean[] = [];
  let filled = 0;

  for (let r = 0; r < size; r++) {
    validRows.push(lineValid(cells[r], rowClues[r], patternCount));
    for (let c = 0; c < size; c++) {
      if (cells[r][c] !== 0) {
        filled += 1;
      }
    }
  }
  for (let c = 0; c < size; c++) {
    validCols.push(lineValid(columnOf(cells, c), colClues[c], patternCount));
  }

  const validLines =
    validRows.filter(Boolean).length + validCols.filter(Boolean).length;
  const solved = validLines === size * 2;

  return {
    validRows,
    validCols,
    validLines,
    totalLines: size * 2,
    filled,
    total: size * size,
    solved,
  };
}

export const cellKey = (r: number, c: number) => `${r}-${c}`;

/**
 * CHECK STITCH — surfaces only what CANNOT be right: lines where some pattern
 * is already placed more times than the clue allows. Never confirms anything.
 */
export function overflowCells(
  cells: Grid,
  rowClues: Clues,
  colClues: Clues,
  patternCount: number,
): string[] {
  const size = cells.length;
  const flagged = new Set<string>();

  for (let r = 0; r < size; r++) {
    const counts = countLine(cells[r], patternCount);
    for (let p = 1; p <= patternCount; p++) {
      if (counts[p] > rowClues[r][p]) {
        for (let c = 0; c < size; c++) {
          if (cells[r][c] === p) {
            flagged.add(cellKey(r, c));
          }
        }
      }
    }
  }
  for (let c = 0; c < size; c++) {
    const counts = countLine(columnOf(cells, c), patternCount);
    for (let p = 1; p <= patternCount; p++) {
      if (counts[p] > colClues[c][p]) {
        for (let r = 0; r < size; r++) {
          if (cells[r][c] === p) {
            flagged.add(cellKey(r, c));
          }
        }
      }
    }
  }
  return Array.from(flagged);
}

/** How many patches of each pattern are already on the board. */
export function placedCounts(cells: Grid, patternCount: number): number[] {
  const counts = new Array(patternCount + 1).fill(0);
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells.length; c++) {
      counts[cells[r][c]] += 1;
    }
  }
  return counts;
}

/** How many patches of each pattern the finished quilt needs in total. */
export function neededCounts(rowClues: Clues, patternCount: number): number[] {
  const counts = new Array(patternCount + 1).fill(0);
  for (let r = 0; r < rowClues.length; r++) {
    for (let p = 1; p <= patternCount; p++) {
      counts[p] += rowClues[r][p];
    }
  }
  return counts;
}
