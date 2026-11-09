import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import {staggerFadeUp} from '../../animations/stagger';
import {fadeOut, fadeUp, scaleIn, slideInLeft, slideInRight, slideInUp} from '../../animations/transitions';
import type {FeatureCardParts, FeatureCardsInstance} from './types';

function* revealCardContent(
  card: FeatureCardParts,
  duration: number,
  easing: FeatureCardsInstance['options']['easing'],
): ThreadGenerator {
  card.surface.opacity(1);
  card.accentRule.opacity(1);
  yield* all(
    fadeUp(card.number, {distance: 8, duration: duration * 0.55, easing}),
    fadeUp(card.title, {distance: 12, duration: duration * 0.62, delay: 0.05, easing}),
    fadeUp(card.description, {distance: 10, duration: duration * 0.62, delay: 0.1, easing}),
    ...card.icon.map((element, index) =>
      fadeUp(element, {distance: 5, duration: duration * 0.5, delay: index * 0.025, easing}),
    ),
  );
}

function* playEditorialStack(comparison: FeatureCardsInstance): ThreadGenerator {
  const {parts, options} = comparison;
  yield* staggerFadeUp(
    parts.cards.map((card) => card.node),
    {
      interval: options.stagger,
      distance: 24,
      duration: options.duration,
      easing: options.easing,
    },
  );
  yield* all(...parts.cards.map((card) => revealCardContent(card, options.duration * 0.65, options.easing)));
}

function* playFeatureGrid(comparison: FeatureCardsInstance): ThreadGenerator {
  const {parts, options} = comparison;
  for (let index = 0; index < parts.cards.length; index++) {
    const card = parts.cards[index];
    if (card === undefined) continue;
    const customDelay = options.cards[index]?.animationDelay ?? 0;
    if (customDelay > 0) yield* waitFor(customDelay);
    yield* all(
      index % 2 === 0
        ? slideInLeft(card.node, {distance: 30, duration: options.duration, easing: options.easing})
        : slideInRight(card.node, {distance: 30, duration: options.duration, easing: options.easing}),
      revealCardContent(card, options.duration * 0.65, options.easing),
    );
    if (index < parts.cards.length - 1) yield* waitFor(options.stagger);
  }
}

function* playSpotlight(comparison: FeatureCardsInstance): ThreadGenerator {
  const {parts, options} = comparison;
  const [hero, ...secondary] = parts.cards;
  if (!hero) throw new Error('FeatureCards: spotlight_card requires a primary card.');
  const primaryDelay = options.cards[0]?.animationDelay ?? 0;
  if (primaryDelay > 0) yield* waitFor(primaryDelay);
  yield* all(
    scaleIn(hero.node, {duration: options.duration * 1.15, scale: 0.9, easing: options.easing}),
    revealCardContent(hero, options.duration * 0.8, options.easing),
  );
  for (let index = 0; index < secondary.length; index++) {
    const card = secondary[index];
    if (!card) continue;
    const optionIndex = index + 1;
    const customDelay = options.cards[optionIndex]?.animationDelay ?? 0;
    if (customDelay > 0) yield* waitFor(customDelay);
    yield* all(
      index % 2 === 0
        ? slideInLeft(card.node, {distance: 24, duration: options.duration * 0.8, easing: options.easing})
        : slideInRight(card.node, {distance: 24, duration: options.duration * 0.8, easing: options.easing}),
      revealCardContent(card, options.duration * 0.6, options.easing),
    );
    if (index < secondary.length - 1) yield* waitFor(options.stagger * 0.75);
  }
}

function* playSequentialReveal(comparison: FeatureCardsInstance): ThreadGenerator {
  const {parts, options} = comparison;
  for (let index = 0; index < parts.cards.length; index++) {
    const card = parts.cards[index];
    if (!card) continue;
    const customDelay = options.cards[index]?.animationDelay ?? 0;
    if (customDelay > 0) yield* waitFor(customDelay);
    yield* all(
      slideInUp(card.node, {distance: 28, duration: options.duration, easing: options.easing}),
      revealCardContent(card, options.duration * 0.72, options.easing),
    );
    const cardOptions = options.cards[index];
    if (cardOptions) {
      yield* card.surface.stroke(cardOptions.accentColor, 0.2);
      yield* waitFor(Math.min(0.25, options.stagger));
      yield* card.surface.stroke(cardOptions.highlight ? cardOptions.accentColor : '#E8E0D3', 0.28);
    }
    if (index < parts.cards.length - 1) yield* waitFor(options.stagger);
  }
}

export function* playFeatureCards(instance: FeatureCardsInstance): ThreadGenerator {
  const {parts, options} = instance;
  parts.root.position([options.x, options.y]);
  parts.root.opacity(1);
  parts.surface.opacity(0);
  for (const child of parts.root.children()) {
    if (child !== parts.surface) child.opacity(0);
  }
  for (const card of parts.cards) {
    card.node.opacity(0);
    card.surface.opacity(1);
    card.accentRule.opacity(1);
  }

  yield* all(
    scaleIn(parts.surface, {duration: options.duration * 0.8, scale: 0.98, easing: options.easing}),
    fadeUp(parts.title, {distance: 12, duration: options.duration * 0.65, easing: options.easing}),
    fadeUp(parts.subtitle, {distance: 8, duration: options.duration * 0.55, delay: 0.08, easing: options.easing}),
  );

  switch (options.variant) {
    case 'feature_grid':
      yield* playFeatureGrid(instance);
      break;
    case 'spotlight_card':
      yield* playSpotlight(instance);
      break;
    case 'sequential_reveal':
      yield* playSequentialReveal(instance);
      break;
    case 'editorial_stack':
    default:
      yield* playEditorialStack(instance);
      break;
  }
}

export function* exitFeatureCards(
  instance: FeatureCardsInstance,
  duration = 0.42,
): ThreadGenerator {
  if (!Number.isFinite(duration) || duration < 0.05 || duration > 10) {
    throw new RangeError('FeatureCards: exit duration must be between 0.05 and 10 seconds.');
  }
  yield* fadeOut(instance.node, {duration, easing: 'easeInOutSine'});
}
