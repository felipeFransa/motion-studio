import type {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {ThreadGenerator} from '@motion-canvas/core';
import type {EasingName} from '../../animations/easing';

export type ComparisonVariant = 'before_after' | 'versus' | 'data_comparison';
export type ComparisonAlignment = 'left' | 'center' | 'right';
export type ComparisonSide = 'left' | 'right' | 'none';
export type ComparisonMode = 'absolute' | 'percentage';
export type ComparisonChartOrientation = 'horizontal' | 'vertical';
export type ComparisonValueFormat = 'number' | 'currency' | 'percent';

export interface ComparisonSideInput {
  label?: string;
  title?: string;
  description?: string;
  value?: number;
  color?: string;
}

export interface ComparisonAnimationOptions {
  duration?: number;
  easing?: EasingName;
}

export interface ComparisonOptions {
  component?: 'comparison';
  variant?: ComparisonVariant;
  title?: string;
  subtitle?: string;
  alignment?: ComparisonAlignment;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  accentColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  duration?: number;
  easing?: EasingName;
  animation?: ComparisonAnimationOptions;
  left?: ComparisonSideInput;
  right?: ComparisonSideInput;
  leftLabel?: string;
  rightLabel?: string;
  leftTitle?: string;
  rightTitle?: string;
  leftDescription?: string;
  rightDescription?: string;
  leftValue?: number;
  rightValue?: number;
  leftColor?: string;
  rightColor?: string;
  highlightSide?: ComparisonSide;
  beforeLabel?: string;
  afterLabel?: string;
  beforeDescription?: string;
  afterDescription?: string;
  valueFormat?: ComparisonValueFormat;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  locale?: string;
  comparisonMode?: ComparisonMode;
  showDifference?: boolean;
  showPercentageChange?: boolean;
  chartOrientation?: ComparisonChartOrientation;
  highlightResult?: 'higher' | 'lower' | 'none';
}

export interface ResolvedComparisonOptions extends ComparisonOptions {
  component: 'comparison';
  variant: ComparisonVariant;
  title: string;
  subtitle: string;
  alignment: ComparisonAlignment;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  accentColor: string;
  primaryColor: string;
  secondaryColor: string;
  duration: number;
  easing: EasingName;
  leftLabel: string;
  rightLabel: string;
  leftTitle: string;
  rightTitle: string;
  leftDescription: string;
  rightDescription: string;
  leftColor: string;
  rightColor: string;
  highlightSide: ComparisonSide;
  valueFormat: ComparisonValueFormat;
  prefix: string;
  suffix: string;
  decimals: number;
  locale: string;
  comparisonMode: ComparisonMode;
  showDifference: boolean;
  showPercentageChange: boolean;
  chartOrientation: ComparisonChartOrientation;
  highlightResult: 'higher' | 'lower' | 'none';
  leftValue?: number;
  rightValue?: number;
}

export interface ComparisonParts {
  root: Layout;
  surface: Rect;
  title: Txt;
  subtitle: Txt;
  leftPanel: Rect;
  rightPanel: Rect;
  leftLabel: Txt;
  rightLabel: Txt;
  leftTitle: Txt;
  rightTitle: Txt;
  leftDescription: Txt;
  rightDescription: Txt;
  divider: Rect;
  centerMark: Txt;
  leftValue?: Txt;
  rightValue?: Txt;
  leftTrack?: Rect;
  rightTrack?: Rect;
  leftBar?: Rect;
  rightBar?: Rect;
  baseline?: Rect;
  difference?: Txt;
  percentageChange?: Txt;
}

export interface ComparisonInstance {
  readonly node: Layout;
  readonly options: Readonly<ResolvedComparisonOptions>;
  readonly parts: Readonly<ComparisonParts>;
  play(): ThreadGenerator;
  exit(duration?: number): ThreadGenerator;
}
