import {
  Circle,
  Layout,
  Line,
  Node,
  Rect,
  Txt,
} from '@motion-canvas/2d';
import {
  all,
  createSignal,
  easeInOutCubic,
  easeInOutSine,
  easeOutCubic,
  type SimpleSignal,
  type ThreadGenerator,
} from '@motion-canvas/core';
import {TECH_MOTION_TOKENS, type TechTokens} from '../../theme/tech-motion';

export interface UICardData {
  readonly label: string;
  readonly value: string;
  readonly trend?: string;
  readonly trendPositive?: boolean;
}

export interface UIIndicatorData {
  readonly label: string;
  readonly percentage: number; // 0 to 100
  readonly valueText?: string;
  readonly color?: string;
}

export interface UIChartBarData {
  readonly label: string;
  readonly value: number; // 0 to 100
  readonly highlighted?: boolean;
}

export interface UIMockupOptions {
  readonly tokens?: TechTokens;
  readonly title?: string;
  readonly subtitle?: string;
  readonly badge?: string;
  readonly width?: number;
  readonly height?: number;
  readonly x?: number;
  readonly y?: number;
  readonly cards?: readonly UICardData[];
  readonly indicators?: readonly UIIndicatorData[];
  readonly chartBars?: readonly UIChartBarData[];
  readonly actionButtonText?: string;
  readonly animationPreset?: 'slide_up' | 'scale_in' | 'fade_in';
}

export interface UIMockupInstance {
  readonly node: Rect;
  readonly contentArea: Node;
  enter(duration?: number): ThreadGenerator;
  animateMetrics(duration?: number): ThreadGenerator;
  exit(duration?: number): ThreadGenerator;
}

