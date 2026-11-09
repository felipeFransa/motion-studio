import {Circle, Layout, Rect, Txt} from '@motion-canvas/2d';
import {createCenteredNumber, NumberedCircle} from '../numbered-circle';
import type {
  ResolvedTimelineEventOptions,
  ResolvedTimelineOptions,
  TimelineEventParts,
  TimelineParts,
} from './types';

interface EventLayout {
  x: number;
  y: number;
  textX: number;
  textY: number;
  textWidth: number;
  textAlign: CanvasTextAlign;
  titleHeight: number;
  markerX: number;
  markerY: number;
  panelWidth?: number;
  panelHeight?: number;
  iconX: number;
  dateY: number;
  titleY: number;
  descriptionY: number;
  descriptionHeight: number;
}

interface TimelineLayout {
  height: number;
  rowHeights: number[];
  orderedEvents: ResolvedTimelineEventOptions[];
  eventLayouts: EventLayout[];
  connectorLayouts: Array<{x: number; y: number; width: number; height: number; rotation?: number}>;
}

function estimateLines(text: string, width: number, fontSize: number): number {
  const charsPerLine = Math.max(10, Math.floor(width / (fontSize * 0.54)));
  return text.split('\n').reduce((total, line) => total + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);
}

function orderedEvents(options: ResolvedTimelineOptions): ResolvedTimelineEventOptions[] {
  const events = [...options.events];
  if (options.direction === 'bottom_to_top') {
    events.reverse();
  }
  return events;
}

function rowHeight(
  options: Pick<ResolvedTimelineOptions, 'eventSpacing'>,
  events: readonly ResolvedTimelineEventOptions[],
  textWidth: number,
  baseHeight: number,
): number {
  const contentHeight = Math.max(...events.map((event) => {
    const descriptionLines = estimateLines(event.description, textWidth, 21);
    const titleLines = estimateLines(event.title, textWidth, 28);
    const extraTitle = Math.max(0, titleLines - 1) * 36;
    const extraDesc = Math.max(0, descriptionLines - 2) * 26;
    return baseHeight + extraTitle + extraDesc;
  }));
  return Math.max(options.eventSpacing, contentHeight);
}

