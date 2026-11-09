export interface RGB {
  r: number;
  g: number;
  b: number;
}

export function hexToRgb(hex: string): RGB {
  let cleaned = hex.trim().replace(/^#/u, '');
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((char) => char + char)
      .join('');
  }
  if (cleaned.length !== 6) {
    throw new TypeError(`Invalid hex color string: "${hex}".`);
  }
  const num = parseInt(cleaned, 16);
  if (Number.isNaN(num)) {
    throw new TypeError(`Invalid hex color digits: "${hex}".`);
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(rgb: RGB): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (val: number) => clamp(val).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function getRelativeLuminance(hex: string): number {
  const {r, g, b} = hexToRgb(hex);
  const transform = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const R = transform(r);
  const G = transform(g);
  const B = transform(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

export function getContrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = getRelativeLuminance(foregroundHex);
  const l2 = getRelativeLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function isLightColor(hex: string, threshold = 0.179): boolean {
  return getRelativeLuminance(hex) > threshold;
}

export function getAccessibleTextColor(
  backgroundHex: string,
  preferredLight = '#FFFFFF',
  preferredDark = '#111827',
): string {
  const contrastLight = getContrastRatio(preferredLight, backgroundHex);
  const contrastDark = getContrastRatio(preferredDark, backgroundHex);
  return contrastLight >= contrastDark ? preferredLight : preferredDark;
}

export function adjustHexBrightness(hex: string, factor: number): string {
  const {r, g, b} = hexToRgb(hex);
  return rgbToHex({
    r: Math.round(r * factor),
    g: Math.round(g * factor),
    b: Math.round(b * factor),
  });
}

export function ensureAccessibleTextColor(
  textColor: string,
  backgroundColor: string,
  minContrast = 4.5,
): string {
  if (getContrastRatio(textColor, backgroundColor) >= minContrast) {
    return textColor;
  }
  const bgIsLight = isLightColor(backgroundColor);
  let adjusted = textColor;
  for (let i = 0; i < 15; i++) {
    adjusted = adjustHexBrightness(adjusted, bgIsLight ? 0.85 : 1.18);
    if (getContrastRatio(adjusted, backgroundColor) >= minContrast) {
      return adjusted;
    }
  }
  return bgIsLight ? '#111827' : '#FFFFFF';
}
