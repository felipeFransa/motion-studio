import type {BrandId, AppBrand} from '../brand/types';
import type {NicheId, NicheConfig} from '../niche/types';
import type {ContentType, MotionStudioConfig} from '../contract/types';
import type {ThemePresetId, ResolvedTheme} from '../theme/types';

export interface TemplateContext<TData = Record<string, unknown>> {
  readonly brand: AppBrand;
  readonly niche: NicheConfig;
  readonly theme: ResolvedTheme;
  readonly config: MotionStudioConfig<TData>;
}

export type TemplateId =
  | 'quick_tips'
  | 'myths_facts'
  | 'benefits_list'
  | 'step_by_step'
  | 'service_presentation';

export interface LayoutConstraints {
  readonly supportedAspectRatios: readonly ('9:16' | '1:1' | '16:9')[];
  readonly maxTitleLength: number;
  readonly maxSubtitleLength: number;
  readonly maxItemCount: number;
  readonly minItemCount: number;
  readonly maxItemTitleLength: number;
  readonly maxItemDescriptionLength: number;
}

export interface DurationConstraints {
  readonly minDurationSeconds: number;
  readonly maxDurationSeconds: number;
  readonly defaultDurationSeconds: number;
}

export interface TemplateDefinition<TContent = Record<string, unknown>> {
  readonly templateId: TemplateId;
  readonly version: string;
  readonly name: string;
  readonly description: string;
  readonly supportedNiches: readonly (NicheId | 'all')[];
  readonly supportedContentTypes: readonly ContentType[];
  readonly supportedThemes: readonly (ThemePresetId | 'all')[];
  readonly requiredFields: readonly string[];
  readonly optionalFields: readonly string[];
  readonly layoutConstraints: LayoutConstraints;
  readonly durationConstraints: DurationConstraints;
  validateContent(content: unknown): {valid: boolean; errors: readonly string[]};
  createStoryboardIR(params: CreateIRParams<TContent>): StoryboardIR;
}

export interface CreateIRParams<TContent = Record<string, unknown>> {
  readonly brandId: BrandId;
  readonly brandName: string;
  readonly brandColor: string;
  readonly nicheId: NicheId;
  readonly nicheName: string;
  readonly themeId: string;
  readonly isDark: boolean;
  readonly contentType: ContentType;
  readonly content: TContent;
}

// =========================================================================
// CAMADA B — INTERMEDIATE REPRESENTATION (IR)
// Platform-independent AST of the content scenes
// =========================================================================

export type SceneIRType =
  | 'title_reveal'
  | 'cards_sequence'
  | 'myth_fact_comparison'
  | 'timeline_steps'
  | 'stat_highlight'
  | 'commercial_offer'
  | 'closing_cta';

export interface BaseSceneIR {
  readonly id: string;
  readonly type: SceneIRType;
  readonly durationSeconds: number;
  readonly title?: string;
  readonly subtitle?: string;
}

export interface TitleRevealSceneIR extends BaseSceneIR {
  readonly type: 'title_reveal';
  readonly headline: string;
  readonly highlightWords: readonly string[];
  readonly contextTag?: string;
}

export interface CardsSequenceSceneIR extends BaseSceneIR {
  readonly type: 'cards_sequence';
  readonly items: readonly {
    readonly number?: string;
    readonly title: string;
    readonly description: string;
    readonly icon?: string;
  }[];
}

export interface MythFactComparisonSceneIR extends BaseSceneIR {
  readonly type: 'myth_fact_comparison';
  readonly mythStatement: string;
  readonly mythExplanation: string;
  readonly factStatement: string;
  readonly factExplanation: string;
}

export interface TimelineStepsSceneIR extends BaseSceneIR {
  readonly type: 'timeline_steps';
  readonly steps: readonly {
    readonly stepNumber: string;
    readonly title: string;
    readonly description: string;
    readonly dateOrPhase?: string;
  }[];
}

export interface StatHighlightSceneIR extends BaseSceneIR {
  readonly type: 'stat_highlight';
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly description: string;
}

export interface CommercialOfferSceneIR extends BaseSceneIR {
  readonly type: 'commercial_offer';
  readonly serviceTitle: string;
  readonly features: readonly string[];
  readonly pricingLabel: string;
  readonly pricingValue: string;
  readonly pricingDisclaimer?: string;
}

export interface ClosingCtaSceneIR extends BaseSceneIR {
  readonly type: 'closing_cta';
  readonly callToAction: string;
  readonly subMessage?: string;
  readonly contactPhone?: string;
  readonly trustBadge?: string;
}

export type SceneIR =
  | TitleRevealSceneIR
  | CardsSequenceSceneIR
  | MythFactComparisonSceneIR
  | TimelineStepsSceneIR
  | StatHighlightSceneIR
  | CommercialOfferSceneIR
  | ClosingCtaSceneIR;

export interface StoryboardIR {
  readonly templateId: TemplateId;
  readonly version: string;
  readonly brand: {
    readonly id: BrandId;
    readonly name: string;
    readonly primaryColor: string;
  };
  readonly niche: {
    readonly id: NicheId;
    readonly name: string;
  };
  readonly theme: {
    readonly id: string;
    readonly isDark: boolean;
  };
  readonly contentType: ContentType;
  readonly totalDurationSeconds: number;
  readonly scenes: readonly SceneIR[];
}
