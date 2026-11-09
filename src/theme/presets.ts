import type {AppBrand} from '../brand/types';
import {
  adjustHexBrightness,
  getAccessibleTextColor,
  isLightColor,
} from './contrast';
import {TECH_MOTION_PRESET} from './tech-motion';
import type {
  ThemeMotion,
  ThemePalette,
  ThemePreset,
  ThemePresetId,
  ThemeTypography,
} from './types';

export const EDITORIAL_PREMIUM_PRESET: ThemePreset = {
  id: 'editorial_premium',
  name: 'Editorial Premium',
  description: 'Estilo editorial nobre, fundo bege quente texturizado, tipografia editorial e contrastes finos.',
  isDark: false,
  createPalette(brand: AppBrand): ThemePalette {
    const primary = brand.primaryColor;
    const isBrandLight = isLightColor(primary);
    const primaryLight = isBrandLight ? primary : adjustHexBrightness(primary, 1.25);
    const primaryDark = adjustHexBrightness(primary, 0.82);
    const textOnPrimary = getAccessibleTextColor(primary, '#FFFFFF', '#141414');

    return {
      primary,
      primaryLight,
      primaryDark,
      secondary: brand.complementaryColors.secondary,
      accent: brand.complementaryColors.accent,
      background: '#F2EBDD',
      surface: '#FFFDF8',
      surfaceElevated: '#FAF6EE',
      border: '#D8CBB7',
      borderAccent: primary,
      textPrimary: '#191919',
      textSecondary: '#777064',
      textOnPrimary,
      badgeBackground: isBrandLight ? primaryDark : primary,
      badgeText: textOnPrimary,
    };
  },
  createTypography(brand: AppBrand): ThemeTypography {
    return {
      fontFamily: brand.typographyStyle.headingFont || 'Arial',
      headingWeight: brand.typographyStyle.headingWeight,
      bodyWeight: brand.typographyStyle.bodyWeight,
      letterSpacing: brand.typographyStyle.letterSpacing,
    };
  },
  createMotion(brand: AppBrand): ThemeMotion {
    return {
      durationMultiplier: brand.animationStyle.durationMultiplier,
      staggerMultiplier: brand.animationStyle.staggerMultiplier,
      defaultEasing: brand.animationStyle.defaultEasing,
      intensity: brand.animationStyle.intensity,
    };
  },
};

export const DARK_MODERN_PRESET: ThemePreset = {
  id: 'dark_modern',
  name: 'Dark Modern',
  description: 'Tema noturno cinematográfico com alta tecnologia e destaques luminosos.',
  isDark: true,
  createPalette(brand: AppBrand): ThemePalette {
    const primary = brand.primaryColor;
    const isBrandLight = isLightColor(primary);
    const primaryLight = isBrandLight ? primary : adjustHexBrightness(primary, 1.2);
    const primaryDark = adjustHexBrightness(primary, 0.75);
    const textOnPrimary = getAccessibleTextColor(primary, '#FFFFFF', '#080D1A');

    return {
      primary,
      primaryLight,
      primaryDark,
      secondary: brand.complementaryColors.secondary,
      accent: brand.complementaryColors.accent,
      background: '#070D1B',
      surface: '#0F1A30',
      surfaceElevated: '#172545',
      border: '#1E335C',
      borderAccent: primary,
      textPrimary: '#FFFFFF',
      textSecondary: '#94A3B8',
      textOnPrimary,
      badgeBackground: '#0B152B',
      badgeText: primary,
    };
  },
  createTypography(brand: AppBrand): ThemeTypography {
    return {
      fontFamily: brand.typographyStyle.headingFont || 'Arial',
      headingWeight: brand.typographyStyle.headingWeight,
      bodyWeight: brand.typographyStyle.bodyWeight,
      letterSpacing: brand.typographyStyle.letterSpacing,
    };
  },
  createMotion(brand: AppBrand): ThemeMotion {
    return {
      durationMultiplier: brand.animationStyle.durationMultiplier * 0.95,
      staggerMultiplier: brand.animationStyle.staggerMultiplier * 0.9,
      defaultEasing: brand.animationStyle.defaultEasing,
      intensity: 'high',
    };
  },
};

