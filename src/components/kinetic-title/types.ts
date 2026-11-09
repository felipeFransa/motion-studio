import type {Layout, Txt} from '@motion-canvas/2d';
import type {ThreadGenerator} from '@motion-canvas/core';
import type {EasingName} from '../../animations/easing';

export type KineticTitleVariant =
  | 'editorial_reveal'
  | 'kinetic_impact'
  | 'minimal_slide';

export type KineticTitleAlignment = 'left' | 'center' | 'right';
export type KineticTitleDirection = 'left' | 'right' | 'up' | 'down';

export interface KineticTitleAnimationOptions {
  duration?: number;
  stagger?: number;
  distance?: number;
  easing?: EasingName;
  direction?: KineticTitleDirection;
}

export interface KineticTitleOptions {
  component?: 'kinetic_title';
  variant?: KineticTitleVariant;
  text: string;
  highlightWords?: readonly string[];
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  color?: string;
  highlightColor?: string;
  alignment?: KineticTitleAlignment;
  x?: number;
  y?: number;
  maxWidth?: number;
  letterSpacing?: number;
  animation?: KineticTitleAnimationOptions;
}

export interface ResolvedKineticTitleOptions extends KineticTitleOptions {
  component: 'kinetic_title';
  variant: KineticTitleVariant;
  highlightWords: readonly string[];
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  color: string;
  highlightColor: string;
  alignment: KineticTitleAlignment;
  x: number;
  y: number;
  maxWidth: number;
  letterSpacing: number;
  animation: Required<KineticTitleAnimationOptions>;
}

export interface KineticTitleInstance {
  readonly node: Layout;
  readonly words: readonly Txt[];
  readonly options: Readonly<ResolvedKineticTitleOptions>;
  play(): ThreadGenerator;
  exit(duration?: number): ThreadGenerator;
}
