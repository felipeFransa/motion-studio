import type {EasingName} from '../animations/easing';
import type {AppBrand} from '../brand/types';
import type {KineticTitleOptions} from '../components/kinetic-title/types';
import type {StatCardOptions} from '../components/stat-card/types';
import type {ComparisonOptions} from '../components/comparison/types';
import type {FeatureCardsOptions} from '../components/feature-cards/types';
import type {TimelineOptions} from '../components/timeline/types';

export type ThemePresetId =
  | 'editorial_premium'
  | 'dark_modern'
  | 'clean_light'
  | 'high_contrast'
  | 'tech_motion';

export interface ThemePalette {
  readonly primary: string;
  readonly primaryLight: string;
  readonly primaryDark: string;
  readonly secondary: string;
  readonly accent: string;
  readonly background: string;
  readonly surface: string;
  readonly surfaceElevated: string;
  readonly border: string;
  readonly borderAccent: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textOnPrimary: string;
  readonly badgeBackground: string;
  readonly badgeText: string;
}

export interface ThemeTypography {
  readonly fontFamily: string;
  readonly headingFont?: string;
  readonly bodyFont?: string;
  readonly headingWeight: number;
  readonly bodyWeight: number;
  readonly letterSpacing: number;
}

export interface ThemeMotion {
  readonly durationMultiplier: number;
  readonly staggerMultiplier: number;
  readonly defaultEasing: EasingName;
  readonly intensity: 'subtle' | 'moderate' | 'high';
}

export interface ThemePreset {
  readonly id: ThemePresetId;
  readonly name: string;
  readonly description: string;
  readonly isDark: boolean;
  createPalette(brand: AppBrand): ThemePalette;
  createTypography(brand: AppBrand): ThemeTypography;
  createMotion(brand: AppBrand): ThemeMotion;
}

export interface ResolvedTheme {
  readonly themeId: string;
  readonly brandId: string;
  readonly brandName: string;
  readonly isDark: boolean;
  readonly palette: ThemePalette;
  readonly typography: ThemeTypography;
  readonly motion: ThemeMotion;

  // Component Adaptors
  forKineticTitle(options: Partial<KineticTitleOptions> & {text: string}): KineticTitleOptions;
  forStatCard(options: Partial<StatCardOptions> & {value: number}): StatCardOptions;
  forComparison(options: Partial<ComparisonOptions> & {leftValue: number; rightValue: number}): ComparisonOptions;
  forFeatureCards(options: Partial<FeatureCardsOptions> & {cards: FeatureCardsOptions['cards']}): FeatureCardsOptions;
  forTimeline(options: Partial<TimelineOptions> & {events: TimelineOptions['events']}): TimelineOptions;
}
