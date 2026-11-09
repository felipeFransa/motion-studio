import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import {resolveEasing} from '../../animations/easing';
import {fadeOut, fadeUp, scaleIn, slideInLeft, slideInRight} from '../../animations/transitions';
import type {ComparisonInstance} from './types';

function formatValue(value: number, comparison: ComparisonInstance): string {
  const {options} = comparison;
  const formatted = new Intl.NumberFormat(options.locale, {
    minimumFractionDigits: options.decimals,
    maximumFractionDigits: options.decimals,
  }).format(value);
  return `${options.prefix}${formatted}${options.suffix}`;
}

function signedValue(value: number, comparison: ComparisonInstance): string {
  const {options} = comparison;
  const formatted = new Intl.NumberFormat(options.locale, {
    minimumFractionDigits: options.decimals,
    maximumFractionDigits: options.decimals,
    signDisplay: 'always',
  }).format(value);
  const suffix = options.valueFormat === 'percent' || options.suffix === '%'
    ? ' p.p.'
    : options.suffix;
  return `${formatted}${suffix}`;
}

function resolvedHighlight(comparison: ComparisonInstance): 'left' | 'right' | 'none' {
  const {options} = comparison;
  if (options.highlightSide !== 'none') return options.highlightSide;
  if (options.variant !== 'data_comparison' || options.highlightResult === 'none') return 'none';
  const left = options.leftValue ?? 0;
  const right = options.rightValue ?? 0;
  if (left === right) return 'none';
  const isLeft = options.highlightResult === 'higher' ? left > right : left < right;
  return isLeft ? 'left' : 'right';
}

function* animateDataChart(comparison: ComparisonInstance): ThreadGenerator {
  const {parts, options} = comparison;
  const left = options.leftValue;
  const right = options.rightValue;
  const leftValue = parts.leftValue;
  const rightValue = parts.rightValue;
  const leftTrack = parts.leftTrack;
  const rightTrack = parts.rightTrack;
  const leftBar = parts.leftBar;
  const rightBar = parts.rightBar;
  const baseline = parts.baseline;
  const difference = parts.difference;
  const percentageChange = parts.percentageChange;
  if (
    left === undefined || right === undefined ||
    !leftValue || !rightValue || !leftTrack || !rightTrack ||
    !leftBar || !rightBar || !baseline
  ) {
    throw new Error('Comparison: data_comparison is missing values or chart elements.');
  }

  leftValue.text(formatValue(left, comparison));
  rightValue.text(formatValue(right, comparison));
  const minimum = Math.min(0, left, right);
  const maximum = Math.max(0, left, right);
  const span = maximum - minimum || 1;
  const duration = options.duration;
  const easing = resolveEasing(options.easing);
  const highlight = resolvedHighlight(comparison);
  if (highlight === 'left') parts.leftPanel.stroke(options.leftColor);
  if (highlight === 'right') parts.rightPanel.stroke(options.rightColor);

  const delta = right - left;
  const differenceText = options.comparisonMode === 'percentage' && left === 0
    ? 'Diferença: —'
    : options.comparisonMode === 'percentage'
      ? `Variação: ${new Intl.NumberFormat(options.locale, {
        minimumFractionDigits: options.decimals,
        maximumFractionDigits: options.decimals,
        signDisplay: 'always',
      }).format(delta / Math.abs(left) * 100)}%`
      : `Diferença: ${signedValue(delta, comparison)}`;
  if (difference) difference.text(differenceText);
  if (percentageChange) {
    percentageChange.text(
      left === 0
        ? 'Variação percentual: não definida para base zero'
        : `Variação percentual: ${new Intl.NumberFormat(options.locale, {
          minimumFractionDigits: options.decimals,
          maximumFractionDigits: options.decimals,
          signDisplay: 'always',
        }).format(delta / Math.abs(left) * 100)}%`,
    );
  }

  if (options.chartOrientation === 'horizontal') {
    const chartLeft = -(options.width - 112) / 2;
    const chartWidth = options.width - 112;
    const baselineX = chartLeft + chartWidth * (0 - minimum) / span;
    const leftEnd = chartLeft + chartWidth * (left - minimum) / span;
    const rightEnd = chartLeft + chartWidth * (right - minimum) / span;
    const leftWidth = Math.abs(leftEnd - baselineX);
    const rightWidth = Math.abs(rightEnd - baselineX);
    leftBar.x(baselineX);
    rightBar.x(baselineX);
    leftBar.width(0);
    rightBar.width(0);
    baseline.x(baselineX);
    yield* all(
      leftTrack.opacity(1, duration * 0.35, easing),
      rightTrack.opacity(1, duration * 0.35, easing),
      baseline.opacity(1, duration * 0.35, easing),
      all(
        leftBar.width(leftWidth, duration, easing),
        leftBar.x((baselineX + leftEnd) / 2, duration, easing),
        leftBar.opacity(1, duration * 0.4, easing),
      ),
      all(
        rightBar.width(rightWidth, duration, easing),
        rightBar.x((baselineX + rightEnd) / 2, duration, easing),
        rightBar.opacity(1, duration * 0.4, easing),
      ),
    );
  } else {
    const chartTop = -40;
    const chartBottom = options.height / 2 - 150;
    const chartHeight = chartBottom - chartTop;
    const baselineY = chartTop + chartHeight * maximum / span;
    const leftEnd = chartTop + chartHeight * (maximum - left) / span;
    const rightEnd = chartTop + chartHeight * (maximum - right) / span;
    const leftHeight = Math.abs(leftEnd - baselineY);
    const rightHeight = Math.abs(rightEnd - baselineY);
    const sideX = (options.width - 112 - 36) / 4 + 18;
    leftBar.x(-sideX);
    rightBar.x(sideX);
    leftBar.y(baselineY);
    rightBar.y(baselineY);
    leftBar.height(0);
    rightBar.height(0);
    baseline.y(baselineY);
    yield* all(
      leftTrack.opacity(1, duration * 0.35, easing),
      rightTrack.opacity(1, duration * 0.35, easing),
      baseline.opacity(1, duration * 0.35, easing),
      all(
        leftBar.height(leftHeight, duration, easing),
        leftBar.y((baselineY + leftEnd) / 2, duration, easing),
        leftBar.opacity(1, duration * 0.4, easing),
      ),
      all(
        rightBar.height(rightHeight, duration, easing),
        rightBar.y((baselineY + rightEnd) / 2, duration, easing),
        rightBar.opacity(1, duration * 0.4, easing),
      ),
    );
  }

  yield* all(
    fadeUp(leftValue, {distance: 14, duration: duration * 0.55, delay: duration * 0.08}),
    fadeUp(rightValue, {distance: 14, duration: duration * 0.55, delay: duration * 0.18}),
    options.showDifference && difference
      ? fadeUp(difference, {distance: 12, duration: duration * 0.45, delay: duration * 0.55})
      : waitFor(0),
    options.showPercentageChange && percentageChange
      ? fadeUp(percentageChange, {distance: 8, duration: duration * 0.4, delay: duration * 0.62})
      : waitFor(0),
  );
}

