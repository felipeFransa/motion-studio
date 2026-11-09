import type {EasingName} from '../animations/easing';
import type {AppBrand} from '../brand/types';
import type {KineticTitleOptions} from '../components/kinetic-title/types';
import {adjustHexBrightness} from './contrast';
import type {
  ResolvedTheme,
  ThemeMotion,
  ThemePalette,
  ThemePreset,
  ThemeTypography,
} from './types';

// =========================================================================
// TECH MOTION — DESIGN TOKENS
// Single source of truth for the Tech Motion visual style. Components never
// hard-code colors: they receive a `TechTokens` object (defaulting to
// TECH_MOTION_TOKENS) so the Brand Registry can adapt them.
// =========================================================================

export interface TechColors {
  readonly background: string;
  readonly surface: string;
  readonly surfaceElevated: string;
  readonly border: string;
  readonly accent: string;
  readonly accentSecondary: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly onAccent: string;
  readonly success: string;
  readonly warning: string;
}

export interface TechTypography {
  readonly fontFamily: string;
  readonly headingFont?: string;
  readonly monoFont?: string;
  readonly bodyFont?: string;
  readonly heading?: string;
  readonly mono?: string;
  readonly body?: string;
  readonly headingWeight: number;
  readonly bodyWeight: number;
  readonly letterSpacing: number;
  readonly titleSize: number;
  readonly headingSize: number;
  readonly bodySize: number;
  readonly captionSize: number;
}

export interface TechSpacing {
  readonly xs: number;
  readonly sm: number;
  readonly md: number;
  readonly lg: number;
  readonly xl: number;
}

export interface TechRadii {
  readonly sm: number;
  readonly md: number;
  readonly lg: number;
  readonly full: number;
}

export interface TechSurface {
  /** Opacity of panel/window surfaces (0..1). */
  readonly opacity: number;
  /** Opacity of the accent stroke on surfaces (0..1). */
  readonly borderOpacity: number;
  /** Opacity of the soft accent glow around highlighted surfaces (0..1). */
  readonly glowOpacity: number;
}

export interface TechMotionSettings {
  /** 0 = static, 1 = full movement. Scales drifts, floats and camera travel. */
  readonly intensity: number;
  readonly durationMultiplier: number;
  readonly staggerMultiplier: number;
  readonly easing: EasingName;
}

export interface TechTransitions {
  readonly enter: number;
  readonly exit: number;
  readonly stagger: number;
  readonly cameraMove: number;
}

export interface TechSafeArea {
  readonly marginX: number;
  readonly marginTop: number;
  readonly marginBottom: number;
  readonly maxTextWidth: number;
}

export interface TechTokens {
  readonly id: 'tech_motion';
  readonly colors: TechColors;
  readonly typography: TechTypography;
  readonly spacing: TechSpacing;
  readonly radii: TechRadii;
  readonly surface: TechSurface;
  readonly motion: TechMotionSettings;
  readonly transitions: TechTransitions;
  readonly safe: TechSafeArea;
}

export type TechTokenOverrides = {
  readonly [K in keyof Omit<TechTokens, 'id'>]?: Partial<TechTokens[K]>;
};

export const TECH_MOTION_TOKENS: TechTokens = Object.freeze({
  id: 'tech_motion',
  colors: Object.freeze({
    background: '#0B1020',
    surface: '#151D30',
    surfaceElevated: '#1C2640',
    border: '#2A3753',
    accent: '#38BDF8',
    accentSecondary: '#22D3EE',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    onAccent: '#0B1020',
    success: '#34D399',
    warning: '#FBBF24',
  }),
  typography: Object.freeze({
    fontFamily: 'Arial',
    headingFont: 'Arial',
    monoFont: 'Courier New',
    bodyFont: 'Arial',
    heading: 'Arial',
    mono: 'Courier New',
    body: 'Arial',
    headingWeight: 900,
    bodyWeight: 500,
    letterSpacing: 1,
    titleSize: 120,
    headingSize: 64,
    bodySize: 26,
    captionSize: 18,
  }),
  spacing: Object.freeze({xs: 6, sm: 12, md: 20, lg: 32, xl: 48}),
  radii: Object.freeze({sm: 10, md: 18, lg: 28, full: 9999}),
  surface: Object.freeze({opacity: 0.94, borderOpacity: 0.55, glowOpacity: 0.16}),
  motion: Object.freeze({
    intensity: 0.8,
    durationMultiplier: 1,
    staggerMultiplier: 1,
    easing: 'easeOutCubic' as EasingName,
  }),
  transitions: Object.freeze({enter: 0.7, exit: 0.5, stagger: 0.14, cameraMove: 1.2}),
  safe: Object.freeze({marginX: 72, marginTop: 140, marginBottom: 160, maxTextWidth: 880}),
});

