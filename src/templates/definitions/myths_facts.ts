import type {CreateIRParams, StoryboardIR, TemplateDefinition} from '../types';

export interface MythFactContent {
  readonly question: string;
  readonly topic: string;
  readonly mythStatement: string;
  readonly mythExplanation: string;
  readonly factStatement: string;
  readonly factExplanation: string;
  readonly takeaway: string;
  readonly callToAction: string;
  readonly editorialDisclaimer?: string;
}

export const MYTHS_FACTS_TEMPLATE: TemplateDefinition<MythFactContent> = {
  templateId: 'myths_facts',
  version: '1.0.0',
  name: 'Mitos e Verdades',
  description: 'Contraste dinâmico entre crenças populares e fatos fundamentados com foco em esclarecimento.',
  supportedNiches: ['all'],
  supportedContentTypes: ['video', 'carousel', 'story', 'feed_post'],
  supportedThemes: ['all'],
  requiredFields: [
    'question',
    'topic',
    'mythStatement',
    'mythExplanation',
    'factStatement',
    'factExplanation',
    'takeaway',
    'callToAction',
  ],
  optionalFields: ['editorialDisclaimer'],
  layoutConstraints: {
    supportedAspectRatios: ['9:16', '1:1'],
    maxTitleLength: 70,
    maxSubtitleLength: 60,
    minItemCount: 2,
    maxItemCount: 2,
    maxItemTitleLength: 60,
    maxItemDescriptionLength: 140,
  },
  durationConstraints: {
    minDurationSeconds: 10,
    maxDurationSeconds: 22,
    defaultDurationSeconds: 13,
  },

  validateContent(content: unknown): {valid: boolean; errors: readonly string[]} {
    const errors: string[] = [];
    if (!content || typeof content !== 'object') {
      return {valid: false, errors: ['myths_facts: content must be a JSON object.']};
    }
    const c = content as Record<string, unknown>;

    if (typeof c.question !== 'string' || c.question.trim().length === 0) {
      errors.push('myths_facts: "question" is required and cannot be empty.');
    } else if (c.question.length > 70) {
      errors.push(`myths_facts: "question" exceeds 70 characters (current: ${c.question.length}).`);
    }

    if (typeof c.topic !== 'string' || c.topic.trim().length === 0) {
      errors.push('myths_facts: "topic" is required and cannot be empty.');
    }
    if (typeof c.mythStatement !== 'string' || c.mythStatement.trim().length === 0) {
      errors.push('myths_facts: "mythStatement" is required and cannot be empty.');
    }
    if (typeof c.mythExplanation !== 'string' || c.mythExplanation.trim().length === 0) {
      errors.push('myths_facts: "mythExplanation" is required and cannot be empty.');
    }
    if (typeof c.factStatement !== 'string' || c.factStatement.trim().length === 0) {
      errors.push('myths_facts: "factStatement" is required and cannot be empty.');
    }
    if (typeof c.factExplanation !== 'string' || c.factExplanation.trim().length === 0) {
      errors.push('myths_facts: "factExplanation" is required and cannot be empty.');
    }
    if (typeof c.takeaway !== 'string' || c.takeaway.trim().length === 0) {
      errors.push('myths_facts: "takeaway" is required and cannot be empty.');
    }
    if (typeof c.callToAction !== 'string' || c.callToAction.trim().length === 0) {
      errors.push('myths_facts: "callToAction" is required and cannot be empty.');
    }

    return {valid: errors.length === 0, errors: Object.freeze(errors)};
  },

  createStoryboardIR(params: CreateIRParams<MythFactContent>): StoryboardIR {
    const {brandId, brandName, brandColor, nicheId, nicheName, themeId, isDark, contentType, content} = params;

    const questionWords = content.question.split(' ');
    const highlightWords = questionWords.length > 1 ? [questionWords[questionWords.length - 1]] : [];

    return {
      templateId: 'myths_facts',
      version: '1.0.0',
      brand: {id: brandId, name: brandName, primaryColor: brandColor},
      niche: {id: nicheId, name: nicheName},
      theme: {id: themeId, isDark},
      contentType,
      totalDurationSeconds: 13.0,
      scenes: [
        {
          id: 'scene_opening',
          type: 'title_reveal',
          durationSeconds: 3.5,
          headline: content.question,
          highlightWords,
          contextTag: `MITO OU VERDADE? • ${content.topic.toUpperCase()}`,
        },
        {
          id: 'scene_comparison',
          type: 'myth_fact_comparison',
          durationSeconds: 6.5,
          title: content.topic,
          subtitle: 'Análise Técnica e Esclarecimento',
          mythStatement: content.mythStatement,
          mythExplanation: content.mythExplanation,
          factStatement: content.factStatement,
          factExplanation: content.factExplanation,
        },
        {
          id: 'scene_closing',
          type: 'closing_cta',
          durationSeconds: 3.0,
          callToAction: content.callToAction,
          subMessage: content.takeaway,
          trustBadge: content.editorialDisclaimer ?? `${brandName.toUpperCase()} • ORIENTAÇÃO PROFISSIONAL`,
        },
      ],
    };
  },
};
