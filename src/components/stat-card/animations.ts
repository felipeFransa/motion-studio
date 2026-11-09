import {all, tween, type ThreadGenerator} from '@motion-canvas/core';
import {resolveEasing} from '../../animations/easing';
import {fadeOut, fadeUp, scaleIn} from '../../animations/transitions';
import type {StatCardInstance, StatCardParts} from './types';

function formatNumber(
  value: number,
  card: StatCardInstance,
  forceSign = false,
): string {
  const {options} = card;
  const formatted = new Intl.NumberFormat(options.locale, {
    minimumFractionDigits: options.decimals,
    maximumFractionDigits: options.decimals,
    signDisplay: forceSign ? 'always' : 'auto',
  }).format(value);
  return `${options.prefix}${formatted}${options.suffix}`;
}

function setContentOpacity(parts: StatCardParts, opacity: number): void {
  parts.accentRule.opacity(opacity);
  parts.eyebrow.opacity(opacity);
  parts.title.opacity(opacity);
  parts.description.opacity(opacity);
}

function* animateCount(
  card: StatCardInstance,
  start: number,
  end: number,
  duration: number,
): ThreadGenerator {
  const {value} = card.parts;
  const easing = resolveEasing(card.options.animation.easing);
  value.text(formatNumber(start, card));
  let previousText = value.text();
  yield* tween(duration, (progress) => {
    const current = start + (end - start) * easing(progress);
    const formatted = formatNumber(current, card);
    if (formatted !== previousText) {
      value.text(formatted);
      previousText = formatted;
    }
  });
  const finalText = formatNumber(end, card);
  if (value.text() !== finalText) {
    value.text(finalText);
  }
}

function* editorialStat(card: StatCardInstance): ThreadGenerator {
  const {parts, options} = card;
  parts.value.text(formatNumber(options.value, card));
  yield* all(
    scaleIn(parts.surface, {duration: options.animation.duration, scale: 0.96, easing: options.animation.easing}),
    scaleIn(parts.value, {duration: options.animation.duration * 0.85, scale: 0.84, easing: options.animation.easing}),
    fadeUp(parts.accentRule, {distance: 10, duration: 0.45}),
    fadeUp(parts.eyebrow, {distance: 10, duration: 0.45}),
    fadeUp(parts.title, {distance: 22, duration: 0.55, delay: 0.1}),
    fadeUp(parts.description, {distance: 16, duration: 0.5, delay: 0.2}),
  );
}

function* counterImpact(card: StatCardInstance): ThreadGenerator {
  const {parts, options} = card;
  const duration = options.animation.duration;
  parts.value.text(formatNumber(options.startValue, card));
  parts.value.scale(0.72);
  yield* all(
    scaleIn(parts.surface, {duration: duration * 0.65, scale: 0.95, easing: options.animation.easing}),
    parts.value.opacity(1, duration, resolveEasing(options.animation.easing)),
    parts.value.scale(1, duration, resolveEasing(options.animation.easing)),
    animateCount(card, options.startValue, options.value, duration),
    fadeUp(parts.accentRule, {distance: 8, duration: duration * 0.55}),
    fadeUp(parts.eyebrow, {distance: 8, duration: duration * 0.55}),
    fadeUp(parts.title, {distance: 18, duration: duration * 0.55, delay: duration * 0.25}),
    fadeUp(parts.description, {distance: 12, duration: duration * 0.55, delay: duration * 0.32}),
  );
}

function* progressStat(card: StatCardInstance): ThreadGenerator {
  const {parts, options} = card;
  const track = parts.progressTrack;
  const bar = parts.progressBar;
  const progressLabel = parts.progressLabel;
  const marker = parts.progressMarker;
  if (!track || !bar || !progressLabel || !marker) {
    throw new Error('StatCard: progress variant is missing its progress elements.');
  }
  const availableWidth = track.width();
  const startX = -availableWidth / 2;
  const finalWidth = availableWidth * options.progress / 100;
  const duration = options.animation.duration;
  parts.value.text(formatNumber(options.value, card));
  bar.width(0);
  bar.x(startX);
  marker.x(startX);

  yield* all(
    scaleIn(parts.surface, {duration: duration * 0.65, scale: 0.96, easing: options.animation.easing}),
    scaleIn(parts.value, {duration: duration * 0.72, scale: 0.88, easing: options.animation.easing}),
    fadeUp(parts.title, {distance: 16, duration: duration * 0.55}),
    fadeUp(parts.description, {distance: 12, duration: duration * 0.5, delay: 0.12}),
    fadeUp(parts.accentRule, {distance: 8, duration: duration * 0.45}),
    fadeUp(parts.eyebrow, {distance: 8, duration: duration * 0.45}),
    fadeUp(progressLabel, {distance: 8, duration: duration * 0.45, delay: duration * 0.35}),
    track.opacity(1, duration * 0.4, resolveEasing(options.animation.easing)),
    all(
      bar.width(finalWidth, duration, resolveEasing(options.animation.easing)),
      bar.x(startX + finalWidth / 2, duration, resolveEasing(options.animation.easing)),
      bar.opacity(1, duration * 0.45, resolveEasing(options.animation.easing)),
      marker.x(startX + finalWidth, duration, resolveEasing(options.animation.easing)),
      marker.opacity(1, duration * 0.45, resolveEasing(options.animation.easing)),
    ),
  );
}

