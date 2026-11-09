import {isKnownBrand, getBrand} from '../../brand';
import {isKnownNiche, getNiche} from '../../niche';
import {isKnownTemplate, getTemplate} from '../registry';
import type {MotionStudioConfig, ValidationResult} from '../../contract/types';
import type {StoryboardIR} from '../types';

export class TemplateValidationError extends Error {
  public readonly errors: readonly string[];

  constructor(errors: readonly string[]) {
    super(`Template validation failed:\n - ${errors.join('\n - ')}`);
    this.name = 'TemplateValidationError';
    this.errors = errors;
  }
}

export function validateTemplateRequest(input: unknown): ValidationResult<MotionStudioConfig> {
  const errors: string[] = [];

  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return {success: false, errors: ['Request must be a non-null JSON object.']};
  }

  const raw = input as Record<string, unknown>;

  // 1. schemaVersion
  if (typeof raw.schemaVersion !== 'string' || raw.schemaVersion.trim().length === 0) {
    errors.push('"schemaVersion" is required and cannot be empty.');
  }

  // 2. appId
  if (typeof raw.appId !== 'string' || !isKnownBrand(raw.appId)) {
    errors.push(`Unknown or missing "appId": "${String(raw.appId)}".`);
  }

  // 3. templateId
  if (typeof raw.templateId !== 'string' || !isKnownTemplate(raw.templateId)) {
    errors.push(`Unknown or missing "templateId": "${String(raw.templateId)}".`);
  }

  // If basic identifiers are invalid, fail early
  if (errors.length > 0) {
    return {success: false, errors: Object.freeze(errors)};
  }

  const brand = getBrand(raw.appId as any);
  const template = getTemplate(raw.templateId as any);

  // 4. contentType
  if (
    typeof raw.contentType !== 'string' ||
    !template.supportedContentTypes.includes(raw.contentType as any)
  ) {
    const supported = template.supportedContentTypes.join(', ');
    errors.push(
      `contentType "${String(raw.contentType)}" is not supported by template "${template.templateId}". Supported: ${supported}.`,
    );
  }

  // 5. niche compatibility
  const nicheId = (raw.nicheId as any) ?? brand.niche;
  if (!isKnownNiche(nicheId)) {
    errors.push(`Unknown "nicheId": "${String(nicheId)}".`);
  } else if (
    !template.supportedNiches.includes('all') &&
    !template.supportedNiches.includes(nicheId)
  ) {
    errors.push(
      `Template "${template.templateId}" does not support niche "${String(nicheId)}".`,
    );
  }

  // 6. contentData validation per template definition
  const content = raw.content ?? raw.contentData;
  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    errors.push('"content" (or "contentData") is required and must be a JSON object.');
  } else {
    const contentValidation = template.validateContent(content);
    if (!contentValidation.valid) {
      errors.push(...contentValidation.errors);
    }
  }

  if (errors.length > 0) {
    return {success: false, errors: Object.freeze(errors)};
  }

  const config: MotionStudioConfig = {
    schemaVersion: String(raw.schemaVersion).trim(),
    appId: brand.id,
    nicheId,
    themeId: (raw.themeId as any) ?? brand.defaultThemeId ?? 'editorial_premium',
    contentType: raw.contentType as any,
    templateId: template.templateId,
    contentData: content as any,
  };

  return {success: true, data: Object.freeze(config)};
}
