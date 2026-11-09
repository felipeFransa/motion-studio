import {Txt} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import {resolveEasing} from './easing';
import type {StaggerOptions} from './stagger';

export interface KineticOptions extends Pick<
  StaggerOptions,
  'delay' | 'interval' | 'duration' | 'distance' | 'easing'
> {
  scale?: number;
}

function* animateTextParts(
  parts: readonly Txt[],
  options: KineticOptions,
  defaultDistance: number,
  defaultDuration: number,
) {
  if (options.delay) {
    yield* waitFor(options.delay);
  }

  for (let index = 0; index < parts.length; index++) {
    const element = parts[index];
    const destinationY = element.y();
    const scaleX = element.scale.x();
    const scaleY = element.scale.y();
    const distance = options.distance ?? defaultDistance;
    const scale = options.scale ?? 0.98;
    const duration = options.duration ?? defaultDuration;
    const easing = resolveEasing(options.easing);

    element.y(destinationY + distance);
    element.scale([scaleX * scale, scaleY * scale]);
    element.opacity(0);
    yield* all(
      element.y(destinationY, duration, easing),
      element.scale([scaleX, scaleY], duration, easing),
      element.opacity(1, duration, easing),
    );

    if (index < parts.length - 1 && options.interval) {
      yield* waitFor(options.interval);
    }
  }
}

export function* wordsIn(words: readonly Txt[], options: KineticOptions = {}) {
  yield* animateTextParts(words, options, 24, 0.5);
}

export function* charactersIn(characters: readonly Txt[], options: KineticOptions = {}) {
  yield* animateTextParts(characters, {interval: 0.025, ...options}, 12, 0.35);
}

export function* revealProgressively(
  chunks: readonly Txt[],
  options: StaggerOptions = {},
) {
  for (const chunk of chunks) {
    chunk.opacity(0);
  }
  if (options.delay) {
    yield* waitFor(options.delay);
  }

  for (let index = 0; index < chunks.length; index++) {
    yield* chunks[index].opacity(1, options.duration ?? 0.35, resolveEasing(options.easing));
    if (index < chunks.length - 1 && options.interval) {
      yield* waitFor(options.interval);
    }
  }
}

export function* highlightWords(
  words: readonly Txt[],
  color: string,
  options: StaggerOptions = {},
) {
  if (options.delay) {
    yield* waitFor(options.delay);
  }
  for (let index = 0; index < words.length; index++) {
    yield* words[index].fill(color, options.duration ?? 0.4, resolveEasing(options.easing));
    if (index < words.length - 1 && options.interval) {
      yield* waitFor(options.interval);
    }
  }
}

export function* kineticText(
  element: Txt,
  options: KineticOptions = {},
): ThreadGenerator {
  const destination = element.y();
  const scaleX = element.scale.x();
  const scaleY = element.scale.y();
  const distance = options.distance ?? 18;
  const scale = options.scale ?? 0.97;
  const duration = options.duration ?? 0.75;
  const easing = resolveEasing(options.easing ?? 'easeOutQuint');

  element.y(destination + distance);
  element.scale([scaleX * scale, scaleY * scale]);
  element.opacity(0);
  if (options.delay) {
    yield* waitFor(options.delay);
  }
  yield* all(
    element.y(destination, duration, easing),
    element.scale([scaleX, scaleY], duration, easing),
    element.opacity(1, duration, easing),
  );
}

export function* fadeWordIn(
  word: Txt,
  options: KineticOptions = {},
) {
  yield* animateTextParts([word], options, 18, 0.45);
}

export const kineticRegistry = {
  wordsIn,
  charactersIn,
  revealProgressively,
  highlightWords,
  kineticText,
} as const;
