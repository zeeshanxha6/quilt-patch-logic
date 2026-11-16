import React from 'react';
import Svg, {Line} from 'react-native-svg';
import theme from '../constants/theme';

/**
 * The single dashed-seam implementation, reused on every sewn edge:
 * sheet hems, card borders, the flourish under GameOver titles.
 */
export default function StitchSeam({
  width,
  color = theme.colors.seam,
  thickness = 2,
  dash = '7 5',
}: {
  width: number;
  color?: string;
  thickness?: number;
  dash?: string;
}) {
  return (
    <Svg width={width} height={thickness + 2} pointerEvents="none">
      <Line
        x1={0}
        y1={(thickness + 2) / 2}
        x2={width}
        y2={(thickness + 2) / 2}
        stroke={color}
        strokeWidth={thickness}
        strokeDasharray={dash}
        strokeLinecap="round"
      />
    </Svg>
  );
}
