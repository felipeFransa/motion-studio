import {Circle, Layout, Path, Rect, Txt} from '@motion-canvas/2d';

interface ChristmasEmblemProps {
  size?: number;
  showSubtitle?: boolean;
}

/**
 * Coop Ronda Christmas Seal
 * Features a festive vector Santa Hat, golden starburst crest, and security emblem.
 */
export function ChristmasEmblem({size = 200, showSubtitle = true}: ChristmasEmblemProps) {
  const scale = size / 200;

  return (
    <Layout width={size} height={size}>
      {/* Outer Golden Glow & Starburst Ring */}
      <Circle size={size * 1.18} fill="#FFD21A" opacity={0.12} />
      <Circle size={size * 1.05} stroke="#FFD21A" lineWidth={2} opacity={0.4} />

      {/* Main Red Medallion */}
      <Circle
        size={size}
        fill="#B8000C"
        stroke="#FFD21A"
        lineWidth={4 * scale}
        shadowColor="#17171730"
        shadowBlur={20}
        shadowOffsetY={6}
      />

      {/* Inner Inset Golden Ring */}
      <Circle size={size - 18 * scale} stroke="#C99700" lineWidth={1.5 * scale} />

      {/* Stylized Vector Santa Hat (Gorro Natalino) */}
      <Layout y={-10 * scale} scale={scale}>
        {/* Curved Red Cap */}
        <Path
          data="M -48 18 C -40 -35 15 -55 45 -40 C 65 -30 65 -15 55 -5 C 45 5 25 15 -48 18 Z"
          fill="#D71920"
          stroke="#B8000C"
          lineWidth={2}
        />
        {/* Cap Shadow Fold */}
        <Path
          data="M 10 -45 C 35 -35 45 -20 40 5"
          stroke="#8A0009"
          lineWidth={3}
          lineCap="round"
        />

        {/* Fluffy White Trim (Faixa felpuda do gorro) */}
        <Rect
          x={-10}
          y={20}
          width={86}
          height={22}
          radius={11}
          fill="#FFF8EC"
          stroke="#E8E0D3"
          lineWidth={1.5}
        />
        <Circle x={-45} y={20} size={14} fill="#FFF8EC" />
        <Circle x={30} y={20} size={14} fill="#FFF8EC" />

        {/* White Pompom on Tip */}
        <Circle x={58} y={-5} size={22} fill="#FFF8EC" stroke="#E8E0D3" lineWidth={1.5} />
        <Circle x={58} y={-5} size={28} fill="#FFD21A" opacity={0.2} />

        {/* Star Badge on Hat */}
        <Path
          data="M -10 0 L -8 6 L -2 7 L -7 11 L -5 17 L -10 13 L -15 17 L -13 11 L -18 7 L -12 6 Z"
          fill="#FFD21A"
          stroke="#C99700"
          lineWidth={0.8}
        />
      </Layout>

      {/* Brand Name Ribbon Under Hat */}
      <Rect
        y={48 * scale}
        width={140 * scale}
        height={26 * scale}
        radius={13 * scale}
        fill="#FFD21A"
        stroke="#C99700"
        lineWidth={1 * scale}
      >
        <Txt
          text="COOP RONDA"
          fontFamily="Montserrat"
          fontSize={13 * scale}
          fontWeight={900}
          letterSpacing={2 * scale}
          fill="#171717"
        />
      </Rect>

      {showSubtitle && (
        <Txt
          text="DESDE 2010"
          y={72 * scale}
          fontFamily="Montserrat"
          fontSize={10 * scale}
          fontWeight={700}
          letterSpacing={2 * scale}
          fill="#FFF8EC"
          opacity={0.85}
        />
      )}
    </Layout>
  );
}
