/**
 * Visual preset: WARM_EARTHY (design-system/preset.ts).
 * The `name` field MUST stay exactly as the preset ships it.
 * Only the colour values are overridden to the brief's "craft table at dusk" hexes.
 */
export const theme = {
  name: 'warm-earthy',

  colors: {
    bg: {
      deep: '#221710', // walnut
      deeper: '#140D09', // loader gradient end
      surface: '#3A2A1D', // board / cards / sheet
      surfaceAlt: '#2A1C13', // controls panel
      border: '#5A4330', // wood edge
    },
    primary: '#AB5D2A', // terracotta
    primaryLight: '#D97B4D',
    accent: '#28E06D', // sage mint — actions + valid stitch
    accentDeep: '#1BAA54',
    olive: '#595226',
    oliveLight: '#A49A5C',
    text: {
      primary: '#F0ECE9',
      secondary: '#C9BBAE',
      muted: '#9A8A7C',
      onAccent: '#16260F',
    },
    glass: 'rgba(240,236,233,0.06)',
    glassStrong: 'rgba(240,236,233,0.10)',
    glassBorder: 'rgba(240,236,233,0.12)',
    hairline: 'rgba(240,236,233,0.08)',
    seam: 'rgba(240,236,233,0.22)',
  },

  gradients: {
    accent: ['#28E06D', '#1BAA54'] as const,
    terracotta: ['#D97B4D', '#AB5D2A'] as const,
    sheet: ['#3A2A1D', '#2A1C13'] as const,
    loader: ['rgba(14,9,6,0.94)', 'rgba(34,23,16,0.90)', 'rgba(14,9,6,0.96)'] as const,
    menu: ['rgba(34,23,16,0.18)', 'rgba(34,23,16,0.72)', 'rgba(20,13,9,0.95)'] as const,
    game: ['rgba(20,13,9,0.88)', 'rgba(34,23,16,0.80)', 'rgba(20,13,9,0.92)'] as const,
    result: ['rgba(20,13,9,0.78)', 'rgba(43,28,19,0.88)', 'rgba(20,13,9,0.95)'] as const,
    panel: ['rgba(26,17,11,0.82)', 'rgba(34,23,16,0.92)'] as const,
  },

  typography: {
    hero: { fontSize: 38, fontWeight: '900' as const, letterSpacing: 3 },
    title: { fontSize: 24, fontWeight: '800' as const, letterSpacing: 2 },
    subtitle: { fontSize: 14, fontWeight: '700' as const, letterSpacing: 1.5 },
    button: { fontSize: 17, fontWeight: '900' as const, letterSpacing: 1.8, lineHeight: 24 },
    body: { fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.2 },
    caption: { fontSize: 10, fontWeight: '700' as const, letterSpacing: 2 },
  },

  radius: { sm: 6, md: 14, lg: 18, xl: 24, xxl: 28, full: 999 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  shadows: {
    card: {
      shadowColor: '#000',
      shadowOpacity: 0.5,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 12,
    },
    sheet: {
      shadowColor: '#000',
      shadowOpacity: 0.55,
      shadowRadius: 26,
      shadowOffset: { width: 0, height: -8 },
      elevation: 18,
    },
    accent: {
      shadowColor: '#28E06D',
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    soft: {
      shadowColor: '#000',
      shadowOpacity: 0.4,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 6,
    },
  },
};

export type Theme = typeof theme;
export default theme;
