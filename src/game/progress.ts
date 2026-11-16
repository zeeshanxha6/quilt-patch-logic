import {PACKS, QUILTS_PER_PACK, UNLOCK_AT} from '../constants/config';
import type {Grid} from './generator';

export type SolvedQuilt = {
  id: string;
  packId: number;
  size: number;
  solution: Grid;
  timeMs: number;
  stars: number;
};

export type Progress = {
  spools: number;
  streak: number;
  bestMs: number;
  perPack: number[];
  solved: SolvedQuilt[];
};

export type GameResult = {
  won: boolean;
  packId: number;
  size: number;
  timeMs: number;
  checksUsed: number;
  stars: number;
  solution: Grid;
};

/** Progress lives in memory only — no AsyncStorage, no native dependency. */
export function createProgress(): Progress {
  return {
    spools: 0,
    streak: 0,
    bestMs: 0,
    perPack: PACKS.map(() => 0),
    solved: [],
  };
}

export function starsFor(checksUsed: number): number {
  if (checksUsed <= 0) {
    return 3;
  }
  if (checksUsed <= 2) {
    return 2;
  }
  return 1;
}

export function applyResult(prev: Progress, result: GameResult): Progress {
  if (!result.won) {
    return {...prev, streak: 0};
  }
  const perPack = prev.perPack.slice();
  perPack[result.packId] = Math.min(
    QUILTS_PER_PACK,
    perPack[result.packId] + 1,
  );
  const quilt: SolvedQuilt = {
    id: `${result.packId}-${perPack[result.packId]}`,
    packId: result.packId,
    size: result.size,
    solution: result.solution,
    timeMs: result.timeMs,
    stars: result.stars,
  };
  return {
    spools: prev.spools + 1 + (result.stars === 3 ? 2 : 0),
    streak: prev.streak + 1,
    bestMs:
      prev.bestMs === 0 ? result.timeMs : Math.min(prev.bestMs, result.timeMs),
    perPack,
    solved: [quilt, ...prev.solved].slice(0, 36),
  };
}

export function totalSolved(p: Progress): number {
  return p.perPack.reduce((a, b) => a + b, 0);
}

export function isPackUnlocked(p: Progress, packId: number): boolean {
  if (packId === 0) {
    return true;
  }
  return p.perPack[packId - 1] >= UNLOCK_AT;
}

export function unlockRemaining(p: Progress, packId: number): number {
  if (packId === 0) {
    return 0;
  }
  return Math.max(0, UNLOCK_AT - p.perPack[packId - 1]);
}
