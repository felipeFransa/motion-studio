import type {Circle, Layout, Rect, Txt} from '@motion-canvas/2d';
import type {ThreadGenerator} from '@motion-canvas/core';
import type {EasingName} from '../../animations/easing';

export type TimelineVariant =
  | 'vertical_timeline'
  | 'horizontal_timeline'
  | 'milestone_cards'
  | 'process_steps';

export type TimelineAlignment = 'left' | 'center' | 'right';
export type TimelineDirection =
  | 'top_to_bottom'
  | 'bottom_to_top'
  | 'left_to_right'
  | 'right_to_left';
export type TimelineMarkerStyle = 'circle' | 'square' | 'diamond';
export type TimelineDateFormat = 'text' | 'year' | 'date';
export type TimelineIconId = 'spark' | 'arrow' | 'dot' | 'diamond' | 'none';

export interface TimelineEventOptions {
  id: string;
  date: string;
  number?: string;
  title: string;
  description: string;
  color?: string;
  icon?: TimelineIconId;
  highlight?: boolean;
  animationDelay?: number;
}

export interface TimelineAnimationOptions {
  duration?: number;
  stagger?: number;
  easing?: EasingName;
}

export interface TimelineOptions {
  component?: 'timeline';
  variant?: TimelineVariant;
  title?: string;
  subtitle?: string;
  events: readonly TimelineEventOptions[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  alignment?: TimelineAlignment;
  showTitle?: boolean;
  showSubtitle?: boolean;
  primaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  duration?: number;
  stagger?: number;
  easing?: EasingName;
  animation?: TimelineAnimationOptions;
  direction?: TimelineDirection;
  connectorWidth?: number;
  markerSize?: number;
  eventSpacing?: number;
  markerStyle?: TimelineMarkerStyle;
  dateFormat?: TimelineDateFormat;
  locale?: string;
  showNumbers?: boolean;
  highlightEventId?: string;
}

export interface ResolvedTimelineEventOptions extends TimelineEventOptions {
  number: string;
  color: string;
  icon: TimelineIconId;
  highlight: boolean;
  animationDelay: number;
}

export interface ResolvedTimelineOptions extends TimelineOptions {
  component: 'timeline';
  variant: TimelineVariant;
  title: string;
  subtitle: string;
  events: readonly ResolvedTimelineEventOptions[];
  x: number;
  y: number;
  width: number;
  height: number;
  alignment: TimelineAlignment;
  showTitle: boolean;
  showSubtitle: boolean;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  duration: number;
  stagger: number;
  easing: EasingName;
  direction: TimelineDirection;
  connectorWidth: number;
  markerSize: number;
  eventSpacing: number;
  markerStyle: TimelineMarkerStyle;
  dateFormat: TimelineDateFormat;
  locale: string;
  showNumbers: boolean;
  highlightEventId: string;
}

export interface TimelineEventParts {
  id: string;
  node: Layout;
  markerGroup: Layout;
  marker: Circle | Rect;
  number: Txt;
  icon: Txt;
  date: Txt;
  title: Txt;
  description: Txt;
  panel?: Rect;
}

export interface TimelineParts {
  root: Layout;
  surface: Rect;
  title: Txt;
  subtitle: Txt;
  connectors: readonly Rect[];
  progressTrack?: Rect;
  progressFill?: Rect;
  events: readonly TimelineEventParts[];
}

export interface TimelineInstance {
  readonly node: Layout;
  readonly options: Readonly<ResolvedTimelineOptions>;
  readonly parts: Readonly<TimelineParts>;
  play(): ThreadGenerator;
  exit(duration?: number): ThreadGenerator;
}
