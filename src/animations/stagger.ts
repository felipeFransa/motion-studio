import {Node} from '@motion-canvas/2d';
import {waitFor, type ThreadGenerator} from '@motion-canvas/core';
import {fadeUp, scaleIn, slideInLeft, slideInRight, slideInUp, slideInDown, type TransitionOptions} from './transitions';
import type {EasingName} from './easing';

export type SlideDirection = 'left' | 'right' | 'up' | 'down';

export interface StaggerOptions extends TransitionOptions {
  delay?: number;
  interval?: number;
  direction?: SlideDirection;
}

function* sequenceElements(
  elements: readonly Node[],
  options: StaggerOptions,
  animate: (element: Node, options: TransitionOptions) => ThreadGenerator,
) {
  if (options.delay) {
    yield* waitFor(options.delay);
  }
  const {delay: _delay, interval: _interval, direction: _direction, ...transitionOptions} = options;

  for (let index = 0; index < elements.length; index++) {
    yield* animate(elements[index], transitionOptions);
    if (index < elements.length - 1 && options.interval) {
      yield* waitFor(options.interval);
    }
  }
}

export function* staggerFadeUp(
  elements: readonly Node[],
  options: StaggerOptions = {},
) {
  yield* sequenceElements(elements, options, (element, config) =>
    fadeUp(element, {distance: 60, ...config}),
  );
}

export function* staggerScale(
  elements: readonly Node[],
  options: StaggerOptions = {},
) {
  yield* sequenceElements(elements, options, (element, config) =>
    scaleIn(element, config),
  );
}

export function* staggerSlide(
  elements: readonly Node[],
  options: StaggerOptions = {},
) {
  const distance = options.distance ?? 100;
  const slideAnimations = {
    left: slideInLeft,
    right: slideInRight,
    up: slideInUp,
    down: slideInDown,
  } satisfies Record<SlideDirection, (element: Node, options?: TransitionOptions) => ThreadGenerator>;
  const animate = slideAnimations[options.direction ?? 'right'];

  yield* sequenceElements(elements, options, (element, config) =>
    animate(element, {...config, distance}),
  );
}

export function* staggerFadeIn(
  elements: readonly Node[],
  options: StaggerOptions = {},
) {
  yield* sequenceElements(elements, options, (element, config) =>
    fadeUp(element, {distance: 0, ...config}),
  );
}

export function* stagger(
  elements: readonly Node[],
  delay = 0.2,
  distance = 60,
  easing?: EasingName,
) {
  yield* staggerFadeUp(elements, {interval: delay, distance, duration: 0.6, easing});
}

export const staggerRegistry = {
  staggerFadeUp,
  staggerScale,
  staggerSlide,
  staggerFadeIn,
} as const;
