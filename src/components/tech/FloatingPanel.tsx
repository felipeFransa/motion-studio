import {Layout, Line, Node, Rect} from '@motion-canvas/2d';
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

export interface FloatingPanelOptions {
  readonly tokens?: TechTokens;
  readonly x?: number;
  readonly y?: number;
  readonly width?: number;
  readonly height?: number;
  readonly radius?: number;
  readonly surfaceColor?: string;
  readonly surfaceOpacity?: number;
  readonly borderColor?: string;
  readonly borderWidth?: number;
  /** Simulated depth level: 1 (near), 2 (mid), 3 (far). Affects base scale and drift amplitude. */
  readonly depth?: 1 | 2 | 3;
  /** Whether to render a discrete luminous accent hairline on top. */
  readonly accentHighlight?: boolean;
  /** Primary accent highlight color. */
  readonly accentColor?: string;
  /** Content children nodes. */
  readonly children?: Node[];
}

export interface FloatingPanelInstance {
  readonly node: Rect;
  readonly content: Node;
  readonly basePosition: {x: number; y: number};
  readonly depth: 1 | 2 | 3;
  readonly baseY: SimpleSignal<number>;
  /** Entra suavemente com deslocamento vertical e fade. */
  enter(duration?: number, offset?: number): ThreadGenerator;
  /** Animação contínua e determinística de flutuação vertical sutil. */
  floatDrift(duration: number, amplitude?: number, period?: number): ThreadGenerator;
  /** Saída suave animada. */
  exit(duration?: number, offset?: number): ThreadGenerator;
}

export function createFloatingPanel(options: FloatingPanelOptions = {}): FloatingPanelInstance {
  const tokens = options.tokens ?? TECH_MOTION_TOKENS;
  const depth = options.depth ?? 2;
  const initialX = options.x ?? 0;
  const initialY = options.y ?? 0;
  const width = options.width ?? 600;
  const height = options.height ?? 380;
  const radius = options.radius ?? tokens.radii.lg;
  const surfaceColor = options.surfaceColor ?? tokens.colors.surface;
  const surfaceOpacity = options.surfaceOpacity ?? tokens.surface.opacity;
  const borderColor = options.borderColor ?? tokens.colors.border;
  const borderWidth = options.borderWidth ?? 1.5;
  const accentColor = options.accentColor ?? tokens.colors.accent;
  const accentHighlight = options.accentHighlight ?? true;

  // Depth scale: 1 is slightly larger (1.02), 2 is neutral (1.0), 3 is slightly recessed (0.95)
  const baseScale = depth === 1 ? 1.02 : depth === 3 ? 0.94 : 1.0;

  const baseY = createSignal(initialY);

  const content = new Node({});

  if (options.children && options.children.length > 0) {
    for (const child of options.children) {
      content.add(child);
    }
  }

  const root = new Rect({
    layout: false,
    x: initialX,
    y: baseY,
    width,
    height,
    radius,
    fill: surfaceColor,
    opacity: 0,
    scale: baseScale * 0.94,
    stroke: borderColor,
    lineWidth: borderWidth,
  });

  // Top highlight line for simulated tech edge lighting
  if (accentHighlight) {
    const halfW = width / 2;
    const halfH = height / 2;
    const highlightLine = new Line({
      points: [
        [-halfW + radius, -halfH + 1],
        [halfW - radius, -halfH + 1],
      ],
      stroke: accentColor,
      lineWidth: 2,
      opacity: depth === 1 ? 0.8 : depth === 2 ? 0.5 : 0.25,
    });
    root.add(highlightLine);
  }

  root.add(content);

  const instance: FloatingPanelInstance = {
    node: root,
    content,
    basePosition: {x: initialX, y: initialY},
    depth,
    baseY,
    *enter(duration = 0.8, offset = 60): ThreadGenerator {
      root.y(initialY + offset);
      root.opacity(0);
      root.scale(baseScale * 0.93);

      yield* all(
        root.opacity(surfaceOpacity, duration * 0.85, easeOutCubic),
        root.y(initialY, duration, easeOutCubic),
        root.scale(baseScale, duration, easeOutCubic),
      );
    },
    *floatDrift(duration: number, amplitude = 8, period = 3.6): ThreadGenerator {
      const amp = amplitude * (depth === 1 ? 1.2 : depth === 3 ? 0.7 : 1.0);
      const cycles = Math.max(1, Math.round(duration / period));
      const stepDuration = duration / (cycles * 2);

      for (let i = 0; i < cycles; i++) {
        yield* root.y(initialY - amp, stepDuration, easeInOutSine);
        yield* root.y(initialY + amp, stepDuration, easeInOutSine);
      }
      yield* root.y(initialY, 0.4, easeInOutSine);
    },
    *exit(duration = 0.6, offset = -40): ThreadGenerator {
      yield* all(
        root.opacity(0, duration, easeInOutCubic),
        root.y(initialY + offset, duration, easeInOutCubic),
        root.scale(baseScale * 0.94, duration, easeInOutCubic),
      );
    },
  };

  return instance;
}