function* comparisonStat(card: StatCardInstance): ThreadGenerator {
  const {parts, options} = card;
  const previous = options.previousValue;
  const current = options.currentValue;
  const previousLabel = parts.previousLabel;
  const previousValue = parts.previousValue;
  const previousBar = parts.previousBar;
  const currentLabel = parts.currentLabel;
  const currentValue = parts.currentValue;
  const currentBar = parts.currentBar;
  const difference = parts.difference;
  const growth = parts.growthIndicator;
  if (
    previous === undefined || current === undefined ||
    !previousLabel || !previousValue || !previousBar || !currentLabel ||
    !currentValue || !currentBar || !difference || !growth
  ) {
    throw new Error('StatCard: comparison variant is missing comparison values or elements.');
  }

  const maxValue = Math.max(previous, current, 1);
  const maxWidth = options.width - 104;
  const previousWidth = maxWidth * previous / maxValue;
  const currentWidth = maxWidth * current / maxValue;
  const delta = options.comparisonMode === 'percentage'
    ? (current - previous) / Math.abs(previous) * 100
    : current - previous;
  const deltaSuffix = options.comparisonMode === 'absolute' && options.suffix === '%'
    ? ' p.p.'
    : options.comparisonMode === 'percentage' ? '%' : options.suffix;
  const deltaFormatted = `${new Intl.NumberFormat(options.locale, {
    maximumFractionDigits: options.decimals,
    minimumFractionDigits: options.decimals,
    signDisplay: 'always',
  }).format(delta)}${deltaSuffix}`;
  const direction = delta > 0 ? '↑' : delta < 0 ? '↓' : '→';
  const duration = options.animation.duration;
  const easing = resolveEasing(options.animation.easing);
  parts.value.text(formatNumber(current, card));
  previousValue.text(`${options.prefix}${new Intl.NumberFormat(options.locale, {
    minimumFractionDigits: options.decimals,
    maximumFractionDigits: options.decimals,
  }).format(previous)}${options.suffix}`);
  currentValue.text(`${options.prefix}${new Intl.NumberFormat(options.locale, {
    minimumFractionDigits: options.decimals,
    maximumFractionDigits: options.decimals,
  }).format(current)}${options.suffix}`);
  difference.text(deltaFormatted);
  growth.text(direction);

  const left = -options.width / 2 + 48;
  previousBar.x(left);
  currentBar.x(left);
  previousBar.width(0);
  currentBar.width(0);

  yield* all(
    scaleIn(parts.surface, {duration: duration * 0.65, scale: 0.96, easing: options.animation.easing}),
    fadeUp(parts.value, {distance: 16, duration: duration * 0.55}),
    fadeUp(previousLabel, {distance: 12, duration: duration * 0.4}),
    fadeUp(previousValue, {distance: 12, duration: duration * 0.4, delay: 0.08}),
    fadeUp(currentLabel, {distance: 12, duration: duration * 0.4, delay: 0.15}),
    fadeUp(currentValue, {distance: 12, duration: duration * 0.4, delay: 0.22}),
    fadeUp(difference, {distance: 10, duration: duration * 0.42, delay: 0.3}),
    fadeUp(growth, {distance: 10, duration: duration * 0.42, delay: 0.3}),
    previousBar.width(previousWidth, duration, easing),
    currentBar.width(currentWidth, duration, easing),
    previousBar.opacity(1, duration * 0.45, easing),
    currentBar.opacity(1, duration * 0.45, easing),
    previousBar.x(left + previousWidth / 2, duration, easing),
    currentBar.x(left + currentWidth / 2, duration, easing),
    fadeUp(parts.accentRule, {distance: 8, duration: duration * 0.45}),
    fadeUp(parts.eyebrow, {distance: 8, duration: duration * 0.45}),
    fadeUp(parts.title, {distance: 12, duration: duration * 0.4, delay: 0.12}),
    fadeUp(parts.description, {distance: 10, duration: duration * 0.4, delay: 0.2}),
  );
}

export function* playStatCard(card: StatCardInstance): ThreadGenerator {
  const {parts, options} = card;
  parts.root.position([options.x, options.y]);
  parts.surface.opacity(0);
  setContentOpacity(parts, 0);
  for (const child of parts.root.children()) {
    if (child !== parts.surface) {
      child.opacity(0);
    }
  }

  switch (options.variant) {
    case 'counter_impact':
      yield* counterImpact(card);
      break;
    case 'progress_stat':
      yield* progressStat(card);
      break;
    case 'comparison_stat':
      yield* comparisonStat(card);
      break;
    case 'editorial_stat':
    default:
      yield* editorialStat(card);
      break;
  }
}

export function* exitStatCard(
  card: StatCardInstance,
  duration = 0.4,
): ThreadGenerator {
  if (!Number.isFinite(duration) || duration < 0.05 || duration > 10) {
    throw new RangeError('StatCard: exit duration must be between 0.05 and 10 seconds.');
  }
  yield* fadeOut(card.node, {duration, easing: 'easeInOutSine'});
}
