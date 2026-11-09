import {isKnownBrand, BRAND_REGISTRY} from '../brand/registry';
import {isKnownNiche} from '../niche/registry';
import {HEX_COLOR_REGEX} from '../brand/registry';
import {
  CONTENT_TYPES,
  type ContentType,
  type MotionStudioConfig,
  type ValidationFailure,
  type ValidationResult,
} from './types';

export class ConfigValidationError extends Error {
  public readonly errors: readonly string[];

  constructor(errors: readonly string[]) {
    super(`MotionStudioConfig validation failed:\n - ${errors.join('\n - ')}`);
    this.name = 'ConfigValidationError';
    this.errors = errors;
  }
}

export function validateHexColor(color: unknown): boolean {
  return typeof color === 'string' && HEX_COLOR_REGEX.test(color.trim());
}

export function validateMotionStudioConfig<T = Record<string, unknown>>(
  input: unknown,
): ValidationResult<MotionStudioConfig<T>> {
  const errors: string[] = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {
      success: false,
      errors: ['Configuration must be a non-null JSON object.'],
    };
  }

  const raw = input as Record<string, unknown>;

  // 1. schemaVersion
  if (typeof raw.schemaVersion !== 'string' || raw.schemaVersion.trim().length === 0) {
    errors.push('"schemaVersion" is required and must be a non-empty string (e.g. "1.0.0").');
  }

  // 2. appId
  if (typeof raw.appId !== 'string' || !isKnownBrand(raw.appId)) {
    const validBrands = Object.keys(BRAND_REGISTRY).join(', ');
    errors.push(
      `Unknown or missing "appId": "${String(raw.appId)}". Must be one of: ${validBrands}.`,
    );
  }

  // 3. contentType
  if (
    typeof raw.contentType !== 'string' ||
    !CONTENT_TYPES.includes(raw.contentType as ContentType)
  ) {
    const validTypes = CONTENT_TYPES.join(', ');
    errors.push(
      `Invalid or missing "contentType": "${String(raw.contentType)}". Allowed content types are: ${validTypes}.`,
    );
  }

  // 4. templateId
  if (typeof raw.templateId !== 'string' || raw.templateId.trim().length === 0) {
    errors.push('"templateId" is required and must be a non-empty string.');
  }

  // 5. contentData
  if (!raw.contentData || typeof raw.contentData !== 'object' || Array.isArray(raw.contentData)) {
    errors.push('"contentData" is required and must be a JSON object.');
  }

  // 6. Optional nicheId
  if (raw.nicheId !== undefined) {
    if (typeof raw.nicheId !== 'string' || !isKnownNiche(raw.nicheId)) {
      errors.push(`Unknown "nicheId": "${String(raw.nicheId)}".`);
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors: Object.freeze(errors),
    };
  }

  const resolvedBrand = BRAND_REGISTRY[raw.appId as keyof typeof BRAND_REGISTRY];
  const config: MotionStudioConfig<T> = {
    schemaVersion: String(raw.schemaVersion).trim(),
    appId: resolvedBrand.id,
    nicheId: (raw.nicheId as any) ?? resolvedBrand.niche,
    themeId: (raw.themeId as any) ?? resolvedBrand.defaultThemeId ?? 'editorial_premium',
    contentType: raw.contentType as ContentType,
    templateId: String(raw.templateId).trim(),
    contentData: raw.contentData as T,
  };

  return {
    success: true,
    data: Object.freeze(config),
  };
}

export function isValidationFailure<T>(
  result: ValidationResult<T>,
): result is ValidationFailure {
  return result.success === false;
}

export function parseMotionStudioConfig<T = Record<string, unknown>>(
  input: unknown,
): MotionStudioConfig<T> {
  const result = validateMotionStudioConfig<T>(input);
  if (isValidationFailure(result)) {
    throw new ConfigValidationError(result.errors);
  }
  return result.data;
}
