import {Circle, Layout, Node, Path, Rect} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';

interface GiftBoxProps {
  lidRef?: Reference<Layout>;
  glowRef?: Reference<Circle>;
  scale?: number;
}

/**
 * Animated Christmas Gift Box
 * Features a textured base with golden ribbon and an animated lid with a lavish bow.
 */
export function GiftBox({lidRef, glowRef, scale = 1}: GiftBoxProps) {
  const boxW = 240;
  const boxH = 180;
  const ribbonW = 32;

  return (
    <Layout scale={scale}>
      {/* Golden Magic Glow Behind Box */}
      <Circle
        ref={glowRef}
        y={-20}
        size={360}
        fill="#FFD21A"
        opacity={0.15}
      />

      {/* Box Base (Container) */}
      <Rect
        y={40}
        width={boxW}
        height={boxH}
        radius={12}
        fill="#B8000C"
        stroke="#FFD21A"
        lineWidth={2.5}
        shadowColor="#17171735"
        shadowBlur={24}
        shadowOffsetY={12}
      >
        {/* Subtle Vertical Inset Pattern */}
        <Rect
          width={boxW - 14}
          height={boxH - 14}
          radius={8}
          stroke="#8A0009"
          lineWidth={1.5}
        />

        {/* Golden Vertical Ribbon on Box */}
        <Rect width={ribbonW} height={boxH} fill="#FFD21A" stroke="#C99700" lineWidth={1}>
          <Rect width={4} height={boxH} fill="#FFFFFF" opacity={0.4} />
        </Rect>

        {/* Golden Horizontal Ribbon on Box */}
        <Rect y={0} width={boxW} height={ribbonW} fill="#FFD21A" stroke="#C99700" lineWidth={1}>
          <Rect width={boxW} height={4} fill="#FFFFFF" opacity={0.4} />
        </Rect>
      </Rect>

      {/* Animated Lid (Tampa) */}
      <Layout ref={lidRef} y={-55}>
        {/* Lid Lip */}
        <Rect
          width={boxW + 24}
          height={48}
          radius={8}
          fill="#D71920"
          stroke="#FFD21A"
          lineWidth={2.5}
          shadowColor="#17171730"
          shadowBlur={16}
          shadowOffsetY={6}
        >
          {/* Golden Ribbon on Lid */}
          <Rect width={ribbonW + 4} height={48} fill="#FFD21A" stroke="#C99700" lineWidth={1}>
            <Rect width={4} height={48} fill="#FFFFFF" opacity={0.4} />
          </Rect>
        </Rect>

        {/* Lavish 3D Bow (Laço de Fita Dourado & Vermelho) */}
        <Layout y={-24}>
          {/* Left Ribbon Loop */}
          <Path
            data="M 0 0 C -45 -40 -65 -20 -40 0 C -25 10 -10 5 0 0 Z"
            fill="#FFD21A"
            stroke="#C99700"
            lineWidth={2}
          />
          <Path
            data="M -5 -3 C -35 -30 -50 -15 -30 0 Z"
            fill="#C99700"
            opacity={0.4}
          />

          {/* Right Ribbon Loop */}
          <Path
            data="M 0 0 C 45 -40 65 -20 40 0 C 25 10 10 5 0 0 Z"
            fill="#FFD21A"
            stroke="#C99700"
            lineWidth={2}
          />
          <Path
            data="M 5 -3 C 35 -30 50 -15 30 0 Z"
            fill="#C99700"
            opacity={0.4}
          />

          {/* Hanging Ribbon Tails */}
          <Path
            data="M -10 4 C -35 30 -50 45 -40 65 L -26 50 C -20 35 -5 20 -10 4 Z"
            fill="#D71920"
            stroke="#FFD21A"
            lineWidth={1.5}
          />
          <Path
            data="M 10 4 C 35 30 50 45 40 65 L 26 50 C 20 35 5 20 10 4 Z"
            fill="#D71920"
            stroke="#FFD21A"
            lineWidth={1.5}
          />

          {/* Central Knot */}
          <Circle size={24} fill="#FFD21A" stroke="#C99700" lineWidth={1.5} />
          <Circle x={-2} y={-2} size={6} fill="#FFFFFF" opacity={0.8} />
        </Layout>
      </Layout>
    </Layout>
  );
}
