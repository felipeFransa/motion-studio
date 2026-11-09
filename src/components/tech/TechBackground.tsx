import {Circle, Gradient, Grid, Line, Node, Rect} from '@motion-canvas/2d';
import {
  createSignal,
  linear,
  type SimpleSignal,
  type ThreadGenerator,
} from '@motion-canvas/core';
import {TECH_MOTION_TOKENS, type TechTokens} from '../../theme/tech-motion';

export interface TechBackgroundOptions {
  readonly tokens?: TechTokens;
  /** Background size. Oversized by default so camera zoom-out never reveals edges. */
  readonly width?: number;
  readonly height?: number;
  /** Number of grid cells across 1080px (4..24). */
  readonly density?: number;
  /** Grid / element color. Defaults to the theme accent. */
  readonly color?: string;
  /** Grid line opacity (0..1). */
  readonly opacity?: number;
  /** Speed multiplier for drift and pulses (0..4). */
  readonly speed?: number;
  /** Movement amplitude (0..1). Defaults to the theme motion intensity. */
  readonly motionIntensity?: number;
  /** Number of luminous dots + scan lines (0..48). */
  readonly elementCount?: number;
  /** Soft radial glows. */
  readonly glow?: boolean;
  /** Layout seed. Same seed => identical frames. */
  readonly seed?: number;
}

export interface TechBackgroundInstance {
  readonly node: Node;
  /** Scene time in seconds (drives every animated property). */
  readonly time: SimpleSignal<number>;
  /** Drives the background for `duration` seconds. Run it in parallel: `yield bg.play(24)`. */
  play(duration: number): ThreadGenerator;
}

function clamp(value: number, min: number, max: number, name: string): number {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`TechBackground: "${name}" must be between ${min} and ${max}.`);
  }
  return value;
}

/**
 * Deterministic pseudo-random in [0,1) — pure function of (index, seed),
 * so every render produces identical frames.
 */