/**
 * Merges partial overrides over the defaults and validates the result.
 */
export function resolveTechTokens(overrides: TechTokenOverrides = {}): TechTokens {
  const merged: TechTokens = {
    id: 'tech_motion',
    colors: {...TECH_MOTION_TOKENS.colors, ...overrides.colors},
    typography: {...TECH_MOTION_TOKENS.typography, ...overrides.typography},
    spacing: {...TECH_MOTION_TOKENS.spacing, ...overrides.spacing},
    radii: {...TECH_MOTION_TOKENS.radii, ...overrides.radii},
    surface: {...TECH_MOTION_TOKENS.surface, ...overrides.surface},
    motion: {...TECH_MOTION_TOKENS.motion, ...overrides.motion},
    transitions: {...TECH_MOTION_TOKENS.transitions, ...overrides.transitions},
    safe: {...TECH_MOTION_TOKENS.safe, ...overrides.safe},
  };

  const unit = (value: number, name: string): void => {
    if (!Number.isFinite(value) || value < 0 || value > 1) {
      throw new RangeError(`TechTokens: "${name}" must be between 0 and 1.`);
    }
  };
  unit(merged.motion.intensity, 'motion.intensity');
  unit(merged.surface.opacity, 'surface.opacity');
  unit(merged.surface.borderOpacity, 'surface.borderOpacity');
  unit(merged.surface.glowOpacity, 'surface.glowOpacity');
  if (merged.motion.durationMultiplier <= 0 || merged.motion.staggerMultiplier < 0) {
    throw new RangeError('TechTokens: motion multipliers must be positive.');
  }
  if (merged.safe.maxTextWidth + merged.safe.marginX * 2 > 1080 + 1) {
    throw new RangeError('TechTokens: safe.maxTextWidth + margins must fit in 1080px.');
  }
  return Object.freeze(merged);
}

const INTENSITY_VALUE: Record<ThemeMotion['intensity'], number> = {
  subtle: 0.4,
  moderate: 0.7,
  high: 1,
};

/**
 * Brand Registry adaptation. A brand opts into brand-colored Tech Motion by
 * setting `defaultThemeId: 'tech_motion'`; otherwise the default blue palette
 * is used so Tech Motion stays visually consistent across brands.
 */
export function techTokensFromBrand(brand?: AppBrand): TechTokens {
  if (!brand) return TECH_MOTION_TOKENS;
  const adaptive = brand.defaultThemeId === 'tech_motion';
  return resolveTechTokens({
    colors: adaptive
      ? {accent: brand.primaryColor, accentSecondary: brand.complementaryColors.accent}
      : {},
    typography: {fontFamily: brand.typographyStyle.headingFont || 'Arial'},
    motion: {
      intensity: INTENSITY_VALUE[brand.animationStyle.intensity],
      durationMultiplier: brand.animationStyle.durationMultiplier,
      staggerMultiplier: brand.animationStyle.staggerMultiplier,
      easing: brand.animationStyle.defaultEasing,
    },
  });
}

/**
 * Rebuilds Tech tokens from a ResolvedTheme (used by the template renderer).
 */
