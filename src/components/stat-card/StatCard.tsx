import {Color} from '@motion-canvas/core';
import {easingFunctions, type EasingName} from '../../animations/easing';
import {exitStatCard, playStatCard} from './animations';
import {createStatCardParts} from './variants';
import type {
  ComparisonMode,
  ResolvedStatCardOptions,
  StatCardAlignment,
  StatCardInstance,
  StatCardOptions,
  StatCardVariant,
} from './types';

const variants: readonly StatCardVariant[] = [
  'editorial_stat',
  'counter_impact',
  'progress_stat',
  'comparison_stat',
];
const alignments: readonly StatCardAlignment[] = ['left', 'center', 'right'];
const comparisonModes: readonly ComparisonMode[] = ['absolute', 'percentage'];

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function enumValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
  name: string,
  fallback: T,
): T {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value !== 'string' || !allowed.includes(value as T)) {
    throw new TypeError(`StatCard: "${name}" must be one of ${allowed.join(', ')}.`);
  }
  return value as T;
}

function numberValue(
  value: unknown,
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
  integer = false,
): number {
  if (value === undefined) {
    return fallback;
  }
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < minimum ||
    value > maximum ||
    (integer && !Number.isInteger(value))
  ) {
    const format = integer ? 'an integer' : 'a finite number';
    throw new TypeError(
      `StatCard: "${name}" must be ${format} between ${minimum} and ${maximum}.`,
    );
  }
  return value;
}

function stringValue(
  value: unknown,
  name: string,
  fallback: string,
  preserveWhitespace = false,
): string {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value !== 'string') {
    throw new TypeError(`StatCard: "${name}" must be a string.`);
  }
  return preserveWhitespace ? value : value.trim();
}

function validatedColor(value: unknown, name: string, fallback: string): string {
  const color = stringValue(value, name, fallback);
  if (color.length === 0) {
    throw new TypeError(`StatCard: "${name}" must be a valid color.`);
  }
  try {
    new Color(color);
  } catch {
    throw new TypeError(`StatCard: "${name}" must be a valid CSS color.`);
  }
  return color;
}

export function parseStatCardOptions(input: unknown): ResolvedStatCardOptions {
  if (!isRecord(input)) {
    throw new TypeError('StatCard: configuration must be a JSON object.');
  }
  if (input.component !== undefined && input.component !== 'stat_card') {
    throw new TypeError('StatCard: "component" must be "stat_card".');
  }
  const variant = enumValue(input.variant, variants, 'variant', 'editorial_stat');
  const animationInput = input.animation === undefined ? {} : input.animation;
  if (!isRecord(animationInput)) {
    throw new TypeError('StatCard: "animation" must be a JSON object.');
  }
  const easing = enumValue(
    animationInput.easing,
    Object.keys(easingFunctions) as EasingName[],
    'animation.easing',
    'easeOutCubic',
  );
  const animation = Object.freeze({
    duration: numberValue(animationInput.duration, 'animation.duration', 1.1, 0.05, 10),
    easing,
  });

  const previousValue = input.previousValue === undefined
    ? undefined
    : numberValue(input.previousValue, 'previousValue', 0, 0, 1e15);
  const currentValue = input.currentValue === undefined
    ? undefined
    : numberValue(input.currentValue, 'currentValue', 0, 0, 1e15);
  let value: number;
  if (input.value !== undefined) {
    value = numberValue(input.value, 'value', 0, -1e15, 1e15);
  } else if (variant === 'comparison_stat' && currentValue !== undefined) {
    value = currentValue;
  } else {
    throw new TypeError('StatCard: "value" is required for this variant.');
  }
  const startValue = numberValue(input.startValue, 'startValue', 0, -1e15, 1e15);
  const decimals = numberValue(input.decimals, 'decimals', 0, 0, 6, true);
  const locale = stringValue(input.locale, 'locale', 'pt-BR');
  try {
    new Intl.NumberFormat(locale);
  } catch {
    throw new TypeError(`StatCard: "${locale}" is not a supported number-format locale.`);
  }

  const width = numberValue(input.width, 'width', 900, 240, 1040);
  const height = numberValue(input.height, 'height', 560, 240, 960);
  const x = numberValue(input.x, 'x', 0, -540, 540);
  const y = numberValue(input.y, 'y', 0, -960, 960);
  if (Math.abs(x) + width / 2 > 540 || Math.abs(y) + height / 2 > 960) {
    throw new RangeError('StatCard: position and dimensions must remain within the 1080×1920 composition.');
  }
  const comparisonMode = enumValue(
    input.comparisonMode,
    comparisonModes,
    'comparisonMode',
    'absolute',
  );
  if (variant === 'progress_stat') {
    const progress = input.progress === undefined ? value : numberValue(input.progress, 'progress', 0, 0, 100);
    if (progress < 0 || progress > 100) {
      throw new RangeError('StatCard: "progress" must be between 0 and 100.');
    }
  }
  if (variant === 'comparison_stat') {
    if (previousValue === undefined || currentValue === undefined) {
      throw new TypeError('StatCard: comparison_stat requires "previousValue" and "currentValue".');
    }
    if (comparisonMode === 'percentage' && previousValue === 0) {
      throw new RangeError('StatCard: percentage comparison requires a non-zero previousValue.');
    }
  }

  const options: ResolvedStatCardOptions = {
    component: 'stat_card',
    variant,
    value,
    startValue,
    title: stringValue(input.title, 'title', ''),
    description: stringValue(input.description, 'description', ''),
    prefix: stringValue(input.prefix, 'prefix', '', true),
    suffix: stringValue(input.suffix, 'suffix', '', true),
    decimals,
    locale,
    color: validatedColor(input.color, 'color', '#191919'),
    accentColor: validatedColor(input.accentColor, 'accentColor', '#F26A38'),
    backgroundColor: validatedColor(
      input.backgroundColor,
      'backgroundColor',
      variant === 'counter_impact' ? '#191919' : '#FFFDF8',
    ),
    progressColor: validatedColor(input.progressColor, 'progressColor', '#F26A38'),
    trackColor: validatedColor(input.trackColor, 'trackColor', '#E6DDCE'),
    fontSize: numberValue(input.fontSize, 'fontSize', 112, 28, 240),
    alignment: enumValue(input.alignment, alignments, 'alignment', 'left'),
    x,
    y,
    width,
    height,
    animation,
    progress: variant === 'progress_stat'
      ? input.progress === undefined ? value : numberValue(input.progress, 'progress', 0, 0, 100)
      : 0,
    previousValue,
    currentValue,
    previousLabel: stringValue(input.previousLabel, 'previousLabel', 'ANTERIOR'),
    currentLabel: stringValue(input.currentLabel, 'currentLabel', 'ATUAL'),
    comparisonMode,
  };
  return Object.freeze(options);
}

export function StatCard(input: StatCardOptions): StatCardInstance;
export function StatCard(input: unknown): StatCardInstance;
export function StatCard(input: unknown): StatCardInstance {
  const options = parseStatCardOptions(input);
  const parts = createStatCardParts(options);
  const instance: StatCardInstance = {
    node: parts.root,
    options,
    parts,
    play: () => playStatCard(instance),
    exit: (duration) => exitStatCard(instance, duration),
  };
  return instance;
}

export function createStatCardFromJSON(configuration: unknown): StatCardInstance {
  return StatCard(configuration);
}