export function* playComparison(comparison: ComparisonInstance): ThreadGenerator {
  const {parts, options} = comparison;
  parts.root.opacity(1);
  parts.surface.opacity(0);
  for (const child of parts.root.children()) {
    if (child !== parts.surface) child.opacity(0);
  }
  yield* scaleIn(parts.surface, {
    duration: options.duration * 0.65,
    scale: 0.97,
    easing: options.easing,
  });
  yield* all(
    fadeUp(parts.title, {distance: 12, duration: options.duration * 0.48}),
    fadeUp(parts.subtitle, {distance: 8, duration: options.duration * 0.42, delay: 0.08}),
  );

  if (options.variant === 'data_comparison') {
    yield* all(
      fadeUp(parts.leftPanel, {distance: 10, duration: options.duration * 0.42}),
      fadeUp(parts.rightPanel, {distance: 10, duration: options.duration * 0.42, delay: 0.08}),
      fadeUp(parts.leftLabel, {distance: 8, duration: options.duration * 0.4}),
      fadeUp(parts.rightLabel, {distance: 8, duration: options.duration * 0.4, delay: 0.08}),
      fadeUp(parts.leftDescription, {distance: 6, duration: options.duration * 0.35}),
      fadeUp(parts.rightDescription, {distance: 6, duration: options.duration * 0.35, delay: 0.08}),
    );
    yield* animateDataChart(comparison);
    return;
  }

  if (options.variant === 'before_after') {
    yield* all(
      slideInLeft(parts.leftPanel, {distance: 44, duration: options.duration * 0.52, easing: options.easing}),
      fadeUp(parts.leftLabel, {distance: 10, duration: options.duration * 0.38, delay: 0.08}),
      fadeUp(parts.leftTitle, {distance: 12, duration: options.duration * 0.42, delay: 0.12}),
      fadeUp(parts.leftDescription, {distance: 10, duration: options.duration * 0.42, delay: 0.18}),
    );
    yield* waitFor(options.duration * 0.16);
    yield* all(
      slideInRight(parts.rightPanel, {distance: 44, duration: options.duration * 0.58, easing: options.easing}),
      fadeUp(parts.rightLabel, {distance: 10, duration: options.duration * 0.4, delay: 0.06}),
      fadeUp(parts.rightTitle, {distance: 12, duration: options.duration * 0.45, delay: 0.12}),
      fadeUp(parts.rightDescription, {distance: 10, duration: options.duration * 0.45, delay: 0.18}),
      fadeUp(parts.divider, {distance: 0, duration: options.duration * 0.4}),
      scaleIn(parts.centerMark, {duration: options.duration * 0.45, scale: 0.8, easing: options.easing}),
    );
    return;
  }

  yield* all(
    slideInLeft(parts.leftPanel, {distance: 58, duration: options.duration * 0.55, easing: options.easing}),
    fadeUp(parts.leftLabel, {distance: 12, duration: options.duration * 0.4, delay: 0.1}),
    fadeUp(parts.leftTitle, {distance: 16, duration: options.duration * 0.44, delay: 0.16}),
    fadeUp(parts.leftDescription, {distance: 12, duration: options.duration * 0.42, delay: 0.22}),
  );
  yield* waitFor(options.duration * 0.18);
  yield* all(
    slideInRight(parts.rightPanel, {distance: 58, duration: options.duration * 0.55, easing: options.easing}),
    fadeUp(parts.rightLabel, {distance: 12, duration: options.duration * 0.4, delay: 0.1}),
    fadeUp(parts.rightTitle, {distance: 16, duration: options.duration * 0.44, delay: 0.16}),
    fadeUp(parts.rightDescription, {distance: 12, duration: options.duration * 0.42, delay: 0.22}),
    scaleIn(parts.centerMark, {duration: options.duration * 0.5, scale: 0.76, easing: options.easing}),
  );
}

export function* exitComparison(
  comparison: ComparisonInstance,
  duration = 0.38,
): ThreadGenerator {
  if (!Number.isFinite(duration) || duration < 0.05 || duration > 10) {
    throw new RangeError('Comparison: exit duration must be between 0.05 and 10 seconds.');
  }
  yield* fadeOut(comparison.node, {duration, easing: 'easeInOutSine'});
}
