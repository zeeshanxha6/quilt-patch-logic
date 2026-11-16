import {Dimensions} from 'react-native';

const win = Dimensions.get('window');
export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/** Rule #13 — EXACTLY 8000ms, shorter races the screenshot capture window. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_PROGRESS_MS = 7600;
export const LOADER_FADE_MS = 320;

export const CHECKS_PER_QUILT = 3;
export const CHECK_HIGHLIGHT_MS = 2200;
export const UNDO_LIMIT = 50;
export const WIN_DELAY_MS = 650;
export const QUILTS_PER_PACK = 30;
/** Solves of pack N needed to unlock pack N+1. */
export const UNLOCK_AT = 3;

export type Pack = {
  id: number;
  size: number;
  patterns: number;
  label: string;
  name: string;
};

export const PACKS: Pack[] = [
  {id: 0, size: 5, patterns: 3, label: '5x5', name: 'COTTAGE'},
  {id: 1, size: 6, patterns: 3, label: '6x6', name: 'MEADOW'},
  {id: 2, size: 7, patterns: 4, label: '7x7', name: 'ORCHARD'},
  {id: 3, size: 8, patterns: 4, label: '8x8', name: 'HEARTH'},
  {id: 4, size: 9, patterns: 5, label: '9x9', name: 'HEIRLOOM'},
];

export const TOTAL_QUILTS = PACKS.length * QUILTS_PER_PACK;

/* ----------------------------------------------------------------
 * Board geometry — rule #4/#5: the parent's padding + border are
 * accounted for, so the tiles can never stick out of the frame.
 * ---------------------------------------------------------------- */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 6;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 8
export const CLUE_ENTRY = 12;

export const HEADER_H = 116; // 72 content + 44 status-bar inset
export const STAT_STRIP_H = 52;
export const CONTROLS_H = 196;

const GAME_AREA_H = SCREEN_H - HEADER_H - STAT_STRIP_H - CONTROLS_H - 20;

export type BoardGeometry = {
  clue: number;
  tile: number;
  gridW: number;
  boardW: number;
};

export function boardGeometry(size: number, patterns: number): BoardGeometry {
  const clue = patterns * CLUE_ENTRY + 8;
  const innerW = BOARD_MAX_W - 2 * BOARD_FRAME - clue;
  const innerH = GAME_AREA_H - 2 * BOARD_FRAME - clue;
  const tile = Math.max(
    22,
    Math.min(Math.floor(innerW / size), Math.floor(innerH / size), 64),
  );
  const gridW = tile * size;
  const boardW = gridW + clue + 2 * BOARD_FRAME;
  return {clue, tile, gridW, boardW};
}

/** GameOver quilt-reveal card, sized so the whole screen fits without scroll. */
export const REVEAL_CARD = Math.max(150, Math.min(252, SCREEN_H - 520));

/** Explicit widths for button rows (rule: every Pressable gets a real width). */
export const CONTROLS_INNER_W = SCREEN_W - 32;
export const ACTION_GAP = 10;
export const UNDO_BTN_W = Math.floor((CONTROLS_INNER_W - ACTION_GAP) / 3);
export const CHECK_BTN_W = CONTROLS_INNER_W - ACTION_GAP - UNDO_BTN_W;

export const SHEET_INNER_W = SCREEN_W - 40;
export const SECONDARY_BTN_W = Math.floor((SHEET_INNER_W - ACTION_GAP) / 2);
export const CHIP_GAP = 8;
export const CHIP_W = Math.floor(
  (SHEET_INNER_W - CHIP_GAP * (PACKS.length - 1)) / PACKS.length,
);
