import {Circle, Layout, Rect, Txt} from '@motion-canvas/2d';
import type {ResolvedStatCardOptions, StatCardParts} from './types';

function text(
  value: string,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  color: string,
  weight = 700,
  align: CanvasTextAlign = 'left',
): Txt {
  return new Txt({
    text: value,
    x,
    y,
    width,
    maxWidth: width,
    fontFamily: 'Arial',
    fontSize,
    fontWeight: weight,
    fill: color,
    textAlign: align,
    textWrap: true,
    opacity: 0,
  });
}

export function createStatCardParts(options: ResolvedStatCardOptions): StatCardParts {
  const {width, height} = options;
  const left = -width / 2 + 48;
  const innerWidth = width - 96;
  const dark = options.variant === 'counter_impact';
  const foreground = dark ? '#FFFDF8' : options.color;
  const muted = dark ? '#C9C1B5' : '#777064';

  const surface = new Rect({
    width,
    height,
    radius: 32,
    fill: options.backgroundColor,
    stroke: dark ? options.backgroundColor : '#E8E0D3',
    lineWidth: 1,
    shadowColor: '#19191920',
    shadowBlur: 24,
    shadowOffsetY: 12,
    opacity: 0,
  });
  const accentRule = new Rect({
    x: left + 40,
    y: -height / 2 + 44,
    width: 76,
    height: 5,
    radius: 3,
    fill: options.accentColor,
    opacity: 0,
  });
  const eyebrow = text(
    options.variant === 'counter_impact' ? 'VALOR EM FOCO' : 'DADO EM DESTAQUE',
    left + innerWidth / 2,
    -height / 2 + 72,
    innerWidth,
    18,
    muted,
    700,
    options.alignment === 'center' ? 'center' : options.alignment === 'right' ? 'right' : 'left',
  );
  const value = text(
    '',
    0,
    options.variant === 'comparison_stat' ? -190 : -54,
    innerWidth,
    options.fontSize,
    options.variant === 'counter_impact' || options.variant === 'editorial_stat'
      ? options.accentColor
      : options.color,
    900,
    options.alignment === 'center' ? 'center' : options.alignment === 'right' ? 'right' : 'left',
  );
  const title = text(
    options.title,
    0,
    options.variant === 'comparison_stat' ? -82 : 84,
    innerWidth,
    30,
    foreground,
    800,
    options.alignment === 'center' ? 'center' : options.alignment === 'right' ? 'right' : 'left',
  );
  const description = text(
    options.description,
    0,
    options.variant === 'comparison_stat' ? -34 : 142,
    innerWidth,
    21,
    muted,
    400,
    options.alignment === 'center' ? 'center' : options.alignment === 'right' ? 'right' : 'left',
  );

  const children: Array<Rect | Txt | Circle> = [
    surface,
    accentRule,
    eyebrow,
    value,
    title,
    description,
  ];
  const parts: StatCardParts = {
    root: new Layout({x: options.x, y: options.y}),
    surface,
    accentRule,
    value,
    title,
    description,
    eyebrow,
  };

  if (options.variant === 'progress_stat') {
    const barWidth = innerWidth;
    const trackY = 170;
    const track = new Rect({
      x: 0,
      y: trackY,
      width: barWidth,
      height: 18,
      radius: 9,
      fill: options.trackColor,
      opacity: 0,
    });
    const bar = new Rect({
      x: -barWidth / 2,
      y: trackY,
      width: 0,
      height: 18,
      radius: 9,
      fill: options.progressColor,
      opacity: 1,
    });
    const marker = new Circle({
      x: -barWidth / 2,
      y: trackY,
      size: 28,
      fill: options.progressColor,
      stroke: options.backgroundColor,
      lineWidth: 5,
      opacity: 0,
    });
    const progressLabel = text(
      'PROGRESSO',
      left + innerWidth / 2,
      218,
      innerWidth,
      16,
      muted,
      700,
      options.alignment === 'center' ? 'center' : 'left',
    );
    children.push(track, bar, marker, progressLabel);
    parts.progressTrack = track;
    parts.progressBar = bar;
    parts.progressLabel = progressLabel;
    parts.progressMarker = marker;
  }

  if (options.variant === 'comparison_stat') {
    const compareTop = 16;
    const previousLabel = text(
      options.previousLabel ?? 'ANTERIOR',
      left + innerWidth / 2,
      compareTop,
      innerWidth,
      16,
      muted,
    );
    const previousValue = text(
      '',
      left + innerWidth / 2,
      compareTop + 36,
      innerWidth,
      30,
      foreground,
      800,
    );
    const previousBar = new Rect({
      x: left,
      y: compareTop + 76,
      width: 0,
      height: 16,
      radius: 8,
      fill: '#D8CBB7',
      opacity: 1,
    });
    const currentLabel = text(
      options.currentLabel ?? 'ATUAL',
      left + innerWidth / 2,
      compareTop + 126,
      innerWidth,
      16,
      muted,
    );
    const currentValue = text(
      '',
      left + innerWidth / 2,
      compareTop + 162,
      innerWidth,
      30,
      options.accentColor,
      800,
    );
    const currentBar = new Rect({
      x: left,
      y: compareTop + 204,
      width: 0,
      height: 18,
      radius: 9,
      fill: options.accentColor,
      opacity: 1,
    });
    const difference = text('', 0, compareTop + 260, innerWidth, 32, options.accentColor, 800,
      options.alignment === 'center' ? 'center' : 'left');
    const growthIndicator = text('', left + innerWidth - 20, compareTop + 260, 40, 30, options.accentColor, 800, 'right');

    children.push(previousLabel, previousValue, previousBar, currentLabel, currentValue, currentBar, difference, growthIndicator);
    Object.assign(parts, {
      previousLabel,
      previousValue,
      previousBar,
      currentLabel,
      currentValue,
      currentBar,
      difference,
      growthIndicator,
    });
  }

  parts.root.children(children);
  return parts;
}