export const CLEAN_LIGHT_PRESET: ThemePreset = {
  id: 'clean_light',
  name: 'Clean Light',
  description: 'Visual moderno, minimalista, fundo claro neutro e superfícies alvas.',
  isDark: false,
  createPalette(brand: AppBrand): ThemePalette {
    const primary = brand.primaryColor;
    const primaryLight = adjustHexBrightness(primary, 1.3);
    const primaryDark = adjustHexBrightness(primary, 0.85);
    const textOnPrimary = getAccessibleTextColor(primary, '#FFFFFF', '#0F172A');

    return {
      primary,
      primaryLight,
      primaryDark,
      secondary: brand.complementaryColors.secondary,
      accent: brand.complementaryColors.accent,
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceElevated: '#F1F5F9',
      border: '#E2E8F0',
      borderAccent: primary,
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      textOnPrimary,
      badgeBackground: primaryLight,
      badgeText: primaryDark,
    };
  },
  createTypography(brand: AppBrand): ThemeTypography {
    return {
      fontFamily: brand.typographyStyle.headingFont || 'Arial',
      headingWeight: brand.typographyStyle.headingWeight,
      bodyWeight: brand.typographyStyle.bodyWeight,
      letterSpacing: brand.typographyStyle.letterSpacing,
    };
  },
  createMotion(brand: AppBrand): ThemeMotion {
    return {
      durationMultiplier: brand.animationStyle.durationMultiplier,
      staggerMultiplier: brand.animationStyle.staggerMultiplier,
      defaultEasing: brand.animationStyle.defaultEasing,
      intensity: 'moderate',
    };
  },
};

export const HIGH_CONTRAST_PRESET: ThemePreset = {
  id: 'high_contrast',
  name: 'High Contrast',
  description: 'Contraste extremo para leitura imediata em qualquer ambiente.',
  isDark: true,
  createPalette(brand: AppBrand): ThemePalette {
    const primary = brand.primaryColor;
    const textOnPrimary = getAccessibleTextColor(primary, '#FFFFFF', '#000000');

    return {
      primary,
      primaryLight: adjustHexBrightness(primary, 1.25),
      primaryDark: adjustHexBrightness(primary, 0.7),
      secondary: '#FFFFFF',
      accent: primary,
      background: '#000000',
      surface: '#121212',
      surfaceElevated: '#1E1E1E',
      border: '#FFFFFF',
      borderAccent: primary,
      textPrimary: '#FFFFFF',
      textSecondary: '#E0E0E0',
      textOnPrimary,
      badgeBackground: primary,
      badgeText: textOnPrimary,
    };
  },
  createTypography(brand: AppBrand): ThemeTypography {
    return {
      fontFamily: 'Arial',
      headingWeight: 900,
      bodyWeight: 700,
      letterSpacing: 2,
    };
  },
  createMotion(brand: AppBrand): ThemeMotion {
    return {
      durationMultiplier: 0.85,
      staggerMultiplier: 0.8,
      defaultEasing: 'easeOutCubic',
      intensity: 'high',
    };
  },
};

export const THEME_PRESETS: Readonly<Record<ThemePresetId, ThemePreset>> = Object.freeze({
  editorial_premium: EDITORIAL_PREMIUM_PRESET,
  dark_modern: DARK_MODERN_PRESET,
  clean_light: CLEAN_LIGHT_PRESET,
  high_contrast: HIGH_CONTRAST_PRESET,
  tech_motion: TECH_MOTION_PRESET,
});

export function getThemePreset(id: ThemePresetId): ThemePreset {
  const preset = THEME_PRESETS[id];
  if (!preset) {
    const valid = Object.keys(THEME_PRESETS).join(', ');
    throw new Error(`ThemePresets: Unknown themePresetId "${id}". Must be one of: ${valid}.`);
  }
  return preset;
}
