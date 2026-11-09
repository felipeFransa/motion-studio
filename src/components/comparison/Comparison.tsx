import {Color} from '@motion-canvas/core';
import {easingFunctions, type EasingName} from '../../animations/easing';
import {exitComparison, playComparison} from './animations';
import {createComparisonParts} from './variants';
import type {
  ComparisonAlignment,
  ComparisonChartOrientation,
  ComparisonInstance,
  ComparisonMode,
  ComparisonOptions,
  ComparisonSide,
  ComparisonSideInput,
  ComparisonValueFormat,
  ComparisonVariant,
  ResolvedComparisonOptions,
} from './types';

type JsonRecord = Record<string, unknown>;

const variants: readonly ComparisonVariant[] = ['before_after', 'versus', 'data_comparison'];
const alignments: readonly ComparisonAlignment[] = ['left', 'center', 'right'];
const sides: readonly ComparisonSide[] = ['left', 'right', 'none'];
const modes: readonly ComparisonMode[] = ['absolute', 'percentage'];
const orientations: readonly ComparisonChartOrientation[] = ['horizontal', 'vertical'];
const formats: readonly ComparisonValueFormat[] = ['number', 'currency', 'percent'];
const highlights = ['higher', 'lower', 'none'] as const;

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
    throw new TypeError(`Comparison: "${name}" must be one of ${values.join(', ')}.`);
  }
  return value as T;
}

function numberValue(
  value: unknown,
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
  optional = false,
  integer = false,
): number | undefined {
  if (value === undefined && optional) return undefined;
  if (value === undefined) return fallback;
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < minimum ||
    value > maximum ||
    (integer && !Number.isInteger(value))
  ) {
    const format = integer ? 'an integer' : 'a finite number';
    throw new TypeError(`Comparison: "${name}" must be ${format} between ${minimum} and ${maximum}.`);
  }
  return value;
}

function stringValue(value: unknown, name: string, fallback: string): string {
  if (value === undefined) return fallback;
  if (typeof value !== 'string') throw new TypeError(`Comparison: "${name}" must be a string.`);
  return value.trim();
}

function rawStringValue(value: unknown, name: string, fallback: string): string {
  if (value === undefined) return fallback;
  if (typeof value !== 'string') throw new TypeError(`Comparison: "${name}" must be a string.`);
  return value;
}

function booleanValue(value: unknown, name: string, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  if (typeof value !== 'boolean') throw new TypeError(`Comparison: "${name}" must be a boolean.`);
  return value;
}

function colorValue(value: unknown, name: string, fallback: string): string {
  const color = stringValue(value, name, fallback);
  try {
    if (!color) throw new TypeError();
    new Color(color);
  } catch {
    throw new TypeError(`Comparison: "${name}" must be a valid CSS color.`);
  }
  return color;
}

function sideInput(value: unknown, name: string): ComparisonSideInput {
  if (value === undefined) return {};
  if (!isRecord(value)) throw new TypeError(`Comparison: "${name}" must be a JSON object.`);
  return value as ComparisonSideInput;
}

