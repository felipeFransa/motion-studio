import type {EasingName} from '../animations/easing';
import type {NicheId} from '../niche/types';

export type BrandId =
  | 'fitmarketing'
  | 'dentmarketing'
  | 'beautymarketing'
  | 'vetmarketing'
  | 'chefmarketing'
  | 'coachmarketing'
  | 'fisiomarketing'
  | 'quiromarketing'
  | 'nutrimarketing'
  | 'psicomarketing';

export interface BrandColors {
  readonly primary: string;
  readonly secondary: string;
  readonly accent: string;
  readonly background: string;
  readonly surface: string;
  readonly surfaceElevated: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly border: string;
}

export interface BrandTypography {
  readonly headingFont: string;
  readonly bodyFont: string;
  readonly headingWeight: number;
  readonly bodyWeight: number;
  readonly letterSpacing: number;
}

export type MotionPace = 'energetic' | 'smooth' | 'calm' | 'authoritative' | 'dynamic';

export interface BrandAnimationStyle {
  readonly motionStyle: MotionPace;
  readonly intensity: 'subtle' | 'moderate' | 'high';
  readonly defaultEasing: EasingName;
  readonly durationMultiplier: number;
  readonly staggerMultiplier: number;
}

export type ReadingPace = 'fast' | 'moderate' | 'relaxed';

export interface EditorialTone {
  readonly voice: string;
  readonly tone: readonly string[];
  readonly keywords: readonly string[];
  readonly readingPace: ReadingPace;
  readonly audience: string;
}

export interface AppBrand {
  readonly id: BrandId;
  readonly name: string;
  readonly niche: NicheId;
  readonly primaryColor: string;
  readonly complementaryColors: BrandColors;
  readonly typographyStyle: BrandTypography;
  readonly animationStyle: BrandAnimationStyle;
  readonly contentCategories: readonly string[];
  readonly allowedTemplates: readonly string[];
  readonly editorialTone: EditorialTone;
  readonly defaultThemeId?: string;
}
