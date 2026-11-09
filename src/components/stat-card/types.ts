import type {Layout, Rect, Txt, Circle} from '@motion-canvas/2d';
import type {ThreadGenerator} from '@motion-canvas/core';
import type {EasingName} from '../../animations/easing';

export type StatCardVariant =
  | 'editorial_stat'
  | 'counter_impact'
  | 'progress_stat'
  | 'comparison_stat';

export type StatCardAlignment = 'left' | 'center' | 'right';
export type ComparisonMode = 'absolute' | 'percentage';

export interface StatCardAnimationOptions {
  duration?: number;
  easing?: EasingName;
}

export interface StatCardOptions {
  component?: 'stat_card';
  variant?: StatCardVariant;
  value?: number;
  startValue?: number;
  title?: string;
  description?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
  color?: string;
  accentColor?: string;
  backgroundColor?: string;
  progressColor?: string;
  trackColor?: string;
  fontSize?: number;
  alignment?: StatCardAlignment;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  animation?: StatCardAnimationOptions;
  progress?: number;
  previousValue?: number;
  currentValue?: number;
  previousLabel?: string;
  currentLabel?: string;
  comparisonMode?: ComparisonMode;
}

export interface ResolvedStatCardOptions extends StatCardOptions {
  component: 'stat_card';
  variant: StatCardVariant;
  value: number;
  startValue: number;
  title: string;
  description: string;
  prefix: string;
  suffix: string;
  decimals: number;
  locale: string;
  color: string;
  accentColor: string;
  backgroundColor: string;
  progressColor: string;
  trackColor: string;
  fontSize: number;
  alignment: StatCardAlignment;
  x: number;
  y: number;
  width: number;
  height: number;
  animation: Required<StatCardAnimationOptions>;
  progress: number;
  comparisonMode: ComparisonMode;
}

export interface StatCardParts {
  root: Layout;
  surface: Rect;
  accentRule: Rect;
  value: Txt;
  title: Txt;
  description: Txt;
  eyebrow: Txt;
  progressTrack?: Rect;
  progressBar?: Rect;
  progressLabel?: Txt;
  progressMarker?: Circle;
  previousLabel?: Txt;
  previousValue?: Txt;
  previousBar?: Rect;
  currentLabel?: Txt;
  currentValue?: Txt;
  currentBar?: Rect;
  difference?: Txt;
  growthIndicator?: Txt;
}

export interface StatCardInstance {
  readonly node: Layout;
  readonly options: Readonly<ResolvedStatCardOptions>;
  readonly parts: Readonly<StatCardParts>;
  play(): ThreadGenerator;
  exit(duration?: number): ThreadGenerator;
}
