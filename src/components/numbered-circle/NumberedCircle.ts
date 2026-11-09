import {Circle, Layout, Txt} from '@motion-canvas/2d';

export interface NumberedCircleOptions {
  number: string;
  size: number;
  circleColor: string;
  textColor: string;
  fontSize: number;
  fontWeight: number;
  strokeColor: string;
  strokeWidth: number;
  x?: number;
  y?: number;
}

export interface NumberedCircleParts {
  node: Layout;
  circle: Circle;
  number: Txt;
}

export function createCenteredNumber(
  number: string,
  size: number,
  color: string,
  fontSize: number,
  fontWeight: number,
): Txt {
  const fittedFontSize = Math.min(
    fontSize,
    size * 0.42,
    size * 0.78 / (Math.max(1, number.length) * 0.62),
  );
  return new Txt({
    text: number,
    x: 0,
    y: 0,
    width: size,
    height: Math.ceil(fittedFontSize * 1.3),
    layout: true,
    textAlign: 'center',
    textWrap: false,
    fontFamily: 'Arial',
    fontSize: fittedFontSize,
    fontWeight,
    fill: color,
  });
}

export function NumberedCircle(options: NumberedCircleOptions): NumberedCircleParts {
  if (!Number.isFinite(options.size) || options.size <= 0) {
    throw new RangeError('NumberedCircle: "size" must be a positive finite number.');
  }
  if (!Number.isFinite(options.fontSize) || options.fontSize <= 0) {
    throw new RangeError('NumberedCircle: "fontSize" must be a positive finite number.');
  }
  if (!Number.isFinite(options.fontWeight) || options.fontWeight <= 0) {
    throw new RangeError('NumberedCircle: "fontWeight" must be a positive finite number.');
  }
  if (!Number.isFinite(options.strokeWidth) || options.strokeWidth < 0) {
    throw new RangeError('NumberedCircle: "strokeWidth" must be a non-negative finite number.');
  }

  const circle = new Circle({
    x: 0,
    y: 0,
    layout: false,
    size: options.size,
    fill: options.circleColor,
    stroke: options.strokeColor,
    lineWidth: options.strokeWidth,
  });
  const number = createCenteredNumber(
    options.number,
    options.size,
    options.textColor,
    options.fontSize,
    options.fontWeight,
  );
  const node = new Layout({
    x: options.x ?? 0,
    y: options.y ?? 0,
    width: options.size,
    height: options.size,
    layout: true,
    direction: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    children: [circle, number],
  });

  return {node, circle, number};
}
