import {Circle, Layout, Line, Path} from '@motion-canvas/2d';

interface PineBranchProps {
  x: number;
  y: number;
  rotation?: number;
  scale?: number;
}

/**
 * Stylized vector Pine Branch & Holly Berries
 * Adds lush Christmas natural framing to corners and borders.
 */
export function PineBranch({x, y, rotation = 0, scale = 1}: PineBranchProps) {
  return (
    <Layout x={x} y={y} rotation={rotation} scale={scale}>
      {/* Central Woody Stem */}
      <Path
        data="M -60 20 Q 0 -10 80 -40"
        stroke="#4A2E18"
        lineWidth={6}
        lineCap="round"
      />

      {/* Pine Needle Tufts - Layer 1 (Dark Forest Green) */}
      <Path
        data="M -40 10 L -60 -20 M -35 12 L -45 -25 M -30 14 L -30 -28 M -25 15 L -15 -25 M -20 16 L -5 -20"
        stroke="#173D24"
        lineWidth={3.5}
        lineCap="round"
      />
      <Path
        data="M 0 -8 L -20 -40 M 5 -6 L -5 -45 M 10 -4 L 10 -48 M 15 -2 L 25 -45 M 20 0 L 35 -40"
        stroke="#173D24"
        lineWidth={3.5}
        lineCap="round"
      />
      <Path
        data="M 40 -24 L 20 -55 M 45 -22 L 35 -60 M 50 -20 L 50 -62 M 55 -18 L 65 -58 M 60 -16 L 75 -52"
        stroke="#173D24"
        lineWidth={3.5}
        lineCap="round"
      />

      {/* Pine Needle Tufts - Layer 2 (Lighter Emerald Accent) */}
      <Path
        data="M -30 8 L -45 -15 M -20 10 L -25 -18 M 10 -6 L -2 -35 M 20 -4 L 18 -38 M 50 -20 L 38 -50 M 58 -18 L 56 -52"
        stroke="#235E37"
        lineWidth={2.5}
        lineCap="round"
      />

      {/* Holly Leaf Left */}
      <Path
        data="M -10 15 Q -25 0 -40 8 Q -30 25 -35 40 Q -15 35 -10 15 Z"
        fill="#173D24"
        stroke="#235E37"
        lineWidth={1.5}
      />
      {/* Holly Leaf Right */}
      <Path
        data="M 10 12 Q 25 -3 40 5 Q 30 22 35 37 Q 15 32 10 12 Z"
        fill="#173D24"
        stroke="#235E37"
        lineWidth={1.5}
      />

      {/* Holly Berries Cluster in Vivid Ruby Red */}
      <Circle x={-6} y={16} size={15} fill="#D71920" stroke="#FFD21A" lineWidth={1} />
      <Circle x={-8} y={14} size={4} fill="#FFFFFF" opacity={0.8} />

      <Circle x={8} y={18} size={14} fill="#B8000C" stroke="#FFD21A" lineWidth={1} />
      <Circle x={6} y={16} size={3.5} fill="#FFFFFF" opacity={0.8} />

      <Circle x={0} y={26} size={16} fill="#D71920" stroke="#FFD21A" lineWidth={1} />
      <Circle x={-2} y={24} size={4.5} fill="#FFFFFF" opacity={0.8} />
    </Layout>
  );
}
