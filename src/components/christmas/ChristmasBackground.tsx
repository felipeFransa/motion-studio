import {Circle, Layout, Path, Rect} from '@motion-canvas/2d';

/**
 * Premium Luxury Christmas Background
 * Warm ivory cream base with subtle ambient glows, vignettes, and festive border framing.
 */
export function ChristmasBackground() {
  return (
    <Layout width={1080} height={1920}>
      {/* Base warm ivory cream */}
      <Rect width={1080} height={1920} fill="#FFF8EC" />

      {/* Ambient warm festive glow in center-top */}
      <Circle y={-350} size={1100} fill="#FFD21A" opacity={0.07} />
      <Circle y={300} size={1000} fill="#D71920" opacity={0.04} />

      {/* Decorative double border framing */}
      <Rect
        width={1020}
        height={1860}
        stroke="#C99700"
        lineWidth={2}
        radius={24}
        opacity={0.35}
      />
      <Rect
        width={1000}
        height={1840}
        stroke="#FFD21A"
        lineWidth={1}
        radius={18}
        opacity={0.45}
      />

      {/* Four corner golden ornaments */}
      <CornerOrnament x={-495} y={-915} rotation={0} />
      <CornerOrnament x={495} y={-915} rotation={90} />
      <CornerOrnament x={495} y={915} rotation={180} />
      <CornerOrnament x={-495} y={915} rotation={270} />
    </Layout>
  );
}

function CornerOrnament({x, y, rotation}: {x: number; y: number; rotation: number}) {
  return (
    <Layout x={x} y={y} rotation={rotation}>
      <Circle size={8} fill="#C99700" />
      <Path
        data="M 0 0 L 28 0 M 0 0 L 0 28"
        stroke="#C99700"
        lineWidth={2}
      />
      <Circle x={28} y={0} size={4} fill="#FFD21A" />
      <Circle x={0} y={28} size={4} fill="#FFD21A" />
    </Layout>
  );
}
