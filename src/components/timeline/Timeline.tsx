import {Color} from '@motion-canvas/core';
import {easingFunctions, type EasingName} from '../../animations/easing';
import {exitTimeline, playTimeline} from './animations';
import {calculateTimelineHeight, createTimelineParts} from './variants';
import type {
  ResolvedTimelineEventOptions,
  ResolvedTimelineOptions,
  TimelineAlignment,
  TimelineDateFormat,
  TimelineDirection,
  TimelineIconId,
  TimelineInstance,
  TimelineMarkerStyle,
  TimelineOptions,
  TimelineVariant,
} from './types';

type JsonRecord = Record<string, unknown>;

const variants: readonly TimelineVariant[] = [
  'vertical_timeline',
  'horizontal_timeline',
  'milestone_cards',
  'process_steps',
];
const alignments: readonly TimelineAlignment[] = ['left', 'center', 'right'];
const directions: readonly TimelineDirection[] = [
  'top_to_bottom',
  'bottom_to_top',
  'left_to_right',
  'right_to_left',
];
const markerStyles: readonly TimelineMarkerStyle[] = ['circle', 'square', 'diamond'];
const dateFormats: readonly TimelineDateFormat[] = ['text', 'year', 'date'];
const icons: readonly TimelineIconId[] = ['spark', 'arrow', 'dot', 'diamond', 'none'];

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
    throw new TypeError(`Timeline: "${name}" must be one of ${values.join(', ')}.`);
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
    throw new TypeError(`Timeline: "${name}" must be a finite number between ${minimum} and ${maximum}.`);
  }
  return value;
}

function stringValue(value: unknown, name: string, fallback: string, maxLength = 2000): string {
  if (value === undefined) return fallback;
  if (typeof value !== 'string') throw new TypeError(`Timeline: "${name}" must be a string.`);
  const result = value.trim();
  if (result.length > maxLength) {
    throw new RangeError(`Timeline: "${name}" cannot exceed ${maxLength} characters.`);
  }
  return result;
}

function colorValue(value: unknown, name: string, fallback: string): string {
  const color = stringValue(value, name, fallback, 80);
  try {
    if (!color) throw new TypeError();
    new Color(color);
  } catch {
    throw new TypeError(`Timeline: "${name}" must be a valid CSS color.`);
  }
  return color;
}

function booleanValue(value: unknown, name: string, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  if (typeof value !== 'boolean') throw new TypeError(`Timeline: "${name}" must be a boolean.`);
  return value;
}

function resolveEvent(
  value: unknown,
  index: number,
  options: {accentColor: string; duration: number},
): ResolvedTimelineEventOptions {
  if (!isRecord(value)) throw new TypeError(`Timeline: "events[${index}]" must be an object.`);
  const id = stringValue(value.id, `events[${index}].id`, '', 120);
  const date = stringValue(value.date, `events[${index}].date`, '', 60);
  const title = stringValue(value.title, `events[${index}].title`, '', 240);
  const description = stringValue(value.description, `events[${index}].description`, '', 2000);
  if (!id) throw new TypeError(`Timeline: "events[${index}].id" is required.`);
  if (!date) throw new TypeError(`Timeline: "events[${index}].date" is required.`);
  if (!title) throw new TypeError(`Timeline: "events[${index}].title" is required.`);
  if (!description) throw new TypeError(`Timeline: "events[${index}].description" is required.`);
  const number = stringValue(
    value.number === undefined ? String(index + 1).padStart(2, '0') : value.number,
    `events[${index}].number`,
    '',
    16,
  );
  if (!number) throw new TypeError(`Timeline: "events[${index}].number" cannot be empty.`);
  return Object.freeze({
    id,
    date,
    number,
    title,
    description,
    color: colorValue(value.color, `events[${index}].color`, options.accentColor),
    icon: enumValue(value.icon, icons, `events[${index}].icon`, 'none'),
    highlight: booleanValue(value.highlight, `events[${index}].highlight`, false),
    animationDelay: numberValue(
      value.animationDelay,
      `events[${index}].animationDelay`,
      0,
      0,
      options.duration * 10,
    ),
  });
}

function formatEventDate(event: ResolvedTimelineEventOptions, format: TimelineDateFormat, locale: string) {
  if (format === 'text') return event.date;
  if (format === 'year') {
    const year = event.date.match(/\b\d{4}\b/)?.[0];
    if (!year) throw new TypeError(`Timeline: date "${event.date}" for event "${event.id}" does not contain a four-digit year.`);
    return year;
  }
  const date = new Date(event.date);
  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`Timeline: date "${event.date}" for event "${event.id}" is not a valid date.`);
  }
  return new Intl.DateTimeFormat(locale, {dateStyle: 'medium', timeZone: 'UTC'}).format(date);
}