export function techTokensFromTheme(theme: ResolvedTheme): TechTokens {
  const p = theme.palette;
  return resolveTechTokens({
    colors: {
      background: p.background,
      surface: p.surface,
      surfaceElevated: p.surfaceElevated,
      border: p.border,
      accent: p.primary,
      accentSecondary: p.accent,
      textPrimary: p.textPrimary,
      textSecondary: p.textSecondary,
      onAccent: p.textOnPrimary,
    },
    typography: {
      fontFamily: theme.typography.fontFamily,
      headingWeight: theme.typography.headingWeight,
      bodyWeight: theme.typography.bodyWeight,
    },
    motion: {
      intensity: INTENSITY_VALUE[theme.motion.intensity],
      durationMultiplier: theme.motion.durationMultiplier,
      staggerMultiplier: theme.motion.staggerMultiplier,
      easing: theme.motion.defaultEasing,
    },
  });
}

/**
 * Builds KineticTitle options from Tech tokens (brand-less path).
 */
export function techKineticTitle(
  tokens: TechTokens,
  options: Partial<KineticTitleOptions> & {text: string},
): KineticTitleOptions {
  const anim = options.animation ?? {};
  return {
    component: 'kinetic_title',
    variant: options.variant ?? 'editorial_reveal',
    text: options.text,
    highlightWords: options.highlightWords ?? [],
    fontSize: options.fontSize ?? tokens.typography.headingSize,
    fontWeight: options.fontWeight ?? tokens.typography.headingWeight,
    fontFamily: options.fontFamily ?? tokens.typography.fontFamily,
    color: options.color ?? tokens.colors.textPrimary,
    highlightColor: options.highlightColor ?? tokens.colors.accent,
    alignment: options.alignment ?? 'center',
    maxWidth: options.maxWidth ?? tokens.safe.maxTextWidth,
    x: options.x ?? 0,
    y: options.y ?? 0,
    letterSpacing: options.letterSpacing ?? tokens.typography.letterSpacing,
    animation: {
      duration: (anim.duration ?? 0.9) * tokens.motion.durationMultiplier,
      stagger: (anim.stagger ?? 0.14) * tokens.motion.staggerMultiplier,
      distance: anim.distance ?? 40,
      easing: anim.easing ?? tokens.motion.easing,
      direction: anim.direction ?? 'up',
    },
  };
}

// =========================================================================
// ThemePreset integration (registered in THEME_PRESETS as 'tech_motion')
// =========================================================================

export const TECH_MOTION_PRESET: ThemePreset = {
  id: 'tech_motion',
  name: 'Tech Motion',
  description:
    'Estilo tecnológico noturno: fundo azul-marinho, interfaces animadas, destaques ciano e profundidade simulada.',
  isDark: true,
  createPalette(brand: AppBrand): ThemePalette {
    const t = techTokensFromBrand(brand);
    const c = t.colors;
    return {
      primary: c.accent,
      primaryLight: adjustHexBrightness(c.accent, 1.2),
      primaryDark: adjustHexBrightness(c.accent, 0.75),
      secondary: c.accentSecondary,
      accent: c.accentSecondary,
      background: c.background,
      surface: c.surface,
      surfaceElevated: c.surfaceElevated,
      border: c.border,
      borderAccent: c.accent,
      textPrimary: c.textPrimary,
      textSecondary: c.textSecondary,
      textOnPrimary: c.onAccent,
      badgeBackground: c.surfaceElevated,
      badgeText: c.accent,
    };
  },
  createTypography(brand: AppBrand): ThemeTypography {
    const t = techTokensFromBrand(brand);
    return {
      fontFamily: t.typography.fontFamily,
      headingWeight: t.typography.headingWeight,
      bodyWeight: t.typography.bodyWeight,
      letterSpacing: t.typography.letterSpacing,
    };
  },
  createMotion(brand: AppBrand): ThemeMotion {
    const t = techTokensFromBrand(brand);
    return {
      durationMultiplier: t.motion.durationMultiplier,
      staggerMultiplier: t.motion.staggerMultiplier,
      defaultEasing: t.motion.easing,
      intensity: brand.animationStyle.intensity,
    };
  },
};
