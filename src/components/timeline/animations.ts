import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';
import {resolveEasing} from '../../animations/easing';
import {fadeOut, fadeUp, scaleIn, slideInLeft, slideInRight, slideInUp} from '../../animations/transitions';
import type {TimelineEventParts, TimelineInstance} from './types';

function* revealEvent(
  event: TimelineEventParts,
  duration: number,
  easing: TimelineInstance['options']['easing'],
  direction: 'up' | 'left' | 'right' = 'up',
): ThreadGenerator {
  const panelAnimation = event.panel
    ? fadeUp(event.panel, {distance: 14, duration, easing})
    : waitFor(0);
  const markerAnimation = scaleIn(event.markerGroup, {
    duration: duration * 0.78,
    scale: 0.65,
    easing,
  });
  const iconAnimation = fadeUp(event.icon, {distance: 4, duration: duration * 0.55, easing});
  const dateAnimation = fadeUp(event.date, {distance: 8, duration: duration * 0.62, delay: 0.03, easing});
  const titleAnimation = fadeUp(event.title, {distance: 10, duration: duration * 0.72, delay: 0.06, easing});
  const descriptionAnimation = fadeUp(event.description, {
    distance: 8,
    duration: duration * 0.7,
    delay: 0.1,
    easing,
  });
  const content = all(
    panelAnimation,
    markerAnimation,
    iconAnimation,
    dateAnimation,
    titleAnimation,
    descriptionAnimation,
  );
  if (direction === 'left') {
    yield* all(slideInRight(event.node, {distance: 24, duration, easing}), content);
  } else if (direction === 'right') {
    yield* all(slideInLeft(event.node, {distance: 24, duration, easing}), content);
  } else {
    yield* all(content);
  }
}

function* revealConnector(
  connector: TimelineInstance['parts']['connectors'][number],
  duration: number,
  easing: TimelineInstance['options']['easing'],
) {
  connector.opacity(1);
  yield* connector.scale([1, 1], duration, resolveEasing(easing));
}

function eventDelay(instance: TimelineInstance, event: TimelineEventParts): number {
  return instance.options.events.find((option) => option.id === event.id)?.animationDelay ?? 0;
}

function* playVertical(instance: TimelineInstance): ThreadGenerator {
  const {parts, options} = instance;
  for (let index = 0; index < parts.events.length; index++) {
    const event = parts.events[index];
    if (!event) continue;
    const delay = eventDelay(instance, event);
    if (delay > 0) yield* waitFor(delay);
    yield* revealEvent(event, options.duration, options.easing);
    const connector = parts.connectors[index];
    if (connector) yield* revealConnector(connector, options.duration * 0.5, options.easing);
    if (index < parts.events.length - 1 && options.stagger > 0) yield* waitFor(options.stagger);
  }
}

function* playHorizontal(instance: TimelineInstance): ThreadGenerator {
  const {parts, options} = instance;
  let connectorIndex = 0;
  const totalEvents = parts.events.length;

  for (let eventIndex = 0; eventIndex < totalEvents; eventIndex += 2) {
    const first = parts.events[eventIndex];
    const second = parts.events[eventIndex + 1];
    if (!first) continue;

    // 1. Reveal first event in row
    const firstDelay = eventDelay(instance, first);
    if (firstDelay > 0) yield* waitFor(firstDelay);
    yield* revealEvent(first, options.duration * 0.75, options.easing);

    // 2. If row has a second event, extend connector then reveal second event
    if (second) {
      const pairConnector = parts.connectors[connectorIndex++];
      if (pairConnector) {
        yield* revealConnector(pairConnector, options.duration * 0.42, options.easing);
      }
      if (options.stagger > 0) yield* waitFor(options.stagger);
      const secondDelay = eventDelay(instance, second);
      if (secondDelay > 0) yield* waitFor(secondDelay);
      yield* revealEvent(second, options.duration * 0.75, options.easing);
    }

    // 3. If there are more rows, extend inter-row loop connectors down to next row
    if (eventIndex + 2 < totalEvents) {
      if (options.stagger > 0) yield* waitFor(options.stagger);
      for (let segment = 0; segment < 3; segment++) {
        const connector = parts.connectors[connectorIndex++];
        if (connector) {
          yield* revealConnector(connector, options.duration * 0.2, options.easing);
        }
      }
      if (options.stagger > 0) yield* waitFor(options.stagger);
    }
  }
}

