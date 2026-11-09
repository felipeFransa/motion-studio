import {Circle, Layout, Path, Rect, Txt} from '@motion-canvas/2d';

interface ChristmasBannerProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  title: string;
  subtitle?: string;
  titleColor?: string;
  fillColor?: string;
  strokeColor?: string;
}

/**
 * Regal Ribbon Christmas Banner
 * Features folded ribbon swallowtail ends and double golden borders.
 */
export function ChristmasBanner({
  x = 0,
  y = 0,
  width = 720,
  height = 90,
  title,
  subtitle,
  titleColor = '#FFD21A',
  fillColor = '#B8000C',
  strokeColor = '#FFD21A',
}: ChristmasBannerProps) {
  const foldWidth = 44;
  const halfW = width / 2;
  const halfH = height / 2;

  return (
    <Layout x={x} y={y}>
      {/* Left Ribbon Swallowtail Behind */}
      <Path
        data={`M ${-halfW} ${-halfH + 12} L ${-halfW - foldWidth} ${-halfH + 4} L ${-halfW - foldWidth + 16} 0 L ${-halfW - foldWidth} ${halfH - 4} L ${-halfW} ${halfH - 12} Z`}
        fill="#8A0009"
        stroke="#C99700"
        lineWidth={1.5}
      />

      {/* Right Ribbon Swallowtail Behind */}
      <Path
        data={`M ${halfW} ${-halfH + 12} L ${halfW + foldWidth} ${-halfH + 4} L ${halfW + foldWidth - 16} 0 L ${halfW + foldWidth} ${halfH - 4} L ${halfW} ${halfH - 12} Z`}
        fill="#8A0009"
        stroke="#C99700"
        lineWidth={1.5}
      />

      {/* Main Banner Rect */}
      <Rect
        width={width}
        height={height}
        radius={8}
        fill={fillColor}
        stroke={strokeColor}
        lineWidth={3}
        shadowColor="#17171728"
        shadowBlur={18}
        shadowOffsetY={6}
      >
        {/* Inner Gold Inset Accent Line */}
        <Rect
          width={width - 12}
          height={height - 12}
          radius={5}
          stroke="#C99700"
          lineWidth={1}
        />

        {/* Decorative corner studs */}
        <Circle x={-halfW + 16} y={-halfH + 16} size={6} fill="#FFD21A" />
        <Circle x={halfW - 16} y={-halfH + 16} size={6} fill="#FFD21A" />
        <Circle x={-halfW + 16} y={halfH - 16} size={6} fill="#FFD21A" />
        <Circle x={halfW - 16} y={halfH - 16} size={6} fill="#FFD21A" />

        {/* Title Text */}
        <Txt
          text={title}
          y={subtitle ? -14 : 0}
          fontFamily="Montserrat"
          fontSize={height > 100 ? 46 : 38}
          fontWeight={900}
          letterSpacing={4}
          fill={titleColor}
        />

        {/* Optional Subtitle Text */}
        {subtitle && (
          <Txt
            text={subtitle}
            y={22}
            fontFamily="Montserrat"
            fontSize={18}
            fontWeight={700}
            letterSpacing={3}
            fill="#FFF8EC"
          />
        )}
      </Rect>
    </Layout>
  );
}
