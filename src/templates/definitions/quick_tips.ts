import type {CreateIRParams, StoryboardIR, TemplateDefinition} from '../types';

export interface QuickTipItem {
  readonly number?: string;
  readonly title: string;
  readonly description: string;
}

export interface QuickTipsContent {
  readonly title: string;
  readonly subject: string;
  readonly tips: readonly QuickTipItem[];
  readonly summary: string;
  readonly callToAction: string;
}

export const QUICK_TIPS_TEMPLATE: TemplateDefinition<QuickTipsContent> = {
  templateId: 'quick_tips',
  version: '1.0.0',
  name: 'Dicas Rápidas',
  description: 'Estrutura ágil para apresentar dicas práticas com título cinético, cartões sequenciais e CTA.',
  supportedNiches: ['all'],
  supportedContentTypes: ['video', 'carousel', 'story', 'feed_post'],
  supportedThemes: ['all'],
  requiredFields: ['title', 'subject', 'tips', 'summary', 'callToAction'],
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
      return {valid: false, errors: ['quick_tips: content must be a JSON object.']};
    }
    const c = content as Record<string, unknown>;

    if (typeof c.title !== 'string' || c.title.trim().length === 0) {
      errors.push('quick_tips: "title" is required and cannot be empty.');
    } else if (c.title.length > 70) {
      errors.push(`quick_tips: "title" exceeds maximum length of 70 characters (current: ${c.title.length}).`);
    }

    if (typeof c.subject !== 'string' || c.subject.trim().length === 0) {
      errors.push('quick_tips: "subject" is required and cannot be empty.');
    }

    if (!Array.isArray(c.tips) || c.tips.length < 2 || c.tips.length > 5) {
      errors.push('quick_tips: "tips" must be an array with between 2 and 5 items.');
    } else {
      c.tips.forEach((tip, idx) => {
        if (!tip || typeof tip !== 'object') {
          errors.push(`quick_tips: tip #${idx + 1} must be an object.`);
          return;
        }
        const t = tip as Record<string, unknown>;
        if (typeof t.title !== 'string' || t.title.trim().length === 0) {
          errors.push(`quick_tips: tip #${idx + 1} "title" is required.`);
        }
        if (typeof t.description !== 'string' || t.description.trim().length === 0) {
          errors.push(`quick_tips: tip #${idx + 1} "description" is required.`);
        }
      });
    }

    if (typeof c.summary !== 'string' || c.summary.trim().length === 0) {
      errors.push('quick_tips: "summary" is required and cannot be empty.');
    }
    if (typeof c.callToAction !== 'string' || c.callToAction.trim().length === 0) {
      errors.push('quick_tips: "callToAction" is required and cannot be empty.');
    }

    return {valid: errors.length === 0, errors: Object.freeze(errors)};
  },

  createStoryboardIR(params: CreateIRParams<QuickTipsContent>): StoryboardIR {
    const {brandId, brandName, brandColor, nicheId, nicheName, themeId, isDark, contentType, content} = params;

    // Distribute words to highlight (e.g. last 1-2 words of title)
    const titleWords = content.title.split(' ');
    const highlightWords = titleWords.length > 1 ? [titleWords[titleWords.length - 1]] : [];

    const formattedTips = content.tips.map((tip, index) => ({
      number: tip.number ?? `0${index + 1}`,
      title: tip.title,
      description: tip.description,
      icon: 'spark',
    }));

    return {
      templateId: 'quick_tips',
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
          contextTag: content.subject.toUpperCase(),
        },
        {
          id: 'scene_tips',
          type: 'cards_sequence',
          durationSeconds: 5.5,
          title: content.subject,
          subtitle: `${content.tips.length} Recomendações Práticas`,
          items: formattedTips,
        },
        {
          id: 'scene_closing',
          type: 'closing_cta',
          durationSeconds: 3.0,
          callToAction: content.callToAction,
          subMessage: content.summary,
          trustBadge: `${brandName.toUpperCase()} • ${nicheName.toUpperCase()}`,
        },
      ],
    };
  },
};
