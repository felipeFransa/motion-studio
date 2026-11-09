import type {CreateIRParams, StoryboardIR, TemplateDefinition} from '../types';

export interface BenefitItem {
  readonly title: string;
  readonly description: string;
  readonly icon?: string;
}

export interface BenefitsListContent {
  readonly title: string;
  readonly context: string;
  readonly benefits: readonly BenefitItem[];
  readonly summary: string;
  readonly callToAction: string;
}

export const BENEFITS_LIST_TEMPLATE: TemplateDefinition<BenefitsListContent> = {
  templateId: 'benefits_list',
  version: '1.0.0',
  name: 'Lista de Benefícios',
  description: 'Exposição sequencial dos principais diferenciais e ganhos do cliente utilizando FeatureCards.',
  supportedNiches: ['all'],
  supportedContentTypes: ['video', 'carousel', 'story', 'feed_post'],
  supportedThemes: ['all'],
  requiredFields: ['title', 'context', 'benefits', 'summary', 'callToAction'],
  optionalFields: [],
  layoutConstraints: {
    supportedAspectRatios: ['9:16', '1:1'],
    maxTitleLength: 70,
    maxSubtitleLength: 60,
    minItemCount: 2,
    maxItemCount: 5,
    maxItemTitleLength: 45,
    maxItemDescriptionLength: 120,
  },
  durationConstraints: {
    minDurationSeconds: 8,
    maxDurationSeconds: 20,
    defaultDurationSeconds: 12,
  },

  validateContent(content: unknown): {valid: boolean; errors: readonly string[]} {
    const errors: string[] = [];
    if (!content || typeof content !== 'object') {
      return {valid: false, errors: ['benefits_list: content must be a JSON object.']};
    }
    const c = content as Record<string, unknown>;

    if (typeof c.title !== 'string' || c.title.trim().length === 0) {
      errors.push('benefits_list: "title" is required and cannot be empty.');
    } else if (c.title.length > 70) {
      errors.push(`benefits_list: "title" exceeds 70 characters (current: ${c.title.length}).`);
    }

    if (typeof c.context !== 'string' || c.context.trim().length === 0) {
      errors.push('benefits_list: "context" is required and cannot be empty.');
    }

    if (!Array.isArray(c.benefits) || c.benefits.length < 2 || c.benefits.length > 5) {
      errors.push('benefits_list: "benefits" must be an array with 2 to 5 items.');
    } else {
      c.benefits.forEach((b, idx) => {
        if (!b || typeof b !== 'object') {
          errors.push(`benefits_list: benefit #${idx + 1} must be an object.`);
          return;
        }
        const item = b as Record<string, unknown>;
        if (typeof item.title !== 'string' || item.title.trim().length === 0) {
          errors.push(`benefits_list: benefit #${idx + 1} "title" is required.`);
        }
        if (typeof item.description !== 'string' || item.description.trim().length === 0) {
          errors.push(`benefits_list: benefit #${idx + 1} "description" is required.`);
        }
      });
    }

    if (typeof c.summary !== 'string' || c.summary.trim().length === 0) {
      errors.push('benefits_list: "summary" is required and cannot be empty.');
    }
    if (typeof c.callToAction !== 'string' || c.callToAction.trim().length === 0) {
      errors.push('benefits_list: "callToAction" is required and cannot be empty.');
    }

    return {valid: errors.length === 0, errors: Object.freeze(errors)};
  },

  createStoryboardIR(params: CreateIRParams<BenefitsListContent>): StoryboardIR {
    const {brandId, brandName, brandColor, nicheId, nicheName, themeId, isDark, contentType, content} = params;

    const titleWords = content.title.split(' ');
    const highlightWords = titleWords.length > 1 ? [titleWords[titleWords.length - 1]] : [];

    const formattedCards = content.benefits.map((b, idx) => ({
      number: `0${idx + 1}`,
      title: b.title,
      description: b.description,
      icon: b.icon ?? 'spark',
    }));

    return {
      templateId: 'benefits_list',
      version: '1.0.0',
      brand: {id: brandId, name: brandName, primaryColor: brandColor},
      niche: {id: nicheId, name: nicheName},
      theme: {id: themeId, isDark},
      contentType,
      totalDurationSeconds: 12.0,
      scenes: [
        {
          id: 'scene_opening',
          type: 'title_reveal',
          durationSeconds: 3.5,
          headline: content.title,
          highlightWords,
          contextTag: content.context.toUpperCase(),
        },
        {
          id: 'scene_cards',
          type: 'cards_sequence',
          durationSeconds: 5.5,
          title: content.title,
          subtitle: content.context,
          items: formattedCards,
        },
        {
          id: 'scene_closing',
          type: 'closing_cta',
          durationSeconds: 3.0,
          callToAction: content.callToAction,
          subMessage: content.summary,
          trustBadge: `${brandName.toUpperCase()} • VANTAGENS EXCLUSIVAS`,
        },
      ],
    };
  },
};
