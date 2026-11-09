import {Color} from '@motion-canvas/core';
import {easingFunctions, type EasingName} from '../../animations/easing';
import {exitFeatureCards, playFeatureCards} from './animations';
import {calculateFeatureCardsHeight, createFeatureCardsParts} from './variants';
import type {
  FeatureCardsAlignment,
  FeatureCardsInstance,
  FeatureCardsOptions,
  FeatureCardsVariant,
  FeatureIconId,
  ResolvedFeatureCardOptions,
  ResolvedFeatureCardsOptions,
} from './types';

type JsonRecord = Record<string, unknown>;

const variants: readonly FeatureCardsVariant[] = [
  'editorial_stack',
  'feature_grid',
  'spotlight_card',
  'sequential_reveal',
];
const alignments: readonly FeatureCardsAlignment[] = ['left', 'center', 'right'];
const icons: readonly FeatureIconId[] = [
  'spark',
  'target',
  'layers',
  'arrow',
  'diamond',
  'dot',
  'none',
];

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function enumValue<T extends string>(
  value: unknown,
  values: readonly T[],
  name: string,
  fallback: T,
): T {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || !values.includes(value as T)) {
    throw new TypeError(`FeatureCards: "${name}" must be one of ${values.join(', ')}.`);
  }
  return value as T;
}

function numberValue(
  value: unknown,
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (value === undefined) return fallback;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < minimum || value > maximum) {
    throw new TypeError(`FeatureCards: "${name}" must be a finite number between ${minimum} and ${maximum}.`);
  }
  return value;
}

function stringValue(value: unknown, name: string, fallback: string): string {
  if (value === undefined) return fallback;
  if (typeof value !== 'string') throw new TypeError(`FeatureCards: "${name}" must be a string.`);
  const result = value.trim();
  if (result.length > 2000) throw new RangeError(`FeatureCards: "${name}" cannot exceed 2000 characters.`);
  return result;
}

function colorValue(value: unknown, name: string, fallback: string): string {
  const color = stringValue(value, name, fallback);
  try {
    if (!color) throw new TypeError();
    new Color(color);
  } catch {
    throw new TypeError(`FeatureCards: "${name}" must be a valid CSS color.`);
  }
  return color;
}

function booleanValue(value: unknown, name: string, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  if (typeof value !== 'boolean') throw new TypeError(`FeatureCards: "${name}" must be a boolean.`);
  return value;
}

function resolveCard(
  value: unknown,
  index: number,
  options: {
    accentColor: string;
    primaryColor: string;
    duration: number;
  },
): ResolvedFeatureCardOptions {
  if (!isRecord(value)) {
    throw new TypeError(`FeatureCards: "cards[${index}]" must be an object.`);
  }
  const card = value;
  const id = stringValue(card.id, `cards[${index}].id`, '');
  if (!id) throw new TypeError(`FeatureCards: "cards[${index}].id" is required.`);
  const title = stringValue(card.title, `cards[${index}].title`, '');
  const description = stringValue(card.description, `cards[${index}].description`, '');
  if (!title) throw new TypeError(`FeatureCards: "cards[${index}].title" is required.`);
  if (!description) throw new TypeError(`FeatureCards: "cards[${index}].description" is required.`);
  const rawNumber = card.number === undefined ? String(index + 1).padStart(2, '0') : card.number;
  const number = stringValue(rawNumber, `cards[${index}].number`, '');
  if (!number) throw new TypeError(`FeatureCards: "cards[${index}].number" cannot be empty.`);

  return Object.freeze({
    id,
    number,
    title,
    description,
    icon: enumValue(card.icon, icons, `cards[${index}].icon`, 'spark'),
    color: colorValue(card.color, `cards[${index}].color`, options.primaryColor),
    accentColor: colorValue(card.accentColor, `cards[${index}].accentColor`, options.accentColor),
    highlight: booleanValue(card.highlight, `cards[${index}].highlight`, false),
    animationDelay: numberValue(
      card.animationDelay,
      `cards[${index}].animationDelay`,
      0,
      0,
      options.duration * 10,
    ),
  });
}

