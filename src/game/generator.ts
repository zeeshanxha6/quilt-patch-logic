/** Deterministic, dependency-free PRNG (mulberry32). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Grid = number[][];
/** clue[line][patternId] -> how many patches of that pattern the line needs. */
export type Clues = number[][];

/**
 * Builds a SOLVED quilt. Every cell takes the pattern that is currently the
 * least used in its row AND its column, so the per-line distribution stays
 * balanced and the resulting clues are always solvable.
 */
export function generateQuilt(
  size: number,
  patternCount: number,
  seed: number,
): Grid {
  const rng = mulberry32(seed * 2654435761 + size * 131 + patternCount);
  const colCount: number[][] = [];
  for (let c = 0; c < size; c++) {
    colCount.push(new Array(patternCount + 1).fill(0));
  }

  const solution: Grid = [];
  for (let r = 0; r < size; r++) {
    const rowCount = new Array(patternCount + 1).fill(0);
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      let best = 1;
      let bestScore = Number.POSITIVE_INFINITY;
      for (let p = 1; p <= patternCount; p++) {
        const score = rowCount[p] * 2.2 + colCount[c][p] * 2.2 + rng();
        if (score < bestScore) {
          bestScore = score;
          best = p;
        }
      }
      row.push(best);
      rowCount[best] += 1;
      colCount[c][best] += 1;
    }
    solution.push(row);
  }
  return solution;
}

export function emptyGrid(size: number): Grid {
  const g: Grid = [];
  for (let r = 0; r < size; r++) {
    g.push(new Array(size).fill(0));
  }
  return g;
}

export function rowCluesOf(solution: Grid, patternCount: number): Clues {
  return solution.map(row => {
    const counts = new Array(patternCount + 1).fill(0);
    row.forEach(v => {
      counts[v] += 1;
    });
    return counts;
  });
}

export function colCluesOf(solution: Grid, patternCount: number): Clues {
  const size = solution.length;
  const out: Clues = [];
  for (let c = 0; c < size; c++) {
    const counts = new Array(patternCount + 1).fill(0);
    for (let r = 0; r < size; r++) {
      counts[solution[r][c]] += 1;
    }
    out.push(counts);
  }
  return out;
}