function layoutTimeline(options: ResolvedTimelineOptions): TimelineLayout {
  const items = orderedEvents(options);
  const innerWidth = options.width - 96;
  const headerHeight = options.showTitle && options.showSubtitle
    ? 210
    : options.showTitle || options.showSubtitle ? 155 : 82;
  const top = -options.height / 2 + headerHeight;
  const positions: EventLayout[] = [];
  const rowHeights: number[] = [];
  const connectorLayouts: TimelineLayout['connectorLayouts'] = [];

  if (options.variant === 'horizontal_timeline') {
    const groups: ResolvedTimelineEventOptions[][] = [];
    for (let index = 0; index < items.length; index += 2) {
      groups.push(items.slice(index, index + 2));
    }
    const textWidth = innerWidth / 2 - 36;
    for (const group of groups) rowHeights.push(rowHeight(options, group, textWidth, 230));
    const total = rowHeights.reduce((sum, height) => sum + height, 0);
    const availableSpace = options.height - headerHeight - total;
    const topPadding = Math.max(20, availableSpace / 2);
    let cursor = top + topPadding;
    const cellWidth = innerWidth / 2;
    const startX = -innerWidth / 2 + cellWidth / 2;
    const isRightToLeft = options.direction === 'right_to_left';
    const markerRadius = options.markerSize / 2;

    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      const height = rowHeights[groupIndex] ?? options.eventSpacing;
      const centerY = cursor + height / 2;
      const group = groups[groupIndex] ?? [];
      const markerY = cursor + 20 + markerRadius;
      const markerRelY = markerY - centerY;
      const rowStartsOnRight = isRightToLeft ? (groupIndex % 2 === 0) : (groupIndex % 2 === 1);

      // Intra-row connector
      if (group.length > 1) {
        const col0 = rowStartsOnRight ? 1 : 0;
        const col1 = rowStartsOnRight ? 0 : 1;
        const x0 = startX + col0 * cellWidth;
        const x1 = startX + col1 * cellWidth;
        connectorLayouts.push({
          x: (x0 + x1) / 2,
          y: markerY,
          width: cellWidth - options.markerSize,
          height: options.connectorWidth,
        });
      }

      for (let cellIndex = 0; cellIndex < group.length; cellIndex++) {
        const event = group[cellIndex];
        if (!event) continue;
        const column = rowStartsOnRight ? (1 - cellIndex) : cellIndex;
        const x = startX + column * cellWidth;
        const titleLines = estimateLines(event.title, textWidth, 28);
        const titleHeight = Math.max(34, titleLines * 34);
        const descriptionLines = estimateLines(event.description, textWidth, 21);
        const descriptionHeight = Math.max(26, descriptionLines * 25);

        const dateY = markerRelY + markerRadius + 14 + 12;
        const titleY = (dateY + 12) + 8 + titleHeight / 2;
        const descriptionY = (titleY + titleHeight / 2) + 8 + descriptionHeight / 2;

        positions.push({
          x,
          y: centerY,
          textX: -textWidth / 2,
          textY: -height / 2 + 70,
          textWidth,
          textAlign: options.alignment === 'left' ? 'left' : options.alignment === 'right' ? 'right' : 'center',
          titleHeight,
          markerX: 0,
          markerY: markerRelY,
          iconX: textWidth / 2 - 12,
          dateY,
          titleY,
          descriptionY,
          descriptionHeight,
        });
      }

      // Inter-row connector (looping around edge to next row)
      if (groupIndex < groups.length - 1 && group.length > 0) {
        const terminalColumn = rowStartsOnRight ? (1 - (group.length - 1)) : (group.length - 1);
        const nextRowStartsOnRight = isRightToLeft ? ((groupIndex + 1) % 2 === 0) : ((groupIndex + 1) % 2 === 1);
        const nextColumn = nextRowStartsOnRight ? 1 : 0;
        const terminalX = startX + terminalColumn * cellWidth;
        const nextX = startX + nextColumn * cellWidth;
        const nextMarkerY = (cursor + height) + 20 + markerRadius;

        if (terminalColumn === 1) {
          // Snake around RIGHT edge
          const edgeX = innerWidth / 2 - 16;
          const seg1Width = Math.max(4, edgeX - (terminalX + markerRadius));
          connectorLayouts.push({
            x: (terminalX + markerRadius + edgeX) / 2,
            y: markerY,
            width: seg1Width,
            height: options.connectorWidth,
          });
          connectorLayouts.push({
            x: edgeX,
            y: (markerY + nextMarkerY) / 2,
            width: options.connectorWidth,
            height: nextMarkerY - markerY,
          });
          const seg3Width = Math.max(4, edgeX - (nextX + markerRadius));
          connectorLayouts.push({
            x: (edgeX + nextX + markerRadius) / 2,
            y: nextMarkerY,
            width: seg3Width,
            height: options.connectorWidth,
          });
        } else {
          // Snake around LEFT edge
          const edgeX = -innerWidth / 2 + 16;
          const seg1Width = Math.max(4, (terminalX - markerRadius) - edgeX);
          connectorLayouts.push({
            x: (terminalX - markerRadius + edgeX) / 2,
            y: markerY,
            width: seg1Width,
            height: options.connectorWidth,
          });
          connectorLayouts.push({
            x: edgeX,
            y: (markerY + nextMarkerY) / 2,
            width: options.connectorWidth,
            height: nextMarkerY - markerY,
          });
          const seg3Width = Math.max(4, (nextX - markerRadius) - edgeX);
          connectorLayouts.push({
            x: (edgeX + nextX - markerRadius) / 2,
            y: nextMarkerY,
            width: seg3Width,
            height: options.connectorWidth,
          });
        }
      }

      cursor += height;
    }
  } else {
    const textWidth = options.variant === 'vertical_timeline'
      ? innerWidth - 100
      : innerWidth - 150;
    const baseHeight = options.variant === 'milestone_cards' ? 152 : 140;
    for (const event of items) {
      const contentHeight = rowHeight(options, [event], textWidth - (options.variant === 'vertical_timeline' ? 0 : 20), baseHeight);
      rowHeights.push(Math.max(contentHeight, options.eventSpacing));
    }
    const total = rowHeights.reduce((sum, height) => sum + height, 0);
    let cursor = top + Math.max(0, (options.height - headerHeight - total - 50) / 2);
    const lineX = -options.width / 2 + 66;
    const panelWidth = innerWidth - 20;
    for (let index = 0; index < items.length; index++) {
      const height = rowHeights[index] ?? options.eventSpacing;
      const centerY = cursor + height / 2;
      const isCard = options.variant === 'milestone_cards' || options.variant === 'process_steps';
      const markerX = options.variant === 'process_steps'
        ? -options.width / 2 + 40
        : isCard ? -panelWidth / 2 + 46 : lineX;
      const connectorX = isCard ? markerX : lineX;
      const textX = options.variant === 'process_steps'
        ? markerX + 52
        : isCard ? -panelWidth / 2 + 96 : lineX + 58;
      const textAlign = options.alignment === 'center'
        ? 'center'
        : options.alignment === 'right' ? 'right' : 'left';
      const event = items[index];
      if (!event) continue;
      const textWidth = isCard ? panelWidth - 132 : options.width - 200;
      const titleHeight = Math.max(42, estimateLines(event.title, textWidth, 29) * 38);
      const descriptionTop = -height / 2 + 57 + titleHeight + 5;
      const descriptionHeight = Math.max(42, height - (70 + titleHeight));
      positions.push({
        x: 0,
        y: centerY,
        textX,
        textY: 0,
        textWidth,
        textAlign,
        titleHeight,
        markerX,
        markerY: 0,
        iconX: isCard ? panelWidth / 2 - 34 : options.width / 2 - 52,
        dateY: -height / 2 + 37,
        titleY: -height / 2 + 57 + titleHeight / 2,
        descriptionY: descriptionTop + descriptionHeight / 2,
        descriptionHeight,
        ...(isCard ? {panelWidth, panelHeight: height - 12} : {}),
      });
      if (index < items.length - 1 && options.variant !== 'process_steps') {
        const nextHeight = rowHeights[index + 1] ?? options.eventSpacing;
        connectorLayouts.push({
          x: connectorX,
          y: centerY + (height + nextHeight) / 4,
          width: options.connectorWidth,
          height: (height + nextHeight) / 2,
        });
      }
      cursor += height;
    }
  }

  return {
    height: options.height,
    rowHeights,
    orderedEvents: items,
    eventLayouts: positions,
    connectorLayouts,
  };
}

