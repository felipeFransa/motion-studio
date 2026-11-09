import {Node} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import {resolveEasing, type EasingName} from './easing';

export interface TransitionOptions {
  delay?: number;
  duration?: number;
  distance?: number;
  scale?: number;
  rotation?: number;
  easing?: EasingName;
}

type OptionsOrDistance = TransitionOptions | number;

function optionsWithDefaults(
  options: OptionsOrDistance | undefined,
  defaults: Required<Pick<TransitionOptions, 'duration' | 'distance' | 'scale' | 'rotation'>>,
): TransitionOptions & typeof defaults {
  return typeof options === 'number'
    ? {...defaults, distance: options}
    : {...defaults, ...options};
}

function* enterFrom(
  element: Node,
  axis: 'x' | 'y',
  offset: number,
  options: TransitionOptions,
): ThreadGenerator {
  const destination = element[axis]();
  const easing = resolveEasing(options.easing);
  element[axis](destination + offset);
  element.opacity(0);
  if (options.delay) {
    yield* waitFor(options.delay);
  }
  yield* all(
    element[axis](destination, options.duration, easing),
    element.opacity(1, options.duration, easing),
  );
}

export function* fadeUp(
  element: Node,
  options: OptionsOrDistance = {},
  duration = 0.7,
  easing?: EasingName,
) {
  const config = optionsWithDefaults(options, {
    duration,
    distance: 60,
    scale: 0.85,
    rotation: 8,
  });
  yield* enterFrom(element, 'y', config.distance, {...config, easing: easing ?? config.easing});
}

export function* fadeDown(
  element: Node,
  options: TransitionOptions = {},
) {
  const config = optionsWithDefaults(options, {
    duration: 0.7,
    distance: 60,
    scale: 0.85,
    rotation: 8,
  });
  yield* enterFrom(element, 'y', -config.distance, config);
}

export function* slideInLeft(
  element: Node,
  options: TransitionOptions = {},
) {
  const config = optionsWithDefaults(options, {
    duration: 0.7,
    distance: 100,
    scale: 0.85,
    rotation: 8,
  });
  yield* enterFrom(element, 'x', -config.distance, config);
}

export function* slideInRight(
  element: Node,
  options: OptionsOrDistance = {},
  duration = 0.7,
  easing?: EasingName,
) {
  const config = optionsWithDefaults(options, {
    duration,
    distance: 100,
    scale: 0.85,
    rotation: 8,
  });
  yield* enterFrom(element, 'x', config.distance, {...config, easing: easing ?? config.easing});
}

export function* slideInUp(
  element: Node,
  options: TransitionOptions = {},
) {
  yield* fadeUp(element, options);
}

export function* slideInDown(
  element: Node,
  options: TransitionOptions = {},
) {
  yield* fadeDown(element, options);
}

export function* scaleIn(
  element: Node,
  options: TransitionOptions | number = {},
  easing?: EasingName,
) {
  const config = typeof options === 'number'
    ? {duration: options, scale: 0.85, easing}
    : {duration: 0.7, scale: 0.85, ...options};
  const scaleX = element.scale.x();
  const scaleY = element.scale.y();
  const timing = resolveEasing(config.easing);
  element.scale([scaleX * config.scale, scaleY * config.scale]);
  element.opacity(0);
  if (config.delay) {
    yield* waitFor(config.delay);
  }
  yield* all(
    element.scale([scaleX, scaleY], config.duration, timing),
    element.opacity(1, config.duration, timing),
  );
}

export function* scaleOut(
  element: Node,
  options: TransitionOptions = {},
) {
  const config = optionsWithDefaults(options, {
    duration: 0.5,
    distance: 0,
    scale: 0.92,
    rotation: 8,
  });
  const timing = resolveEasing(config.easing);
  const scaleX = element.scale.x();
  const scaleY = element.scale.y();
  if (config.delay) {
    yield* waitFor(config.delay);
  }
  yield* all(
    element.scale([scaleX * config.scale, scaleY * config.scale], config.duration, timing),
    element.opacity(0, config.duration, timing),
  );
}

export function* fadeOut(
  element: Node,
  options: TransitionOptions | number = {},
  easing?: EasingName,
) {
  const config = typeof options === 'number'
    ? {duration: options, easing}
    : {duration: 0.5, ...options};
  if (config.delay) {
    yield* waitFor(config.delay);
  }
  yield* element.opacity(0, config.duration, resolveEasing(config.easing));
}

export function* rotateIn(
  element: Node,
  options: TransitionOptions = {},
) {
  const config = optionsWithDefaults(options, {
    duration: 0.7,
    distance: 0,
    scale: 0.85,
    rotation: 8,
  });
  const rotation = element.rotation();
  const timing = resolveEasing(config.easing);
  element.rotation(rotation - config.rotation);
  element.opacity(0);
  if (config.delay) {
    yield* waitFor(config.delay);
  }
  yield* all(
    element.rotation(rotation, config.duration, timing),
    element.opacity(1, config.duration, timing),
  );
}

export function* slideIn(
  element: Node,
  distance = 100,
  duration = 0.7,
  easing?: EasingName,
) {
  yield* slideInRight(element, {distance, duration, easing});
}

export const transitionRegistry = {
  fadeUp,
  fadeDown,
  slideInLeft,
  slideInRight,
  slideInUp,
  slideInDown,
  scaleIn,
  scaleOut,
  fadeOut,
  rotateIn,
} as const;