export function parseFeatureCardsOptions(input: unknown): ResolvedFeatureCardsOptions {
  if (!isRecord(input)) throw new TypeError('FeatureCards: configuration must be a JSON object.');
  if (input.component !== undefined && input.component !== 'feature_cards') {
    throw new TypeError('FeatureCards: "component" must be "feature_cards".');
  }

  const variant = enumValue(input.variant, variants, 'variant', 'editorial_stack');
  const animation = input.animation === undefined ? {} : input.animation;
  if (!isRecord(animation)) throw new TypeError('FeatureCards: "animation" must be a JSON object.');
  const duration = numberValue(animation.duration ?? input.duration, 'animation.duration', 0.7, 0.1, 10);
  const stagger = numberValue(animation.stagger ?? input.stagger, 'animation.stagger', 0.18, 0, 3);
  const easing = enumValue(
    animation.easing ?? input.easing,
    Object.keys(easingFunctions) as EasingName[],
    'animation.easing',
    'easeOutCubic',
  );
  if (!Array.isArray(input.cards) || input.cards.length < 2 || input.cards.length > 5) {
    throw new RangeError('FeatureCards: "cards" must contain between 2 and 5 items.');
  }
  const maxWidth = numberValue(input.maxWidth, 'maxWidth', 900, 560, 1000);
  const x = numberValue(input.x, 'x', 0, -540, 540);
  const y = numberValue(input.y, 'y', 0, -960, 960);
  const backgroundColor = colorValue(input.backgroundColor, 'backgroundColor', '#FFFDF8');
  const accentColor = colorValue(input.accentColor, 'accentColor', '#F26A38');
  const primaryColor = colorValue(input.primaryColor, 'primaryColor', '#191919');
  const secondaryColor = colorValue(input.secondaryColor, 'secondaryColor', '#777064');
  const cards = input.cards.map((card, index) =>
    resolveCard(card, index, {accentColor, primaryColor, duration}),
  );
  const ids = new Set<string>();
  for (const card of cards) {
    if (ids.has(card.id)) throw new TypeError(`FeatureCards: duplicate card id "${card.id}".`);
    ids.add(card.id);
  }

  const title = stringValue(input.title, 'title', '');
  const subtitle = stringValue(input.subtitle, 'subtitle', '');
  const height = calculateFeatureCardsHeight(variant, cards, maxWidth, title, subtitle);
  if (Math.abs(x) + maxWidth / 2 > 540 || Math.abs(y) + height / 2 > 960) {
    throw new RangeError(
      `FeatureCards: position and composition (${maxWidth}×${height}) must remain within the 1080×1920 composition.`,
    );
  }

  return Object.freeze({
    component: 'feature_cards',
    variant,
    title,
    subtitle,
    cards: Object.freeze(cards),
    maxWidth,
    x,
    y,
    backgroundColor,
    accentColor,
    primaryColor,
    secondaryColor,
    duration,
    stagger,
    alignment: enumValue(input.alignment, alignments, 'alignment', 'left'),
    easing,
    height,
  });
}

export function FeatureCards(options: FeatureCardsOptions): FeatureCardsInstance;
export function FeatureCards(configuration: unknown): FeatureCardsInstance;
export function FeatureCards(configuration: unknown): FeatureCardsInstance {
  const options = parseFeatureCardsOptions(configuration);
  const parts = createFeatureCardsParts(options);
  const instance: FeatureCardsInstance = {
    node: parts.root,
    options,
    parts,
    play: () => playFeatureCards(instance),
    exit: (duration) => exitFeatureCards(instance, duration),
  };
  return instance;
}

export function createFeatureCardsFromJSON(configuration: unknown): FeatureCardsInstance {
  return FeatureCards(configuration);
}