function hash(index: number, seed: number): number {
  const x = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export function TechBackground(options: TechBackgroundOptions = {}): TechBackgroundInstance {
  const tokens = options.tokens ?? TECH_MOTION_TOKENS;
  const width = options.width ?? 1500;
  const height = options.height ?? 2500;
  const density = clamp(options.density ?? 10, 4, 24, 'density');
  const color = options.color ?? tokens.colors.accent;
  const gridOpacity = clamp(options.opacity ?? 0.16, 0, 1, 'opacity');
  const speed = clamp(options.speed ?? 1, 0, 4, 'speed');
  const intensity = clamp(options.motionIntensity ?? tokens.motion.intensity, 0, 1, 'motionIntensity');
  const count = Math.round(clamp(options.elementCount ?? 14, 0, 48, 'elementCount'));
  const glow = options.glow ?? true;
  const seed = options.seed ?? 7;

  const time = createSignal(0);
  const farSpacing = 1080 / density;
  const nearSpacing = farSpacing * 2;

  // Sinusoidal drift (no wrap-around => no visible popping, perfectly smooth).
  const omega = (Math.PI * 2 * speed) / 14;
  const farAmp = farSpacing * 0.45 * intensity;
  const nearAmp = nearSpacing * 0.45 * intensity;
  const farX = () => Math.sin(time() * omega) * farAmp;
  const farY = () => Math.cos(time() * omega * 0.8) * farAmp * 0.7;
  const nearX = () => -Math.sin(time() * omega * 0.9 + 1) * nearAmp;
  const nearY = () => -Math.cos(time() * omega * 0.7 + 1) * nearAmp * 0.7;

  // Luminous dots sit on near-grid intersections and move with that layer.
  const dotCount = Math.ceil(count * 0.6);
  const lineCount = count - dotCount;
  const dots = Array.from({length: dotCount}, (_, i) => {
    const gx = Math.round(((hash(i * 2 + 1, seed) - 0.5) * (width - 200)) / nearSpacing);
    const gy = Math.round(((hash(i * 2 + 2, seed) - 0.5) * (height - 300)) / nearSpacing);
    return {
      x: gx * nearSpacing,
      y: gy * nearSpacing,
      size: 6 + Math.round(hash(i + 50, seed) * 5),
      period: 3 + hash(i + 80, seed) * 4,
      phase: hash(i + 110, seed) * Math.PI * 2,
    };
  });

  // Thin scan lines that glide across the frame and fade at both ends.
  const scans = Array.from({length: lineCount}, (_, i) => ({
    horizontal: i % 2 === 0,
    lane: Math.round((hash(i + 200, seed) - 0.5) * (i % 2 === 0 ? height - 400 : width - 200)),
    period: 9 + hash(i + 230, seed) * 8,
    phase: hash(i + 260, seed),
    length: 260 + Math.round(hash(i + 290, seed) * 260),
  }));

  const glowTop = new Gradient({
    type: 'radial',
    fromRadius: 0,
    toRadius: 620,
    stops: [
      {offset: 0, color: `${tokens.colors.accent}38`},
      {offset: 1, color: `${tokens.colors.accent}00`},
    ],
  });
  const glowBottom = new Gradient({
    type: 'radial',
    fromRadius: 0,
    toRadius: 560,
    stops: [
      {offset: 0, color: `${tokens.colors.accentSecondary}2A`},
      {offset: 1, color: `${tokens.colors.accentSecondary}00`},
    ],
  });

  const node = (
    <Node>
      <Rect width={width} height={height} fill={tokens.colors.background} />

      {glow ? (
        <>
          <Circle
            y={-420}
            size={1240}
            fill={glowTop}
            scale={() => 1 + Math.sin(time() * omega * 0.5) * 0.04 * intensity}
          />
          <Circle
            x={180}
            y={620}
            size={1120}
            fill={glowBottom}
            scale={() => 1 + Math.cos(time() * omega * 0.5) * 0.04 * intensity}
          />
        </>
      ) : null}

      {/* Far grid layer (smaller cells, slower, fainter) */}
      <Grid
        x={farX}
        y={farY}
        width={width + farSpacing * 2}
        height={height + farSpacing * 2}
        spacing={farSpacing}
        stroke={color}
        lineWidth={1}
        opacity={gridOpacity * 0.55}
      />

      {/* Near grid layer (larger cells, opposite drift => parallax depth) */}
      <Node x={nearX} y={nearY}>
        <Grid
          width={width + nearSpacing * 2}
          height={height + nearSpacing * 2}
          spacing={nearSpacing}
          stroke={color}
          lineWidth={1.5}
          opacity={gridOpacity}
        />
        {dots.map((dot, i) => (
          <Node key={`dot-${i}`} x={dot.x} y={dot.y}>
            <Circle
              size={dot.size * 3.2}
              fill={color}
              opacity={() => (0.06 + 0.1 * (0.5 + 0.5 * Math.sin((time() / dot.period) * Math.PI * 2 + dot.phase))) * 1}
            />
            <Circle
              size={dot.size}
              fill={tokens.colors.accentSecondary}
              opacity={() => 0.35 + 0.6 * (0.5 + 0.5 * Math.sin((time() / dot.period) * Math.PI * 2 + dot.phase))}
            />
          </Node>
        ))}
      </Node>

      {scans.map((scan, i) => {
        const travel = scan.horizontal ? width - 200 : height - 300;
        const progress = () => (time() / scan.period + scan.phase) % 1;
        return (
          <Line
            key={`scan-${i}`}
            points={
              scan.horizontal
                ? [
                    [-scan.length / 2, 0],
                    [scan.length / 2, 0],
                  ]
                : [
                    [0, -scan.length / 2],
                    [0, scan.length / 2],
                  ]
            }
            x={() => (scan.horizontal ? (progress() - 0.5) * travel : scan.lane)}
            y={() => (scan.horizontal ? scan.lane : (progress() - 0.5) * travel)}
            stroke={tokens.colors.accentSecondary}
            lineWidth={2}
            lineCap="round"
            opacity={() => Math.sin(progress() * Math.PI) * 0.4 * (0.4 + 0.6 * intensity)}
          />
        );
      })}
    </Node>
  ) as Node;

  return {
    node,
    time,
    *play(duration: number): ThreadGenerator {
      if (!Number.isFinite(duration) || duration <= 0) {
        throw new RangeError('TechBackground: play duration must be positive.');
      }
      time(0);
      yield* time(duration, duration, linear);
    },
  };
}

export const createTechBackground = TechBackground;

