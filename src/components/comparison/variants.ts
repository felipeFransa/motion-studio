import {Layout, Rect, Txt} from '@motion-canvas/2d';
import type {ResolvedComparisonOptions, ComparisonParts} from './types';

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

export function createComparisonParts(
  options: ResolvedComparisonOptions,
): ComparisonParts {
  const {width, height} = options;
  const innerWidth = width - 112;
  const sideWidth = (innerWidth - 36) / 2;
  const sideX = sideWidth / 2 + 18;
  const leftEdge = -innerWidth / 2;
  const rightEdge = innerWidth / 2;
  const align: CanvasTextAlign = options.alignment === 'center'
    ? 'center'
    : options.alignment === 'right' ? 'right' : 'left';

  const surface = new Rect({
    width,
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
  const title = text(options.title, 0, -height / 2 + 72, innerWidth, 38, options.primaryColor, 800, 'center');
  const subtitle = text(options.subtitle, 0, -height / 2 + 118, innerWidth, 21, '#777064', 400, 'center');

  const leftPanel = new Rect({
    x: -sideX,
    y: 34,
    width: sideWidth,
    height: options.variant === 'data_comparison' ? 140 : 360,
    radius: 24,
    fill: '#F6F0E5',
    stroke: options.highlightSide === 'left' ? options.leftColor : '#E8E0D3',
    lineWidth: options.highlightSide === 'left' ? 3 : 1,
    opacity: 0,
  });
  const rightPanel = new Rect({
    x: sideX,
    y: 34,
    width: sideWidth,
    height: options.variant === 'data_comparison' ? 140 : 360,
    radius: 24,
    fill: '#FBF5EA',
    stroke: options.highlightSide === 'right' ? options.rightColor : '#E8E0D3',
    lineWidth: options.highlightSide === 'right' ? 3 : 1,
    opacity: 0,
  });

  const leftLabel = text(options.leftLabel, -sideX, -91, sideWidth - 36, 17, options.leftColor, 800, align);
  const rightLabel = text(options.rightLabel, sideX, -91, sideWidth - 36, 17, options.rightColor, 800, align);
  const leftTitle = text(options.leftTitle, -sideX, -22, sideWidth - 36, 30, options.primaryColor, 800, align);
  const rightTitle = text(options.rightTitle, sideX, -22, sideWidth - 36, 30, options.primaryColor, 800, align);
  const leftDescription = text(options.leftDescription, -sideX, 70, sideWidth - 36, 21, '#777064', 400, align);
  const rightDescription = text(options.rightDescription, sideX, 70, sideWidth - 36, 21, '#777064', 400, align);
  const divider = new Rect({
    x: 0,
    y: 34,
    width: 2,
    height: 282,
    radius: 1,
    fill: '#D8CBB7',
    opacity: 0,
  });
  const centerMark = text(
    options.variant === 'versus' ? 'VS' : '→',
    0,
    34,
    76,
    options.variant === 'versus' ? 20 : 38,
    options.accentColor,
    900,
    'center',
  );
  const children: Array<Rect | Txt> = [
    surface,
    leftPanel,
    rightPanel,
    divider,
    title,
    subtitle,
    leftLabel,
    rightLabel,
    leftTitle,
    rightTitle,
    leftDescription,
    rightDescription,
    centerMark,
  ];

  const parts: ComparisonParts = {
    root: new Layout({x: options.x, y: options.y}),
    surface,
    title,
    subtitle,
    leftPanel,
    rightPanel,
    leftLabel,
    rightLabel,
    leftTitle,
    rightTitle,
    leftDescription,
    rightDescription,
    divider,
    centerMark,
  };

  if (options.variant === 'data_comparison') {
    const horizontal = options.chartOrientation === 'horizontal';
    const chartTop = horizontal ? 0 : -40;
    const chartBottom = height / 2 - 150;
    const rangeHeight = chartBottom - chartTop;
    const leftValue = text('', -sideX, -22, sideWidth - 36, 32, options.leftColor, 800, align);
    const rightValue = text('', sideX, -22, sideWidth - 36, 32, options.rightColor, 800, align);
    const leftTrack = new Rect({
      x: horizontal ? 0 : -sideX,
      y: horizontal ? 5 : chartTop + rangeHeight / 2,
      width: horizontal ? innerWidth : 12,
      height: horizontal ? 16 : rangeHeight,
      radius: 8,
      fill: '#E8E0D3',
      opacity: 0,
    });
    const rightTrack = new Rect({
      x: horizontal ? 0 : sideX,
      y: horizontal ? 200 : chartTop + rangeHeight / 2,
      width: horizontal ? innerWidth : 12,
      height: horizontal ? 16 : rangeHeight,
      radius: 8,
      fill: '#E8E0D3',
      opacity: 0,
    });
    const leftBar = new Rect({
      x: horizontal ? 0 : -sideX,
      y: horizontal ? 5 : chartTop,
      width: horizontal ? 0 : 78,
      height: horizontal ? 16 : 0,
      radius: 8,
      fill: options.leftColor,
      opacity: 0,
    });
    const rightBar = new Rect({
      x: horizontal ? 0 : sideX,
      y: horizontal ? 200 : chartTop,
      width: horizontal ? 0 : 78,
      height: horizontal ? 16 : 0,
      radius: 8,
      fill: options.rightColor,
      opacity: 0,
    });
    const baseline = new Rect({
      x: 0,
      y: horizontal ? 105 : chartTop + rangeHeight / 2,
      width: horizontal ? 2 : innerWidth,
      height: horizontal ? 210 : 2,
      radius: 1,
      fill: '#777064',
      opacity: 0,
    });
    const difference = text('', 0, height / 2 - 91, innerWidth, 26, options.accentColor, 800, 'center');
    const percentageChange = text('', 0, height / 2 - 54, innerWidth, 20, '#777064', 600, 'center');
    children.push(leftTrack, rightTrack, baseline, leftBar, rightBar, leftValue, rightValue);
    if (options.showDifference) children.push(difference);
    if (options.showPercentageChange) children.push(percentageChange);
    Object.assign(parts, {
      leftValue,
      rightValue,
      leftTrack,
      rightTrack,
      leftBar,
      rightBar,
      baseline,
      difference,
      percentageChange,
    });

    leftTitle.text('');
    rightTitle.text('');
    if (horizontal) {
      const horizontalPadding = 24;
      const labelWidth = innerWidth * 0.62;
      const valueWidth = innerWidth - labelWidth - horizontalPadding * 2;
      leftPanel.x(0);
      rightPanel.x(0);
      leftPanel.y(-55);
      rightPanel.y(140);
      leftPanel.width(innerWidth);
      rightPanel.width(innerWidth);
      leftPanel.height(120);
      rightPanel.height(120);
      leftLabel.x(leftEdge + horizontalPadding + labelWidth / 2);
      rightLabel.x(leftEdge + horizontalPadding + labelWidth / 2);
      leftLabel.y(-89);
      rightLabel.y(106);
      leftLabel.width(labelWidth);
      rightLabel.width(labelWidth);
      leftLabel.textAlign('left');
      rightLabel.textAlign('left');
      leftDescription.x(leftEdge + horizontalPadding + (innerWidth - horizontalPadding * 2) / 2);
      rightDescription.x(leftEdge + horizontalPadding + (innerWidth - horizontalPadding * 2) / 2);
      leftDescription.y(-53);
      rightDescription.y(142);
      leftDescription.width(innerWidth - horizontalPadding * 2);
      rightDescription.width(innerWidth - horizontalPadding * 2);
      leftValue.x(rightEdge - horizontalPadding - valueWidth / 2);
      rightValue.x(rightEdge - horizontalPadding - valueWidth / 2);
      leftValue.y(-89);
      rightValue.y(106);
      leftValue.width(valueWidth);
      rightValue.width(valueWidth);
      leftValue.textAlign('right');
      rightValue.textAlign('right');
      leftTrack.y(5);
      rightTrack.y(200);
      leftBar.y(5);
      rightBar.y(200);
      baseline.y(105);
    } else {
      leftPanel.y(-115);
      rightPanel.y(-115);
      leftPanel.height(170);
      rightPanel.height(170);
      leftLabel.y(-174);
      rightLabel.y(-174);
      leftDescription.y(-138);
      rightDescription.y(-138);
      leftValue.y(-98);
      rightValue.y(-98);
      leftBar.y(chartTop);
      rightBar.y(chartTop);
      leftTrack.y(chartTop + rangeHeight / 2);
      rightTrack.y(chartTop + rangeHeight / 2);
      baseline.y(chartTop + rangeHeight / 2);
    }
  }

  parts.root.children(children);
  return parts;
}