function makeText(
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize: number,
  fill: string,
  weight: number,
  textAlign: CanvasTextAlign,
): Txt {
  return new Txt({
    text,
    x,
    y,
    width,
    height,
    maxWidth: width,
    fontFamily: 'Arial',
    fontSize,
    fontWeight: weight,
    fill,
    textAlign,
    textWrap: true,
    opacity: 0,
  });
}

function makeEventParts(
  event: ResolvedTimelineEventOptions,
  layout: EventLayout,
  options: ResolvedTimelineOptions,
): TimelineEventParts {
  const markerFill = event.highlight ? event.color : options.backgroundColor;
  const markerStroke = event.color;
  let marker: Circle | Rect;
  let markerGroup: Layout;
  let number: Txt;
  if (options.markerStyle === 'circle') {
    const numberedCircle = NumberedCircle({
      number: options.showNumbers ? event.number : '',
      size: options.markerSize,
      circleColor: markerFill,
      textColor: event.highlight ? options.backgroundColor : event.color,
      fontSize: Math.min(18, options.markerSize * 0.42),
      fontWeight: 800,
      strokeColor: markerStroke,
      strokeWidth: 3,
      x: layout.markerX,
      y: layout.markerY,
    });
    marker = numberedCircle.circle;
    markerGroup = numberedCircle.node;
    number = numberedCircle.number;
  } else {
    marker = new Rect({
      x: 0,
      y: 0,
      layout: false,
      width: options.markerSize,
      height: options.markerSize,
      radius: options.markerStyle === 'square' ? 5 : 2,
      rotation: options.markerStyle === 'diamond' ? 45 : 0,
      fill: markerFill,
      stroke: markerStroke,
      lineWidth: 3,
    });
    number = createCenteredNumber(
      options.showNumbers ? event.number : '',
      options.markerSize,
      event.highlight ? options.backgroundColor : event.color,
      Math.min(18, options.markerSize * 0.42),
      800,
    );
    markerGroup = new Layout({
      x: layout.markerX,
      y: layout.markerY,
      width: options.markerSize,
      height: options.markerSize,
      layout: true,
      direction: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      opacity: 0,
    });
    markerGroup.children([marker, number]);
  }

  const panel = layout.panelWidth && layout.panelHeight
    ? new Rect({
        width: layout.panelWidth,
        height: layout.panelHeight,
        radius: options.variant === 'process_steps' ? 18 : 26,
        fill: event.highlight ? '#FFF7EC' : '#FBF8F1',
        stroke: event.highlight ? event.color : '#E8E0D3',
        lineWidth: event.highlight ? 2 : 1,
        opacity: 0,
      })
    : undefined;
  const iconGlyph: Record<ResolvedTimelineEventOptions['icon'], string> = {
    spark: '+',
    arrow: '›',
    dot: '•',
    diamond: '◇',
    none: '',
  };
  const icon = makeText(
    iconGlyph[event.icon],
    layout.iconX,
    layout.dateY,
    28,
    28,
    22,
    event.color,
    700,
    'center',
  );
  const date = makeText(
    event.date,
    layout.textX + layout.textWidth / 2,
    layout.dateY,
    layout.textWidth,
    34,
    Math.max(11, Math.min(22, layout.textWidth / (event.date.length * 0.58))),
    event.color,
    800,
    layout.textAlign,
  );
  const title = makeText(
    event.title,
    layout.textX + layout.textWidth / 2,
    layout.titleY,
    layout.textWidth,
    layout.titleHeight,
    options.variant === 'milestone_cards' ? 29 : 28,
    options.primaryColor,
    800,
    layout.textAlign,
  );
  const description = makeText(
    event.description,
    layout.textX + layout.textWidth / 2,
    layout.descriptionY,
    layout.textWidth,
    layout.descriptionHeight,
    21,
    '#777064',
    400,
    layout.textAlign,
  );
  const children = [markerGroup, icon, date, title, description];
  if (panel) children.unshift(panel);
  const node = new Layout({x: layout.x, y: layout.y, children});
  return {
    id: event.id,
    node,
    markerGroup,
    marker,
    number,
    icon,
    date,
    title,
    description,
    ...(panel ? {panel} : {}),
  };
}