export function createUIMockup(options: UIMockupOptions = {}): UIMockupInstance {
  const tokens = options.tokens ?? TECH_MOTION_TOKENS;
  const width = options.width ?? 680;
  const height = options.height ?? 460;
  const initialX = options.x ?? 0;
  const initialY = options.y ?? 0;
  const title = options.title ?? 'SYSTEM OVERVIEW';
  const subtitle = options.subtitle ?? 'ENGINE V2.4';
  const badge = options.badge ?? 'ONLINE';

  const root = new Rect({
    layout: false,
    x: initialX,
    y: initialY,
    width,
    height,
    radius: tokens.radii.lg,
    fill: tokens.colors.surface,
    stroke: tokens.colors.border,
    lineWidth: 1.5,
    opacity: 0,
    scale: 0.94,
  });

  // Top accent luminous edge
  const topEdge = new Line({
    points: [
      [-width / 2 + tokens.radii.lg, -height / 2 + 1],
      [width / 2 - tokens.radii.lg, -height / 2 + 1],
    ],
    stroke: tokens.colors.accent,
    lineWidth: 2,
    opacity: 0.7,
  });
  root.add(topEdge);

  // -------------------------------------------------------------
  // Header bar
  // -------------------------------------------------------------
  const headerHeight = 52;
  const headerY = -height / 2 + headerHeight / 2;
  const header = new Rect({
    layout: false,
    x: 0,
    y: headerY,
    width,
    height: headerHeight,
    fill: '#101726',
  });

  // Window controls (traffic lights)
  const dotXStart = -width / 2 + 24;
  const dotY = 0;
  const dotSpacing = 16;
  const dotColors = ['#EF4444', '#F59E0B', '#10B981'];
  for (let i = 0; i < 3; i++) {
    header.add(
      new Circle({
        x: dotXStart + i * dotSpacing,
        y: dotY,
        size: 9,
        fill: dotColors[i],
        opacity: 0.85,
      }),
    );
  }

  // Header Title
  header.add(
    new Txt({
      text: title,
      x: 0,
      y: 0,
      fontFamily: tokens.typography.mono,
      fontSize: 14,
      fontWeight: 600,
      fill: tokens.colors.textPrimary,
      letterSpacing: 2,
    }),
  );

  // Header Badge (right side)
  if (badge) {
    const badgeLayout = new Rect({
      layout: false,
      x: width / 2 - 64,
      y: 0,
      width: 76,
      height: 24,
      radius: tokens.radii.full,
      fill: 'rgba(34, 197, 94, 0.12)',
      stroke: 'rgba(34, 197, 94, 0.4)',
      lineWidth: 1,
    });
    badgeLayout.add(
      new Circle({
        x: -24,
        y: 0,
        size: 6,
        fill: '#22C55E',
      }),
    );
    badgeLayout.add(
      new Txt({
        text: badge,
        x: 6,
        y: 0,
        fontFamily: tokens.typography.mono,
        fontSize: 11,
        fontWeight: 600,
        fill: '#4ADE80',
        letterSpacing: 1,
      }),
    );
    header.add(badgeLayout);
  }

  // Header bottom border
  header.add(
    new Line({
      points: [
        [-width / 2, headerHeight / 2],
        [width / 2, headerHeight / 2],
      ],
      stroke: tokens.colors.border,
      lineWidth: 1,
      opacity: 0.6,
    }),
  );

  root.add(header);

  // -------------------------------------------------------------
  // Content Area
  // -------------------------------------------------------------
  const contentHeight = height - headerHeight;
  const contentY = headerY + headerHeight / 2 + contentHeight / 2;
  const contentArea = new Node({position: [0, contentY]});
  root.add(contentArea);

  // Track signals for metric animations
  const progressSignals: {signal: SimpleSignal<number>; target: number; rect: Rect; maxWidth: number}[] = [];
  const barSignals: {signal: SimpleSignal<number>; target: number; rect: Rect; maxHeight: number}[] = [];

  // If subtitle provided, add a sub-header
  if (subtitle) {
    contentArea.add(
      new Txt({
        text: subtitle,
        x: -width / 2 + 40,
        y: -contentHeight / 2 + 28,
        fontFamily: tokens.typography.mono,
        fontSize: 12,
        fill: tokens.colors.textSecondary,
        letterSpacing: 1.5,
      }),
    );
  }

  // Render Metric Cards (2 cards side by side)
  const cards = options.cards ?? [
    {label: 'PROCESSAMENTO', value: '1.240 fps', trend: '+18.4%', trendPositive: true},
    {label: 'LATÊNCIA MÉDIA', value: '4.2 ms', trend: '-24.0%', trendPositive: true},
  ];

  const cardWidth = (width - 72) / cards.length;
  const cardHeight = 96;
  const cardY = -contentHeight / 2 + 84;

  cards.forEach((card, index) => {
    const cardX = -width / 2 + 36 + cardWidth / 2 + index * (cardWidth + 16);
    const cardRect = new Rect({
      layout: false,
      x: cardX,
      y: cardY,
      width: cardWidth,
      height: cardHeight,
      radius: tokens.radii.md,
      fill: '#182136',
      stroke: tokens.colors.border,
      lineWidth: 1,
    });

    // Label
    cardRect.add(
      new Txt({
        text: card.label,
        offset: [-1, 0],
        x: -cardWidth / 2 + 16,
        y: -22,
        fontFamily: tokens.typography.body,
        fontSize: 11,
        fontWeight: 500,
        fill: tokens.colors.textSecondary,
        letterSpacing: 1,
      }),
    );

    // Value
    cardRect.add(
      new Txt({
        text: card.value,
        offset: [-1, 0],
        x: -cardWidth / 2 + 16,
        y: 14,
        fontFamily: tokens.typography.heading,
        fontSize: 20,
        fontWeight: 700,
        fill: tokens.colors.textPrimary,
      }),
    );

    // Trend badge
    if (card.trend) {
      const isPos = card.trendPositive !== false;
      const trendColor = isPos ? '#38BDF8' : '#F43F5E';
      cardRect.add(
        new Txt({
          text: card.trend,
          offset: [1, 0],
          x: cardWidth / 2 - 16,
          y: 14,
          fontFamily: tokens.typography.mono,
          fontSize: 11,
          fontWeight: 600,
          fill: trendColor,
          letterSpacing: 0.5,
        }),
      );
    }

    contentArea.add(cardRect);
  });

  // Render Indicators / Progress Bars
  const indicators = options.indicators ?? [
    {label: 'GPU WORKLOAD', percentage: 78, valueText: '78%', color: tokens.colors.accent},
    {label: 'MEMORY CACHE', percentage: 46, valueText: '46%', color: tokens.colors.accentSecondary},
  ];

  const barYStart = cardY + cardHeight / 2 + 40;
  const barWidth = width - 72;
  const barHeight = 8;

  indicators.forEach((ind, index) => {
    const yPos = barYStart + index * 42;

    // Label row
    contentArea.add(
      new Txt({
        text: ind.label,
        x: -barWidth / 2,
        y: yPos - 12,
        fontFamily: tokens.typography.mono,
        fontSize: 11,
        fontWeight: 600,
        fill: tokens.colors.textSecondary,
        letterSpacing: 1,
        textAlign: 'left',
      }),
    );

    contentArea.add(
      new Txt({
        text: ind.valueText ?? `${ind.percentage}%`,
        x: barWidth / 2,
        y: yPos - 12,
        fontFamily: tokens.typography.mono,
        fontSize: 11,
        fontWeight: 600,
        fill: ind.color ?? tokens.colors.accent,
        letterSpacing: 1,
        textAlign: 'right',
      }),
    );

    // Track
    const track = new Rect({
      layout: false,
      x: 0,
      y: yPos + 6,
      width: barWidth,
      height: barHeight,
      radius: tokens.radii.full,
      fill: '#1F2B44',
    });

    // Fill signal
    const fillSig = createSignal(0);
    const fillRect = new Rect({
      x: () => -barWidth / 2 + (barWidth * (fillSig() / 100)) / 2,
      y: 0,
      width: () => Math.max(0, barWidth * (fillSig() / 100)),
      height: barHeight,
      radius: tokens.radii.full,
      fill: ind.color ?? tokens.colors.accent,
    });
    track.add(fillRect);
    contentArea.add(track);

    progressSignals.push({
      signal: fillSig,
      target: ind.percentage,
      rect: fillRect,
      maxWidth: barWidth,
    });
  });

  // Render Chart Bars (5 vertical bars) if height permits
  const chartBars = options.chartBars ?? [
    {label: '01', value: 35},
    {label: '02', value: 60},
    {label: '03', value: 92, highlighted: true},
    {label: '04', value: 74},
    {label: '05', value: 85},
    {label: '06', value: 50},
  ];

  if (height >= 440) {
    const chartY = barYStart + indicators.length * 42 + 48;
    const chartMaxH = 50;
    const barW = 28;
    const totalBarsW = chartBars.length * (barW + 16);

    chartBars.forEach((bar, idx) => {
      const bx = -totalBarsW / 2 + idx * (barW + 16) + barW / 2;
      const barSig = createSignal(0);

      // Track slot
      contentArea.add(
        new Rect({
          x: bx,
          y: chartY,
          width: barW,
          height: chartMaxH,
          radius: 4,
          fill: '#151D2F',
        }),
      );

      // Animated fill
      const barRect = new Rect({
        x: bx,
        y: () => chartY + (chartMaxH / 2) - (chartMaxH * (barSig() / 100)) / 2,
        width: barW,
        height: () => Math.max(0, chartMaxH * (barSig() / 100)),
        radius: 4,
        fill: bar.highlighted ? tokens.colors.accentSecondary : tokens.colors.accent,
        opacity: bar.highlighted ? 1.0 : 0.65,
      });
      contentArea.add(barRect);

      barSignals.push({
        signal: barSig,
        target: bar.value,
        rect: barRect,
        maxHeight: chartMaxH,
      });
    });
  }

  // Action button (bottom)
  if (options.actionButtonText) {
    const btnY = contentHeight / 2 - 28;
    const btn = new Rect({
      layout: false,
      x: 0,
      y: btnY,
      width: 220,
      height: 38,
      radius: tokens.radii.sm,
      fill: 'rgba(56, 189, 248, 0.12)',
      stroke: tokens.colors.accent,
      lineWidth: 1.5,
    });
    btn.add(
      new Txt({
        text: options.actionButtonText,
        x: 0,
        y: 0,
        fontFamily: tokens.typography.mono,
        fontSize: 12,
        fontWeight: 600,
        fill: tokens.colors.accent,
        letterSpacing: 2,
      }),
    );
    contentArea.add(btn);
  }

  const instance: UIMockupInstance = {
    node: root,
    contentArea,
    *enter(duration = 0.85): ThreadGenerator {
      root.y(initialY + 50);
      root.opacity(0);
      root.scale(0.92);

      yield* all(
        root.opacity(1, duration * 0.8, easeOutCubic),
        root.y(initialY, duration, easeOutCubic),
        root.scale(1.0, duration, easeOutCubic),
        ...progressSignals.map((p) => p.signal(p.target, duration * 0.9, easeOutCubic)),
        ...barSignals.map((b) => b.signal(b.target, duration * 0.9, easeOutCubic)),
      );
    },
    *animateMetrics(duration = 1.2): ThreadGenerator {
      yield* all(
        ...progressSignals.map((p) => p.signal(Math.min(100, p.target + 10), duration, easeInOutSine)),
        ...barSignals.map((b) => b.signal(Math.min(100, b.target + 8), duration, easeInOutSine)),
      );
    },
    *exit(duration = 0.6): ThreadGenerator {
      yield* all(
        root.opacity(0, duration, easeInOutCubic),
        root.y(initialY - 40, duration, easeInOutCubic),
        root.scale(0.94, duration, easeInOutCubic),
      );
    },
  };

  return instance;
}
