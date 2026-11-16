import {SPRITES} from '../assets';

export type PatternDef = {
  id: number;
  name: string;
  short: string;
  sprite: number;
  tintBg: string;
  color: string;
};

/** Five fabric patches, bound 1:1 to sprite_1..sprite_5 of the asset contract. */
export const PATTERNS: PatternDef[] = [
  {id: 1, name: 'GINGHAM CHECK', short: 'GINGHAM', sprite: SPRITES[0], tintBg: 'rgba(171,93,42,0.20)', color: '#AB5D2A'},
  {id: 2, name: 'CREAM STAR', short: 'STAR', sprite: SPRITES[1], tintBg: 'rgba(240,236,233,0.15)', color: '#F0ECE9'},
  {id: 3, name: 'SAGE LEAF', short: 'LEAF', sprite: SPRITES[2], tintBg: 'rgba(40,224,109,0.16)', color: '#28E06D'},
  {id: 4, name: 'OLIVE DIAMOND', short: 'DIAMOND', sprite: SPRITES[3], tintBg: 'rgba(89,82,38,0.32)', color: '#A49A5C'},
  {id: 5, name: 'TERRACOTTA SPIRAL', short: 'SPIRAL', sprite: SPRITES[4], tintBg: 'rgba(217,123,77,0.20)', color: '#D97B4D'},
];

export function patternById(id: number): PatternDef {
  return PATTERNS[id - 1];
}
