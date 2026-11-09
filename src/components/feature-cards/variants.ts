import {Circle, Layout, Rect, Txt} from '@motion-canvas/2d';
import type {
  FeatureCardParts,
  FeatureCardsParts,
  ResolvedFeatureCardsOptions,
} from './types';

interface CardLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  style: 'stack' | 'grid' | 'spotlight' | 'sequential';
}

function estimatedLines(value: string, width: number, fontSize: number): number {
  const charsPerLine = Math.max(8, Math.floor(width / (fontSize * 0.53)));
  return value.split('\n').reduce(
    (total, line) => total + Math.max(1, Math.ceil(line.length / charsPerLine)),
    0,
  );
}

function headerMetrics(title: string, subtitle: string, maxWidth: number) {
  const titleLines = Math.max(1, estimatedLines(title, maxWidth - 72, 36));
  const subtitleLines = Math.max(1, estimatedLines(subtitle, maxWidth - 80, 20));
  const subtitleOffset = Math.max(106, 58 + titleLines * 21 + 18 + subtitleLines * 12);
  return {
    subtitleOffset,
    space: Math.max(150, subtitleOffset + subtitleLines * 12 + 20),
  };
}

function stackCardHeight(card: ResolvedFeatureCardsOptions['cards'][number], width: number): number {
  const contentWidth = width - 72 - 48 - 26;
  const titleLines = estimatedLines(card.title, contentWidth, 29);
  const descriptionLines = estimatedLines(card.description, contentWidth, 20);
  return Math.max(
    142,
    2 * (42 + descriptionLines * 11 + 12),
    2 * (-2 + titleLines * 17 + 10),
  );
}

function gridCardHeight(
  card: ResolvedFeatureCardsOptions['cards'][number],
  width: number,
): number {
  const contentWidth = width - 48;
  const titleFontSize = 26;
  const descriptionFontSize = 19;
  const titleLines = estimatedLines(card.title, contentWidth, titleFontSize);
  const descriptionLines = estimatedLines(card.description, contentWidth, descriptionFontSize);
  return Math.max(
    220,
    2 * (70 + descriptionLines * 10.5 + 12),
    2 * (20 + titleLines * 15 + 10),
  );
}

function heroCardHeight(card: ResolvedFeatureCardsOptions['cards'][number], width: number): number {
  const contentWidth = width - 72 - 64 - 26;
  const titleLines = estimatedLines(card.title, contentWidth, 38);
  const descriptionLines = estimatedLines(card.description, contentWidth, 23);
  return Math.max(
    236,
    2 * (44 + descriptionLines * 13 + 14),
    2 * (-18 + titleLines * 23 + 12),
  );
}

export function calculateFeatureCardsHeight(
  variant: ResolvedFeatureCardsOptions['variant'],
  cards: ResolvedFeatureCardsOptions['cards'],
  maxWidth: number,
  title: string,
  subtitle: string,
): number {
  const gap = 18;
  let contentHeight = 0;
  if (variant === 'feature_grid') {
    const cardWidth = (maxWidth - 56 - gap) / 2;
    for (let row = 0; row < Math.ceil(cards.length / 2); row++) {
      const rowCards = cards.slice(row * 2, row * 2 + 2);
      contentHeight += Math.max(...rowCards.map((card) => gridCardHeight(card, cardWidth)));
    }
    contentHeight += (Math.ceil(cards.length / 2) - 1) * gap;
  } else if (variant === 'spotlight_card') {
    const cardWidth = (maxWidth - 56 - gap) / 2;
    const heroHeight = heroCardHeight(cards[0], maxWidth - 56);
    const rest = cards.slice(1);
    contentHeight = heroHeight + gap;
    for (let row = 0; row < Math.ceil(rest.length / 2); row++) {
      contentHeight += Math.max(
        ...rest.slice(row * 2, row * 2 + 2).map((card) => gridCardHeight(card, cardWidth)),
      );
    }
    contentHeight += (Math.ceil(rest.length / 2) - 1) * gap;
  } else {
    contentHeight = cards.reduce(
      (total, card) => total + Math.max(142, stackCardHeight(card, maxWidth - 56)),
      0,
    ) + (cards.length - 1) * gap;
  }
  return headerMetrics(title, subtitle, maxWidth).space + contentHeight + 64;
}