function* playMilestones(instance: TimelineInstance): ThreadGenerator {
  const {parts, options} = instance;
  for (let index = 0; index < parts.events.length; index++) {
    const event = parts.events[index];
    if (!event) continue;
    const delay = eventDelay(instance, event);
    if (delay > 0) yield* waitFor(delay);
    yield* all(
      slideInUp(event.node, {distance: 22, duration: options.duration, easing: options.easing}),
      revealEvent(event, options.duration * 0.8, options.easing),
    );
    const connector = parts.connectors[index];
    if (connector) yield* revealConnector(connector, options.duration * 0.48, options.easing);
    if (index < parts.events.length - 1 && options.stagger > 0) yield* waitFor(options.stagger);
  }
}

function* playProcessSteps(instance: TimelineInstance): ThreadGenerator {
  const {parts, options} = instance;
  const firstY = parts.events[0]?.node.position.y() ?? 0;
  if (parts.progressTrack) yield* parts.progressTrack.opacity(1, options.duration * 0.4);
  if (parts.progressFill) yield* parts.progressFill.opacity(1, options.duration * 0.4);
  for (let index = 0; index < parts.events.length; index++) {
    const event = parts.events[index];
    if (!event) continue;
    const delay = eventDelay(instance, event);
    if (delay > 0) yield* waitFor(delay);
    const previous = parts.events[index - 1];
    if (previous?.panel) {
      const previousOption = options.events.find((item) => item.id === previous.id);
      yield* previous.panel.stroke(
        previousOption?.highlight ? previousOption.color : '#E8E0D3',
        options.duration * 0.2,
      );
    }
    if (previous) {
      const previousOption = options.events.find((item) => item.id === previous.id);
      if (!previousOption?.highlight) {
        yield* previous.marker.fill(options.backgroundColor, options.duration * 0.2);
      }
    }
    yield* revealEvent(event, options.duration * 0.8, options.easing, index % 2 === 0 ? 'left' : 'right');
    if (event.panel) {
      yield* event.panel.stroke(options.accentColor, options.duration * 0.25);
    }
    const progress = parts.progressFill;
    if (progress) {
      const targetY = event.node.position.y();
      const fillHeight = Math.max(options.connectorWidth, targetY - firstY);
      yield* all(
        progress.height(fillHeight, options.duration * 0.58, undefined),
        progress.y(firstY + fillHeight / 2, options.duration * 0.58, undefined),
      );
    }
    if (index < parts.events.length - 1 && options.stagger > 0) yield* waitFor(options.stagger);
  }
}

export function* playTimeline(instance: TimelineInstance): ThreadGenerator {
  const {parts, options} = instance;
  parts.root.position([options.x, options.y]);
  parts.surface.opacity(0);
  parts.title.opacity(0);
  parts.subtitle.opacity(0);
  for (const connector of parts.connectors) {
    connector.opacity(0);
    connector.scale(connector.width() > connector.height() ? [0, 1] : [1, 0]);
  }
  if (parts.progressTrack) parts.progressTrack.opacity(0);
  if (parts.progressFill) {
    parts.progressFill.opacity(0);
    parts.progressFill.height(0);
  }
  for (const event of parts.events) {
    for (const child of event.node.children()) {
      child.opacity(0);
      if ('scale' in child) child.scale(1);
    }
  }

  yield* all(
    scaleIn(parts.surface, {duration: options.duration * 0.72, scale: 0.98, easing: options.easing}),
    options.showTitle
      ? fadeUp(parts.title, {distance: 12, duration: options.duration * 0.62, easing: options.easing})
      : waitFor(0),
    options.showSubtitle
      ? fadeUp(parts.subtitle, {distance: 8, duration: options.duration * 0.54, delay: 0.05, easing: options.easing})
      : waitFor(0),
  );
  switch (options.variant) {
    case 'horizontal_timeline':
      yield* playHorizontal(instance);
      break;
    case 'milestone_cards':
      yield* playMilestones(instance);
      break;
    case 'process_steps':
      yield* playProcessSteps(instance);
      break;
    case 'vertical_timeline':
    default:
      yield* playVertical(instance);
  }
}

export function* exitTimeline(instance: TimelineInstance, duration = 0.42): ThreadGenerator {
  if (!Number.isFinite(duration) || duration < 0.05 || duration > 10) {
    throw new RangeError('Timeline: exit duration must be between 0.05 and 10 seconds.');
  }
  yield* fadeOut(instance.node, {duration, easing: 'easeInOutSine'});
}
