import type {CreateIRParams, StoryboardIR, TemplateDefinition} from '../types';

export interface StepItem {
  readonly stepNumber?: string;
  readonly title: string;
  readonly description: string;
  readonly dateOrPhase?: string;
}

export interface StepByStepContent {
  readonly title: string;
  readonly subtitle: string;
  readonly steps: readonly StepItem[];
  readonly conclusion: string;
  readonly callToAction: string;
}

export const STEP_BY_STEP_TEMPLATE: TemplateDefinition<StepByStepContent> = {
  templateId: 'step_by_step',
  version: '1.0.0',
  name: 'Passo a Passo',
  description: 'Jornada sequencial estruturada ideal para tratamentos, processos ou rotinas em etapas.',
  supportedNiches: ['all'],
  supportedContentTypes: ['video', 'carousel', 'story', 'feed_post'],
  supportedThemes: ['all'],
  requiredFields: ['title', 'subtitle', 'steps', 'conclusion', 'callToAction'],
  optionalFields: [],
  layoutConstraints: {
    supportedAspectRatios: ['9:16', '1:1'],
    maxTitleLength: 70,
    maxSubtitleLength: 60,
    minItemCount: 2,
    maxItemCount: 4,
    maxItemTitleLength: 45,
    maxItemDescriptionLength: 120,
  },
  durationConstraints: {
    minDurationSeconds: 10,
    maxDurationSeconds: 22,
    defaultDurationSeconds: 13,
  },

  validateContent(content: unknown): {valid: boolean; errors: readonly string[]} {
    const errors: string[] = [];
    if (!content || typeof content !== 'object') {
      return {valid: false, errors: ['step_by_step: content must be a JSON object.']};
    }
    const c = content as Record<string, unknown>;

    if (typeof c.title !== 'string' || c.title.trim().length === 0) {
      errors.push('step_by_step: "title" is required and cannot be empty.');
    } else if (c.title.length > 70) {
      errors.push(`step_by_step: "title" exceeds 70 characters (current: ${c.title.length}).`);
    }

    if (typeof c.subtitle !== 'string' || c.subtitle.trim().length === 0) {
      errors.push('step_by_step: "subtitle" is required and cannot be empty.');
    }

    if (!Array.isArray(c.steps) || c.steps.length < 2 || c.steps.length > 4) {
      errors.push('step_by_step: "steps" must be an array with 2 to 4 items.');
    } else {
      c.steps.forEach((s, idx) => {
        if (!s || typeof s !== 'object') {
          errors.push(`step_by_step: step #${idx + 1} must be an object.`);
          return;
        }
        const item = s as Record<string, unknown>;
        if (typeof item.title !== 'string' || item.title.trim().length === 0) {
          errors.push(`step_by_step: step #${idx + 1} "title" is required.`);
        }
        if (typeof item.description !== 'string' || item.description.trim().length === 0) {
          errors.push(`step_by_step: step #${idx + 1} "description" is required.`);
        }
      });
    }

    if (typeof c.conclusion !== 'string' || c.conclusion.trim().length === 0) {
      errors.push('step_by_step: "conclusion" is required and cannot be empty.');
    }
    if (typeof c.callToAction !== 'string' || c.callToAction.trim().length === 0) {
      errors.push('step_by_step: "callToAction" is required and cannot be empty.');
    }

    return {valid: errors.length === 0, errors: Object.freeze(errors)};
  },

  createStoryboardIR(params: CreateIRParams<StepByStepContent>): StoryboardIR {
    const {brandId, brandName, brandColor, nicheId, nicheName, themeId, isDark, contentType, content} = params;

    const titleWords = content.title.split(' ');
    const highlightWords = titleWords.length > 1 ? [titleWords[titleWords.length - 1]] : [];

    const formattedSteps = content.steps.map((step, idx) => ({
      stepNumber: step.stepNumber ?? `Passo 0${idx + 1}`,
      title: step.title,
      description: step.description,
      dateOrPhase: step.dateOrPhase ?? `Etapa ${idx + 1}`,
    }));

    return {
      templateId: 'step_by_step',
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
          headline: content.title,
          highlightWords,
          contextTag: content.subtitle.toUpperCase(),
        },
        {
          id: 'scene_steps',
          type: 'timeline_steps',
          durationSeconds: 6.5,
          title: content.title,
          subtitle: content.subtitle,
          steps: formattedSteps,
        },
        {
          id: 'scene_closing',
          type: 'closing_cta',
          durationSeconds: 3.0,
          callToAction: content.callToAction,
          subMessage: content.conclusion,
          trustBadge: `${brandName.toUpperCase()} • MÉTODO ESTRUTURADO`,
        },
      ],
    };
  },
};