function text(
  value: string,
  x: number,
  y: number,
  width: number,
  fontSize: number,
  color: string,
  weight = 600,
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

function makeIcon(
  id: ResolvedFeatureCardsOptions['cards'][number]['icon'],
  x: number,
  y: number,
  size: number,
  color: string,
): Array<Rect | Circle> {
  const elements: Array<Rect | Circle> = [];
  const addRect = (
    rx: number,
    ry: number,
    width: number,
    height: number,
    rotation = 0,
    radius = 3,
  ) => {
    elements.push(new Rect({
      x: rx,
      y: ry,
      width,
      height,
      radius,
      rotation,
      fill: color,
      opacity: 0,
    }));
  };
  const addCircle = (rx: number, ry: number, diameter: number, fill: string, stroke = false) => {
    elements.push(new Circle({
      x: rx,
      y: ry,
      size: diameter,
      fill: stroke ? 'rgba(0,0,0,0)' : fill,
      stroke: stroke ? fill : undefined,
      lineWidth: stroke ? Math.max(3, size * 0.08) : 0,
      opacity: 0,
    }));
  };

  switch (id) {
    case 'spark':
      addRect(x, y, size * 0.12, size * 0.82);
      addRect(x, y, size * 0.82, size * 0.12);
      addCircle(x, y, size * 0.28, color);
      addCircle(x + size * 0.36, y - size * 0.34, size * 0.14, color);
      break;
    case 'target':
      addCircle(x, y, size, color, true);
      addCircle(x, y, size * 0.56, color, true);
      addCircle(x, y, size * 0.18, color);
      break;
    case 'layers':
      addRect(x, y - size * 0.23, size * 0.68, size * 0.14, -24);
      addRect(x, y, size * 0.82, size * 0.14, -24);
      addRect(x, y + size * 0.23, size * 0.68, size * 0.14, -24);
      break;
    case 'arrow':
      addRect(x - size * 0.08, y, size * 0.72, size * 0.12);
      addRect(x + size * 0.22, y - size * 0.18, size * 0.4, size * 0.12, 45);
      addRect(x + size * 0.22, y + size * 0.18, size * 0.4, size * 0.12, -45);
      break;
    case 'diamond':
      addRect(x, y, size * 0.56, size * 0.56, 45, 5);
      addCircle(x + size * 0.34, y - size * 0.34, size * 0.14, color);
      break;
    case 'dot':
      addCircle(x, y, size * 0.72, color);
      break;
    case 'none':
      break;
  }
  return elements;
}

function layoutCards(options: ResolvedFeatureCardsOptions): CardLayout[] {
  const {cards, maxWidth, height, variant} = options;
  const top = -height / 2 + headerMetrics(options.title, options.subtitle, maxWidth).space;
  const gap = 18;

  if (variant === 'feature_grid') {
    const cardWidth = (maxWidth - 56 - gap) / 2;
    const layouts: CardLayout[] = [];
    let rowTop = top;
    for (let row = 0; row < Math.ceil(cards.length / 2); row++) {
      const rowCards = cards.slice(row * 2, row * 2 + 2);
      const rowHeight = Math.max(...rowCards.map((card) => gridCardHeight(card, cardWidth)));
      rowCards.forEach((_, column) => {
        const index = row * 2 + column;
        const x = column === 0 ? -cardWidth / 2 - gap / 2 : cardWidth / 2 + gap / 2;
        layouts.push({
          x,
          y: rowTop + rowHeight / 2,
          width: cardWidth,
          height: rowHeight,
          style: 'grid',
        });
      });
      rowTop += rowHeight + gap;
    }
    return layouts;
  }

  if (variant === 'spotlight_card') {
    const heroHeight = heroCardHeight(cards[0], maxWidth - 56);
    const heroWidth = maxWidth - 56;
    const layouts: CardLayout[] = [{
      x: 0,
      y: top + heroHeight / 2,
      width: heroWidth,
      height: heroHeight,
      style: 'spotlight',
    }];
    const remaining = cards.slice(1);
    const cardWidth = (maxWidth - 56 - gap) / 2;
    let rowTop = top + heroHeight + gap;
    for (let row = 0; row < Math.ceil(remaining.length / 2); row++) {
      const rowCards = remaining.slice(row * 2, row * 2 + 2);
      const rowHeight = Math.max(...rowCards.map((card) => gridCardHeight(card, cardWidth)));
      rowCards.forEach((_, column) => {
        const x = column === 0 ? -cardWidth / 2 - gap / 2 : cardWidth / 2 + gap / 2;
        layouts.push({
          x,
          y: rowTop + rowHeight / 2,
          width: cardWidth,
          height: rowHeight,
          style: 'grid',
        });
      });
      rowTop += rowHeight + gap;
    }
    return layouts;
  }

  const width = maxWidth - 56;
  let rowTop = top;
  return cards.map((card) => {
    const cardHeight = Math.max(142, stackCardHeight(card, width));
    const layout: CardLayout = {
      x: 0,
      y: rowTop + cardHeight / 2,
      width,
      height: cardHeight,
      style: variant === 'sequential_reveal' ? 'sequential' : 'stack',
    };
    rowTop += cardHeight + gap;
    return layout;
  });
}

function createCard(
  options: ResolvedFeatureCardsOptions,
  index: number,
  layout: CardLayout,
): FeatureCardParts {
  const card = options.cards[index];
  const isHero = layout.style === 'spotlight';
  const isGrid = layout.style === 'grid';
  const padding = isGrid ? 24 : 30;
  const numberColor = card.accentColor;
  const titleColor = card.color;
  const iconSize = isHero ? 64 : isGrid ? 44 : 48;
  const iconX = isGrid
    ? -layout.width / 2 + padding + iconSize / 2
    : layout.width / 2 - padding - iconSize / 2;
  const iconY = isGrid ? -layout.height / 2 + 48 : 0;
  const icon = makeIcon(card.icon, iconX, iconY, iconSize, numberColor);
  const surface = new Rect({
    width: layout.width,
    height: layout.height,
    radius: isHero ? 30 : 24,
    fill: card.highlight ? '#FFF7EB' : '#F7F2E9',
    stroke: card.highlight ? card.accentColor : '#E8E0D3',
    lineWidth: card.highlight ? 2 : 1,
    opacity: 1,
  });
  const stripe = new Rect({
    x: -layout.width / 2 + 5,
    y: 0,
    width: layout.style === 'sequential' ? 6 : 4,
    height: layout.height - 44,
    radius: 3,
    fill: card.accentColor,
    opacity: 1,
  });
  const numberWidth = isGrid
    ? layout.width - padding * 2 - iconSize - 12
    : 160;
  const numberX = -layout.width / 2 + padding + numberWidth / 2 + (isGrid ? iconSize + 12 : 0);
  const number = text(
    card.number,
    numberX,
    isGrid ? -layout.height / 2 + 48 : -layout.height / 2 + 34,
    numberWidth,
    isHero ? 20 : 16,
    numberColor,
    800,
  );
  const textWidth = layout.width - (isGrid ? 48 : 72) - (isGrid ? 0 : iconSize + 26);
  const titleX = -layout.width / 2 + padding + (isGrid ? 0 : 0);
  const titleY = isGrid ? 20 : isHero ? -18 : -2;
  const descriptionY = isGrid ? 70 : isHero ? 44 : 42;
  const align: CanvasTextAlign = options.alignment === 'center' ? 'center' : 'left';
  const textCenterX = options.alignment === 'center'
    ? 0
    : options.alignment === 'right'
      ? layout.width / 2 - padding - textWidth / 2
      : titleX + textWidth / 2;
  const title = text(
    card.title,
    textCenterX,
    titleY,
    textWidth,
    isHero ? 38 : isGrid ? 26 : 29,
    titleColor,
    800,
    align,
  );
  const description = text(
    card.description,
    textCenterX,
    descriptionY,
    textWidth,
    isHero ? 23 : isGrid ? 19 : 20,
    '#777064',
    400,
    align,
  );

  const node = new Layout({x: layout.x, y: layout.y, opacity: 0});
  node.children([surface, stripe, ...icon, number, title, description]);
  return {node, surface, accentRule: stripe, number, title, description, icon};
}

export function createFeatureCardsParts(
  options: ResolvedFeatureCardsOptions,
): FeatureCardsParts {
  const headingAlign: CanvasTextAlign = options.alignment === 'center'
    ? 'center'
    : options.alignment === 'right' ? 'right' : 'left';
  const headingWidth = options.maxWidth - 72;
  const headingX = options.alignment === 'left'
    ? -options.maxWidth / 2 + 36 + headingWidth / 2
    : options.alignment === 'right'
      ? options.maxWidth / 2 - 36 - headingWidth / 2
      : 0;
  const surface = new Rect({
    width: options.maxWidth,
    height: options.height,
    radius: 38,
    fill: options.backgroundColor,
    stroke: '#E8E0D3',
    lineWidth: 1,
    shadowColor: '#19191918',
    shadowBlur: 24,
    shadowOffsetY: 10,
    opacity: 0,
  });
  const title = text(
    options.title,
    headingX,
    -options.height / 2 + 58,
    headingWidth,
    36,
    options.primaryColor,
    800,
    headingAlign,
  );
  const subtitle = text(
    options.subtitle,
    headingX,
    -options.height / 2 + headerMetrics(options.title, options.subtitle, options.maxWidth).subtitleOffset,
    options.maxWidth - 80,
    20,
    options.secondaryColor,
    400,
    headingAlign,
  );
  const cards = layoutCards(options).map((layout, index) => createCard(options, index, layout));
  const root = new Layout({x: options.x, y: options.y});
  root.children([surface, title, subtitle, ...cards.map((card) => card.node)]);
  return {root, surface, title, subtitle, cards};
}
