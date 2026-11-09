import {Circle, Layout, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, type ThreadGenerator, waitFor} from '@motion-canvas/core';
import {KineticTitle} from '../components/kinetic-title';
import {StatCard} from '../components/stat-card';
import type {TemplateContext, TemplateDefinition} from './types';

export interface StatSpotlightData {
  titleText: string;
  highlightWord: string;
  statValue: number;
  statSuffix?: string;
  statTitle: string;
  statDescription: string;
}

export interface StatSpotlightNodes {
  readonly root: Layout;
  readonly background: Rect;
  readonly brandHeader: Layout;
  readonly titleNode: Layout;
  readonly statNode: Layout;
  readonly footerRule: Rect;
  readonly footerText: Txt;
  play(): ThreadGenerator;
  exit(): ThreadGenerator;
}

export function createStatSpotlight(
  context: TemplateContext<StatSpotlightData>,
): StatSpotlightNodes {
  const {brand, niche, theme, config} = context;
  const data = config.contentData;

  const root = createRef<Layout>();
  const background = createRef<Rect>();
  const brandPill = createRef<Rect>();
  const footerRule = createRef<Rect>();
  const footerText = createRef<Txt>();

  // 1. KineticTitle configured via Theme
  const titleInstance = KineticTitle(
    theme.forKineticTitle({
      text: data.titleText,
      highlightWords: [data.highlightWord],
      y: -440,
      fontSize: 72,
    }),
  );

  // 2. StatCard configured via Theme
  const statInstance = StatCard(
    theme.forStatCard({
      value: data.statValue,
      suffix: data.statSuffix ?? '%',
      title: data.statTitle,
      description: data.statDescription,
      y: 110,
      width: 900,
      height: 520,
      fontSize: 124,
    }),
  );

  const container = (
    <Layout ref={root} opacity={0}>
      {/* Background themed */}
      <Rect
        ref={background}
        width={1080}
        height={1920}
        fill={theme.palette.background}
      />

      {/* Dynamic Brand Pill Header */}
      <Rect
        ref={brandPill}
        y={-700}
        width={560}
        height={46}
        radius={23}
        fill={theme.palette.surface}
        stroke={theme.palette.border}
        lineWidth={1.5}
        opacity={0}
      >
        <Circle x={-230} y={0} size={12} fill={theme.palette.primary} />
        <Txt
          text={brand.name.toUpperCase()}
          x={-50}
          y={0}
          fontFamily={theme.typography.fontFamily}
          fontSize={18}
          fontWeight={theme.typography.headingWeight}
          letterSpacing={2.5}
          fill={theme.palette.textPrimary}
        />
        <Rect x={130} y={0} width={2} height={18} fill={theme.palette.border} />
        <Txt
          text={niche.name.split('&')[0].trim().toUpperCase()}
          x={195}
          y={0}
          fontFamily={theme.typography.fontFamily}
          fontSize={15}
          fontWeight={700}
          letterSpacing={2}
          fill={theme.palette.primary}
        />
      </Rect>

      {/* Injected Component Nodes */}
      {titleInstance.node}
      {statInstance.node}

      {/* Dynamic Themed Footer */}
      <Rect
        ref={footerRule}
        x={0}
        y={760}
        width={90}
        height={2}
        radius={1}
        fill={theme.palette.border}
        opacity={0}
      />
      <Txt
        ref={footerText}
        text={`${brand.name.toUpperCase()}  •  MOTION STUDIO`}
        x={0}
        y={800}
        fontFamily={theme.typography.fontFamily}
        fontSize={16}
        fontWeight={700}
        letterSpacing={3}
        fill={theme.palette.textSecondary}
        opacity={0}
      />
    </Layout>
  );

  return {
    root: root(),
    background: background(),
    brandHeader: brandPill(),
    titleNode: titleInstance.node,
    statNode: statInstance.node,
    footerRule: footerRule(),
    footerText: footerText(),

    *play(): ThreadGenerator {
      // Fade in root container
      root().opacity(1);
      yield* all(
        brandPill().opacity(1, 0.45),
        footerRule().opacity(1, 0.45),
        footerText().opacity(1, 0.45),
        titleInstance.play(),
      );
      yield* waitFor(0.1);
      yield* statInstance.play();
    },

    *exit(): ThreadGenerator {
      yield* all(
        root().opacity(0, 0.4),
      );
    },
  };
}
