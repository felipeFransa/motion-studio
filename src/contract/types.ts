import type {BrandId} from '../brand/types';
import type {NicheId} from '../niche/types';
import type {ThemePresetId} from '../theme/types';

export const CONTENT_TYPES = ['video', 'feed_post', 'carousel', 'story'] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

export interface MotionStudioConfig<TContentData = Record<string, unknown>> {
  readonly schemaVersion: string;
  readonly appId: BrandId;
  readonly nicheId?: NicheId;
  readonly themeId?: ThemePresetId | string;
  readonly contentType: ContentType;
  readonly templateId: string;
  readonly contentData: TContentData;
}

export interface ValidationSuccess<T> {
  readonly success: true;
  readonly data: T;
}

export interface ValidationFailure {
  readonly success: false;
  readonly errors: readonly string[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;
