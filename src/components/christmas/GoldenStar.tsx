import {Circle, Layout, Path} from '@motion-canvas/2d';

interface GoldenStarProps {
  x?: number;
  y?: number;
  size?: number;
  opacity?: number;
  rotation?: number;
}

/**
 * 8-Point Sparkling Christmas Star
 * Faceted geometry with warm golden highlights.
 */
export function GoldenStar({
  x = 0,
  y = 0,
  size = 40,
  opacity = 1,
  rotation = 0,
}: GoldenStarProps) {
  const s = size / 40;
  return (
    <Layout x={x} y={y} scale={s} opacity={opacity} rotation={rotation}>
      {/* Soft halo */}
      <Circle size={48} fill="#FFD21A" opacity={0.2} />

      {/* Main 4 Primary Ray Facets */}
      <Path
        data="M 0 -22 L 5 -5 L 22 0 L 5 5 L 0 22 L -5 5 L -22 0 L -5 -5 Z"
        fill="#FFD21A"
        stroke="#C99700"
        lineWidth={1}
      />

      {/* Secondary 4 Diagonal Rays */}
      <Path
        data="M 0 0 L 10 -10 M 0 0 L 10 10 M 0 0 L -10 10 M 0 0 L -10 -10"
        stroke="#FFD21A"
        lineWidth={1.5}
      />

      {/* Central Diamond Core */}
      <Circle size={6} fill="#FFFFFF" />
    </Layout>
  );
}
