import {all, type ThreadGenerator} from '@motion-canvas/core';
import {resolveEasing} from '../../animations/easing';
import {wordsIn} from '../../animations/kinetic';
import {staggerScale} from '../../animations/stagger';
import {fadeOut} from '../../animations/transitions';
import type {EasingName} from '../../animations/easing';
import type {KineticTitleDirection, KineticTitleInstance} from './types';

function directionOffset(
  direction: KineticTitleDirection | undefined,
  distance: number,
): {x: number; y: number} {
  switch (direction) {
    case 'left':
      return {x: -distance, y: 0};
    case 'right':
      return {x: distance, y: 0};
    case 'down':
      return {x: 0, y: -distance};
    case 'up':
    default:
      return {x: 0, y: distance};
  }
}

function* editorialReveal(title: KineticTitleInstance): ThreadGenerator {
  const {node, words, options} = title;
  const animation = options.animation;
  const duration = animation.duration;
  const distance = animation.distance;
  const stagger = animation.stagger;
  const easing = resolveEasing(animation.easing);
  const offset = directionOffset(animation.direction, distance);
  const x = node.x();
  const y = node.y();
  node.x(x + offset.x);
  node.y(y + offset.y);

  yield* all(
    node.x(x, duration, easing),
    node.y(y, duration, easing),
    wordsIn(words, {
      duration: Math.min(duration * 0.55, 0.58),
      interval: stagger,
      distance: Math.min(distance * 0.3, 24),
      easing: animation.easing,
    }),
  );
}

function* kineticImpact(title: KineticTitleInstance): ThreadGenerator {
  const {node, words, options} = title;
  const animation = options.animation;
  const duration = animation.duration;
  const stagger = animation.stagger;
  const distance = animation.distance;
  const easing = animation.easing;
  const offset = directionOffset(animation.direction, distance);
  const x = node.x();
  const y = node.y();
  node.x(x + offset.x);
  node.y(y + offset.y);

  yield* all(
    node.x(x, duration, resolveEasing(easing)),
    node.y(y, duration, resolveEasing(easing)),
    staggerScale(words, {
      interval: stagger,
      duration: duration * 0.72,
      scale: 0.68,
      easing,
    }),
  );
}

function* minimalSlide(title: KineticTitleInstance): ThreadGenerator {
  const {node, words, options} = title;
  const animation = options.animation;
  const duration = animation.duration;
  const stagger = animation.stagger;
  const distance = animation.distance;
  const offset = directionOffset(animation.direction, distance);
  const x = node.x();
  const y = node.y();
  node.x(x + offset.x);
  node.y(y + offset.y);

  yield* all(
    node.x(x, duration, resolveEasing(animation.easing)),
    node.y(y, duration, resolveEasing(animation.easing)),
    kineticTextReveal(words, duration, stagger, animation.easing),
  );
}

function* kineticTextReveal(
  words: KineticTitleInstance['words'],
  duration: number,
  stagger: number,
  easing: EasingName | undefined,
): ThreadGenerator {
  yield* wordsIn(words, {
    duration: Math.min(duration * 0.38, 0.36),
    interval: stagger,
    distance: 0,
    easing,
  });
}

export function* playKineticTitle(title: KineticTitleInstance): ThreadGenerator {
  const {node, words, options} = title;
  const x = options.x ?? 0;
  const y = options.y ?? 0;
  node.position([x, y]);
  node.opacity(1);
  for (const word of words) {
    word.opacity(0);
    word.scale(1);
  }

  switch (options.variant ?? 'editorial_reveal') {
    case 'kinetic_impact':
      yield* kineticImpact(title);
      break;
    case 'minimal_slide':
      yield* minimalSlide(title);
      break;
    case 'editorial_reveal':
    default:
      yield* editorialReveal(title);
      break;
  }
}

export function* exitKineticTitle(
  title: KineticTitleInstance,
  duration = 0.35,
): ThreadGenerator {
  if (!Number.isFinite(duration) || duration < 0.05 || duration > 10) {
    throw new RangeError('KineticTitle: exit duration must be between 0.05 and 10 seconds.');
  }
  yield* fadeOut(title.node, {duration, easing: 'easeInOutSine'});
}