export function calculateTimelineHeight(
  options: Pick<
    ResolvedTimelineOptions,
    'variant' | 'events' | 'width' | 'eventSpacing' | 'showTitle' | 'showSubtitle'
  >,
): number {
  const innerWidth = options.width - 96;
  let rowHeights: number[];
  if (options.variant === 'horizontal_timeline') {
    const groups: ResolvedTimelineEventOptions[][] = [];
    for (let index = 0; index < options.events.length; index += 2) {
      groups.push(options.events.slice(index, index + 2));
    }
    const textWidth = innerWidth / 2 - 36;
    rowHeights = groups.map((group) => rowHeight(options, group, textWidth, 230));
  } else {
    const textWidth = options.variant === 'vertical_timeline' ? innerWidth - 100 : innerWidth - 170;
    const baseHeight = options.variant === 'milestone_cards' ? 152 : 140;
    rowHeights = options.events.map((event) => rowHeight(options, [event], textWidth, baseHeight));
  }
  const headerHeight = options.showTitle && options.showSubtitle
    ? 210
    : options.showTitle || options.showSubtitle ? 155 : 82;
  return Math.ceil(headerHeight + 40 + rowHeights.reduce((sum, height) => sum + height, 0));
}

export function createTimelineParts(options: ResolvedTimelineOptions): TimelineParts {
  const layout = layoutTimeline(options);
  const height = options.height;
  const innerWidth = options.width - 96;
  const surface = new Rect({
    width: options.width,
    height,
    radius: 32,
    fill: options.backgroundColor,
    stroke: '#E8E0D3',
    lineWidth: 1,
    shadowColor: '#19191920',
    shadowBlur: 24,
    shadowOffsetY: 12,
    opacity: 0,
  });
  const title = makeText(
    options.title,
    0,
    -height / 2 + 52,
    innerWidth,
    options.showTitle ? 78 : 0,
    36,
    options.primaryColor,
    800,
    'center',
  );
  const subtitle = makeText(
    options.subtitle,
    0,
    -height / 2 + (options.showTitle ? 115 : 68),
    innerWidth,
    options.showSubtitle ? 44 : 0,
    22,
    '#777064',
    400,
    'center',
  );
  if (!options.showTitle) title.opacity(0);
  if (!options.showSubtitle) subtitle.opacity(0);
  const connectors = layout.connectorLayouts.map((connector, index) => {
    const horizontal = connector.width > connector.height;
    const rect = new Rect({
      x: connector.x,
      y: connector.y,
      width: connector.width,
      height: connector.height,
      radius: options.connectorWidth / 2,
      fill: options.variant === 'process_steps' ? '#D8CBB7' : options.accentColor,
      opacity: 0,
      scale: horizontal ? [0, 1] : [1, 0],
      zIndex: 0,
    });
    return rect;
  });

  const eventLayouts = layout.eventLayouts;
  const events = layout.orderedEvents.map((event, index) => {
    const eventLayout = eventLayouts[index];
    if (!eventLayout) {
      throw new Error(`Timeline: missing layout for event "${event.id}".`);
    }
    return makeEventParts(event, eventLayout, options);
  });
  let progressTrack: Rect | undefined;
  let progressFill: Rect | undefined;
  if (options.variant === 'process_steps' && events.length > 1) {
    const first = events[0]?.node.position.y() ?? 0;
    const last = events[events.length - 1]?.node.position.y() ?? 0;
    const panelWidth = innerWidth - 20;
    const x = -options.width / 2 + 40;
    const totalHeight = Math.max(0, last - first);
    progressTrack = new Rect({
      x,
      y: (first + last) / 2,
      width: options.connectorWidth,
      height: totalHeight,
      radius: options.connectorWidth / 2,
      fill: '#E8E0D3',
      opacity: 0,
      zIndex: 0,
    });
    progressFill = new Rect({
      x,
      y: first,
      width: options.connectorWidth,
      height: 0,
      radius: options.connectorWidth / 2,
      fill: options.accentColor,
      opacity: 0,
      zIndex: 0,
    });
  }

  const children = [
    surface,
    ...connectors,
    ...(progressTrack ? [progressTrack] : []),
    ...(progressFill ? [progressFill] : []),
    title,
    subtitle,
    ...events.map((event) => event.node),
  ];
  const root = new Layout({x: options.x, y: options.y, children});
  return {
    root,
    surface,
    title,
    subtitle,
    connectors,
    events,
    ...(progressTrack ? {progressTrack} : {}),
    ...(progressFill ? {progressFill} : {}),
  };
}