export function parseTimelineOptions(input: unknown): ResolvedTimelineOptions {
  if (!isRecord(input)) throw new TypeError('Timeline: configuration must be a JSON object.');
  if (input.component !== undefined && input.component !== 'timeline') {
    throw new TypeError('Timeline: "component" must be "timeline".');
  }
  const variant = enumValue(input.variant, variants, 'variant', 'vertical_timeline');
  const direction = enumValue(
    input.direction,
    directions,
    'direction',
    variant === 'horizontal_timeline' ? 'left_to_right' : 'top_to_bottom',
  );
  const horizontalDirection = direction === 'left_to_right' || direction === 'right_to_left';
  if ((variant === 'horizontal_timeline') !== horizontalDirection) {
    throw new TypeError(
      `Timeline: "${direction}" is incompatible with variant "${variant}".`,
    );
  }
  const animation = input.animation === undefined ? {} : input.animation;
  if (!isRecord(animation)) throw new TypeError('Timeline: "animation" must be a JSON object.');
  const duration = numberValue(animation.duration ?? input.duration, 'animation.duration', 0.7, 0.1, 10);
  const stagger = numberValue(animation.stagger ?? input.stagger, 'animation.stagger', 0.2, 0, 3);
  const easing = enumValue(
    animation.easing ?? input.easing,
    Object.keys(easingFunctions) as EasingName[],
    'animation.easing',
    'easeOutCubic',
  );
  if (!Array.isArray(input.events) || input.events.length < 2 || input.events.length > 6) {
    throw new RangeError('Timeline: "events" must contain between 2 and 6 items.');
  }
  const width = numberValue(input.width, 'width', 960, 600, 1000);
  const x = numberValue(input.x, 'x', 0, -540, 540);
  const y = numberValue(input.y, 'y', 0, -960, 960);
  const primaryColor = colorValue(input.primaryColor, 'primaryColor', '#191919');
  const accentColor = colorValue(input.accentColor, 'accentColor', '#F26A38');
  const backgroundColor = colorValue(input.backgroundColor, 'backgroundColor', '#FFFDF8');
  const events = input.events.map((event, index) => resolveEvent(event, index, {accentColor, duration}));
  const ids = new Set<string>();
  for (const event of events) {
    if (ids.has(event.id)) throw new TypeError(`Timeline: duplicate event id "${event.id}".`);
    ids.add(event.id);
  }
  const dateFormat = enumValue(input.dateFormat, dateFormats, 'dateFormat', 'text');
  const locale = stringValue(input.locale, 'locale', 'pt-BR', 64);
  for (const event of events) formatEventDate(event, dateFormat, locale);
  const eventSpacing = numberValue(input.eventSpacing, 'eventSpacing', 190, 110, 360);
  const title = stringValue(input.title, 'title', '', 90);
  const subtitle = stringValue(input.subtitle, 'subtitle', '', 160);
  const showTitle = booleanValue(input.showTitle, 'showTitle', title.length > 0);
  const showSubtitle = booleanValue(input.showSubtitle, 'showSubtitle', subtitle.length > 0);
  if (showTitle && !title) throw new TypeError('Timeline: "title" is required when "showTitle" is true.');
  if (showSubtitle && !subtitle) {
    throw new TypeError('Timeline: "subtitle" is required when "showSubtitle" is true.');
  }
  const sizingOptions = {variant, events, width, eventSpacing, showTitle, showSubtitle};
  const requiredHeight = calculateTimelineHeight(sizingOptions);
  const height = numberValue(input.height, 'height', Math.max(500, requiredHeight), 500, 1600);
  if (height < requiredHeight) {
    throw new RangeError(
      `Timeline: height ${height} is too small for this content; at least ${requiredHeight} is required.`,
    );
  }
  const highlightEventId = stringValue(input.highlightEventId, 'highlightEventId', '', 120);
  if (highlightEventId && !ids.has(highlightEventId)) {
    throw new TypeError(`Timeline: highlightEventId "${highlightEventId}" does not match an event id.`);
  }
  const resolvedEvents = events.map((event) =>
    Object.freeze({
      ...event,
      highlight: event.highlight || event.id === highlightEventId,
      date: formatEventDate(event, dateFormat, locale),
    }),
  );
  if (Math.abs(x) + width / 2 > 540 || Math.abs(y) + height / 2 > 960) {
    throw new RangeError(
      `Timeline: position and composition (${width}×${height}) must remain within the 1080×1920 composition.`,
    );
  }
  return Object.freeze({
    component: 'timeline',
    variant,
    title,
    subtitle,
    events: Object.freeze(resolvedEvents),
    x,
    y,
    width,
    height,
    alignment: enumValue(input.alignment, alignments, 'alignment', 'left'),
    showTitle,
    showSubtitle,
    primaryColor,
    accentColor,
    backgroundColor,
    duration,
    stagger,
    easing,
    direction,
    connectorWidth: numberValue(input.connectorWidth, 'connectorWidth', 4, 1, 16),
    markerSize: numberValue(input.markerSize, 'markerSize', 42, 24, 72),
    eventSpacing,
    markerStyle: enumValue(input.markerStyle, markerStyles, 'markerStyle', 'circle'),
    dateFormat,
    locale,
    showNumbers: booleanValue(input.showNumbers, 'showNumbers', true),
    highlightEventId,
  });
}

export function Timeline(options: TimelineOptions): TimelineInstance;
export function Timeline(configuration: unknown): TimelineInstance;
export function Timeline(configuration: unknown): TimelineInstance {
  const options = parseTimelineOptions(configuration);
  const parts = createTimelineParts(options);
  const instance: TimelineInstance = {
    node: parts.root,
    options,
    parts,
    play: () => playTimeline(instance),
    exit: (duration) => exitTimeline(instance, duration),
  };
  return instance;
}

export function createTimelineFromJSON(configuration: unknown): TimelineInstance {
  return Timeline(configuration);
}
