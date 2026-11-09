import type {Circle, Layout, Rect, Txt} from '@motion-canvas/2d';
import type {ThreadGenerator} from '@motion-canvas/core';
import type {EasingName} from '../../animations/easing';

export type FeatureCardsVariant =
  | 'editorial_stack'
  | 'feature_grid'
  | 'spotlight_card'
  | 'sequential_reveal';

export type FeatureCardsAlignment = 'left' | 'center' | 'right';

export type FeatureIconId =
  | 'spark'
  | 'target'
  | 'layers'
  | 'arrow'
  | 'diamond'
  | 'dot'
  | 'none';

export interface FeatureCardOptions {
  id: string;
  number?: string;
  title: string;
  description: string;
  icon?: FeatureIconId;
  color?: string;
  accentColor?: string;
  highlight?: boolean;
  animationDelay?: number;
}

export interface FeatureCardsAnimationOptions {
  duration?: number;
  stagger?: number;
  easing?: EasingName;
}

export interface FeatureCardsOptions {
  component?: 'feature_cards';
  variant?: FeatureCardsVariant;
  title?: string;
  subtitle?: string;
  cards: readonly FeatureCardOptions[];
  maxWidth?: number;
  x?: number;
  y?: number;
  backgroundColor?: string;
  accentColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  duration?: number;
  stagger?: number;
  alignment?: FeatureCardsAlignment;
  easing?: EasingName;
  animation?: FeatureCardsAnimationOptions;
}

export interface ResolvedFeatureCardOptions extends FeatureCardOptions {
  number: string;
  icon: FeatureIconId;
  color: string;
  accentColor: string;
  highlight: boolean;
  animationDelay: number;
}

export interface ResolvedFeatureCardsOptions extends FeatureCardsOptions {
  component: 'feature_cards';
  variant: FeatureCardsVariant;
  title: string;
  subtitle: string;
  cards: readonly ResolvedFeatureCardOptions[];
  maxWidth: number;
  x: number;
  y: number;
  backgroundColor: string;
  accentColor: string;
  primaryColor: string;
  secondaryColor: string;
  duration: number;
  stagger: number;
  alignment: FeatureCardsAlignment;
  easing: EasingName;
  height: number;
}

export interface FeatureCardParts {
  node: Layout;
  surface: Rect;
  accentRule: Rect;
  number: Txt;
  title: Txt;
  description: Txt;
  icon: readonly (Rect | Circle)[];
}

export interface FeatureCardsParts {
  root: Layout;
  surface: Rect;
  title: Txt;
  subtitle: Txt;
  cards: readonly FeatureCardParts[];
}

export interface FeatureCardsInstance {
  readonly node: Layout;
  readonly options: Readonly<ResolvedFeatureCardsOptions>;
  readonly parts: Readonly<FeatureCardsParts>;
  play(): ThreadGenerator;
  exit(duration?: number): ThreadGenerator;
}
