import {Circle, Layout, Path, Rect} from '@motion-canvas/2d';

/**
 * Garland string of Christmas fairy lights.
 * Features a drooped wire with multi-colored festive glowing bulbs.
 */
export function ChristmasLights({y = -860}: {y?: number}) {
  const bulbs = [
    {x: -460, y: 15, color: '#FFD21A'},
    {x: -360, y: 35, color: '#D71920'},
    {x: -260, y: 45, color: '#FFD21A'},
    {x: -160, y: 38, color: '#173D24'},
    {x: -60, y: 22, color: '#D71920'},
    {x: 40, y: 24, color: '#FFD21A'},
    {x: 140, y: 38, color: '#C99700'},
    {x: 240, y: 46, color: '#D71920'},
    {x: 340, y: 36, color: '#FFD21A'},
    {x: 440, y: 16, color: '#173D24'},
  ];

  return (
    <Layout y={y}>
      {/* Decorative Catenary Wire */}
      <Path
        data="M -540 0 Q -270 65 0 20 Q 270 65 540 0"
        stroke="#173D24"
        lineWidth={2.5}
      />

      {/* Hanging Bulbs with Caps and Ambient Halos */}
      {bulbs.map((bulb, i) => (
        <Layout key={String(i)} x={bulb.x} y={bulb.y}>
          {/* Golden Cap Socket */}
          <Rect y={-10} width={7} height={6} radius={1.5} fill="#C99700" />

          {/* Ambient Glow Halo */}
          <Circle size={32} fill={bulb.color} opacity={0.25} />

          {/* Glass Bulb Body */}
          <Path
            data="M -6 -7 Q -8 3 0 10 Q 8 3 6 -7 Z"
            fill={bulb.color}
            stroke="#FFF8EC"
            lineWidth={0.8}
          />

          {/* Specular Glint */}
          <Circle x={-2} y={-1} size={3} fill="#FFFFFF" opacity={0.85} />
        </Layout>
      ))}
    </Layout>
  );
}
