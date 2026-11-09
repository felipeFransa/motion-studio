import {Layout, Txt} from '@motion-canvas/2d';
import {Color} from '@motion-canvas/core';
import {easingFunctions, type EasingName} from '../../animations/easing';
import {exitKineticTitle, playKineticTitle} from './animations';
import type {
  KineticTitleAlignment,
  KineticTitleAnimationOptions,
  KineticTitleDirection,
  KineticTitleInstance,
  KineticTitleOptions,
  KineticTitleVariant,
  ResolvedKineticTitleOptions,
} from './types';

const alignmentMap: Record<KineticTitleAlignment, 'start' | 'center' | 'end'> = {
  left: 'start',
  center: 'center',
  right: 'end',
};

const variants: readonly KineticTitleVariant[] = [
  'editorial_reveal',
  'kinetic_impact',
  'minimal_slide',
];
const directions: readonly KineticTitleDirection[] = ['left', 'right', 'up', 'down'];
const alignments: readonly KineticTitleAlignment[] = ['left', 'center', 'right'];

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
    throw new TypeError(`KineticTitle: "${name}" must be one of ${allowed.join(', ')}.`);
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
      `KineticTitle: "${name}" must be ${format} between ${minimum} and ${maximum}.`,
    );
  }
  return value;
}

function stringValue(value: unknown, name: string, fallback: string): string {
  if (value === undefined) {
    return fallback;
  }
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new TypeError(`KineticTitle: "${name}" must be a non-empty string.`);
  }
  return value.trim();
}

function validateColor(value: string, name: string): string {
  try {
    new Color(value);
  } catch {
    throw new TypeError(`KineticTitle: "${name}" must be a valid CSS color.`);
  }
  return value;
}

export function parseKineticTitleOptions(input: unknown): ResolvedKineticTitleOptions {
  if (!isRecord(input)) {
    throw new TypeError('KineticTitle: configuration must be a JSON object.');
  }

  if (input.component !== undefined && input.component !== 'kinetic_title') {
    throw new TypeError('KineticTitle: "component" must be "kinetic_title".');
  }

  if (typeof input.text !== 'string' || input.text.trim().length === 0) {
    throw new TypeError('KineticTitle: "text" must be a non-empty string.');
  }
  const text = input.text.trim().replace(/\s+/gu, ' ');

  const animationInput = input.animation === undefined ? {} : input.animation;
  if (!isRecord(animationInput)) {
    throw new TypeError('KineticTitle: "animation" must be a JSON object.');
  }

  const easing = enumValue(
    animationInput.easing,
    Object.keys(easingFunctions) as EasingName[],
    'animation.easing',
    'easeOutCubic',
  );
  const animation: Required<KineticTitleAnimationOptions> = Object.freeze({
    duration: numberValue(animationInput.duration, 'animation.duration', 1, 0.05, 10),
    stagger: numberValue(animationInput.stagger, 'animation.stagger', 0.12, 0, 3),
    distance: numberValue(animationInput.distance, 'animation.distance', 64, 0, 500),
    easing,
    direction: enumValue(
      animationInput.direction,
      directions,
      'animation.direction',
      'up',
    ),
  });

  let highlightWords: string[] = [];
  if (input.highlightWords !== undefined) {
    if (
      !Array.isArray(input.highlightWords) ||
      !input.highlightWords.every((word): word is string => typeof word === 'string' && word.trim().length > 0)
    ) {
      throw new TypeError('KineticTitle: "highlightWords" must be an array of non-empty strings.');
    }
    highlightWords = input.highlightWords.map((word) => word.trim());
  }

  const variant = enumValue(input.variant, variants, 'variant', 'editorial_reveal');
  const alignment = enumValue(input.alignment, alignments, 'alignment', 'center');
  const x = numberValue(input.x, 'x', 0, -540, 540);
  const y = numberValue(input.y, 'y', 0, -960, 960);
  const maxWidth = numberValue(input.maxWidth, 'maxWidth', 920, 80, 1080);
  if (Math.abs(x) + maxWidth / 2 > 540) {
    throw new RangeError(
      'KineticTitle: x and maxWidth must keep the title within the 1080px composition width.',
    );
  }

  const fontSize = numberValue(input.fontSize, 'fontSize', 96, 8, 320);
  const estimatedLineCount = Math.max(
    1,
    Math.ceil((text.length * fontSize * 0.7) / maxWidth),
  );
  const estimatedHeight = estimatedLineCount * fontSize * 1.25;
  if (Math.abs(y) + estimatedHeight / 2 > 960) {
    throw new RangeError(
      'KineticTitle: y and the estimated title height must keep the title within the 1920px composition height.',
    );
  }
  const color = validateColor(stringValue(input.color, 'color', '#191919'), 'color');
  const highlightColor = validateColor(
    stringValue(input.highlightColor, 'highlightColor', '#F26A38'),
    'highlightColor',
  );
  const fontFamily = stringValue(input.fontFamily, 'fontFamily', 'Arial');

  const options: ResolvedKineticTitleOptions = {
    component: 'kinetic_title',
    variant,
    text,
    highlightWords: Object.freeze(highlightWords),
    fontSize,
    fontWeight: numberValue(input.fontWeight, 'fontWeight', 900, 1, 1000, true),
    fontFamily,
    color,
    highlightColor,
    alignment,
    x,
    y,
    maxWidth,
    letterSpacing: numberValue(input.letterSpacing, 'letterSpacing', 0, -20, 80),
    animation,
  };
  return Object.freeze(options);
}

function normalizeWord(word: string): string {
  return word
    .normalize('NFC')
    .toLocaleLowerCase('pt-BR')
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
}

export function KineticTitle(input: KineticTitleOptions): KineticTitleInstance;
export function KineticTitle(input: unknown): KineticTitleInstance;
export function KineticTitle(input: unknown): KineticTitleInstance {
  const options = parseKineticTitleOptions(input);
  const highlighted = new Set(options.highlightWords.map(normalizeWord));
  const words = options.text
    .split(/\s+/u)
    .filter(Boolean)
    .map((text) => {
      const isHighlighted = highlighted.has(normalizeWord(text));
      const emphasisFactor = options.variant === 'kinetic_impact'
        ? isHighlighted ? 1.08 : 0.96
        : 1;
      const word = new Txt({
        text,
        fontFamily: options.fontFamily,
        fontSize: options.fontSize * emphasisFactor,
        fontWeight: options.fontWeight,
        letterSpacing: options.letterSpacing,
        fill: isHighlighted ? options.highlightColor : options.color,
        opacity: 0,
      });
      word.maxWidth(options.maxWidth);
      word.textWrap(true);
      return word;
    });

  const node = new Layout({
    layout: true,
    x: options.x,
    y: options.y,
    width: options.maxWidth,
    maxWidth: options.maxWidth,
    direction: 'row',
    wrap: 'wrap',
    justifyContent: alignmentMap[options.alignment],
    alignItems: 'center',
    alignContent: 'center',
    gap: [16, 12],
    children: words,
  });

  const instance: KineticTitleInstance = {
    node,
    words,
    options,
    play: () => playKineticTitle(instance),
    exit: (duration) => exitKineticTitle(instance, duration),
  };

  return instance;
}