export function parseComparisonOptions(input: unknown): ResolvedComparisonOptions {
  if (!isRecord(input)) throw new TypeError('Comparison: configuration must be a JSON object.');
  if (input.component !== undefined && input.component !== 'comparison') {
    throw new TypeError('Comparison: "component" must be "comparison".');
  }

  const variant = enumValue(input.variant, variants, 'variant', 'before_after');
  const left = sideInput(input.left, 'left');
  const right = sideInput(input.right, 'right');
  const animation = input.animation === undefined ? {} : input.animation;
  if (!isRecord(animation)) throw new TypeError('Comparison: "animation" must be a JSON object.');
  const duration = numberValue(
    animation.duration ?? input.duration,
    'animation.duration',
    1.25,
    0.05,
    10,
  ) as number;
  const easing = enumValue(
    animation.easing ?? input.easing,
    Object.keys(easingFunctions) as EasingName[],
    'animation.easing',
    'easeOutCubic',
  );
  const width = numberValue(input.width, 'width', 900, 320, 1040) as number;
  const height = numberValue(input.height, 'height', 660, 420, 1200) as number;
  const x = numberValue(input.x, 'x', 0, -540, 540) as number;
  const y = numberValue(input.y, 'y', 0, -960, 960) as number;
  if (Math.abs(x) + width / 2 > 540 || Math.abs(y) + height / 2 > 960) {
    throw new RangeError('Comparison: position and dimensions must remain within the 1080×1920 composition.');
  }

  const valueFormat = enumValue(input.valueFormat, formats, 'valueFormat', 'number');
  const suffixFallback = valueFormat === 'percent' ? '%' : '';
  const leftValue = numberValue(left.value ?? input.leftValue, 'left.value', 0, -1e15, 1e15, true);
  const rightValue = numberValue(right.value ?? input.rightValue, 'right.value', 0, -1e15, 1e15, true);
  if (variant === 'data_comparison' && (leftValue === undefined || rightValue === undefined)) {
    throw new TypeError('Comparison: data_comparison requires numeric left.value and right.value.');
  }

  const locale = stringValue(input.locale, 'locale', 'pt-BR');
  try {
    new Intl.NumberFormat(locale);
  } catch {
    throw new TypeError(`Comparison: "${locale}" is not a supported number-format locale.`);
  }
  const options: ResolvedComparisonOptions = {
    component: 'comparison',
    variant,
    title: stringValue(input.title, 'title', ''),
    subtitle: stringValue(input.subtitle, 'subtitle', ''),
    alignment: enumValue(input.alignment, alignments, 'alignment', 'left'),
    x,
    y,
    width,
    height,
    backgroundColor: colorValue(input.backgroundColor, 'backgroundColor', '#FFFDF8'),
    accentColor: colorValue(input.accentColor, 'accentColor', '#F26A38'),
    primaryColor: colorValue(input.primaryColor, 'primaryColor', '#191919'),
    secondaryColor: colorValue(input.secondaryColor, 'secondaryColor', '#777064'),
    duration,
    easing,
    leftLabel: stringValue(input.beforeLabel ?? left.label ?? input.leftLabel, 'leftLabel', variant === 'before_after' ? 'ANTES' : 'ALTERNATIVA A'),
    rightLabel: stringValue(input.afterLabel ?? right.label ?? input.rightLabel, 'rightLabel', variant === 'before_after' ? 'DEPOIS' : 'ALTERNATIVA B'),
    leftTitle: stringValue(left.title ?? input.leftTitle, 'leftTitle', variant === 'before_after' ? 'Estado inicial' : ''),
    rightTitle: stringValue(right.title ?? input.rightTitle, 'rightTitle', variant === 'before_after' ? 'Estado final' : ''),
    leftDescription: stringValue(input.beforeDescription ?? left.description ?? input.leftDescription, 'leftDescription', ''),
    rightDescription: stringValue(input.afterDescription ?? right.description ?? input.rightDescription, 'rightDescription', ''),
    leftColor: colorValue(left.color ?? input.leftColor, 'leftColor', colorValue(input.primaryColor, 'primaryColor', '#191919')),
    rightColor: colorValue(right.color ?? input.rightColor, 'rightColor', colorValue(input.secondaryColor, 'secondaryColor', '#F26A38')),
    highlightSide: enumValue(input.highlightSide, sides, 'highlightSide', 'none'),
    leftValue,
    rightValue,
    valueFormat,
    prefix: rawStringValue(input.prefix, 'prefix', ''),
    suffix: rawStringValue(input.suffix, 'suffix', suffixFallback),
    decimals: numberValue(input.decimals, 'decimals', 0, 0, 6, false, true) as number,
    locale,
    comparisonMode: enumValue(input.comparisonMode, modes, 'comparisonMode', 'absolute'),
    showDifference: booleanValue(input.showDifference, 'showDifference', true),
    showPercentageChange: booleanValue(input.showPercentageChange, 'showPercentageChange', false),
    chartOrientation: enumValue(input.chartOrientation, orientations, 'chartOrientation', 'horizontal'),
    highlightResult: enumValue(input.highlightResult, highlights, 'highlightResult', 'none'),
  };
  return Object.freeze(options);
}

export function Comparison(options: ComparisonOptions): ComparisonInstance;
export function Comparison(configuration: unknown): ComparisonInstance;
export function Comparison(configuration: unknown): ComparisonInstance {
  const options = parseComparisonOptions(configuration);
  const parts = createComparisonParts(options);
  const instance: ComparisonInstance = {
    node: parts.root,
    options,
    parts,
    play: () => playComparison(instance),
    exit: (duration) => exitComparison(instance, duration),
  };
  return instance;
}

export function createComparisonFromJSON(configuration: unknown): ComparisonInstance {
  return Comparison(configuration);
}
