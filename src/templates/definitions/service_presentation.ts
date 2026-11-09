import type {CreateIRParams, StoryboardIR, TemplateDefinition} from '../types';

export interface ServiceFeatureItem {
  readonly title: string;
  readonly description: string;
}

export interface ServicePresentationContent {
  readonly brandHeadline: string;
  readonly serviceTitle: string;
  readonly serviceCategory: string;
  readonly scheduleOrMethod: string;
  readonly processSummary: string;
  readonly features: readonly ServiceFeatureItem[];
  readonly commercialPricing: {
    readonly label: string;
    readonly value: string;
    readonly unit?: string;
    readonly disclaimer?: string;
  };
  readonly contact: {
    readonly phone: string;
    readonly cta: string;
    readonly guaranteeBadge?: string;
  };
}

export const SERVICE_PRESENTATION_TEMPLATE: TemplateDefinition<ServicePresentationContent> = {
  templateId: 'service_presentation',
  version: '1.0.0',
  name: 'Apresentação de Serviços',
  description: 'Estrutura comercial completa inspirada em serviços premium, com processo, diferenciais, valores e contato.',
  supportedNiches: ['all'],
  supportedContentTypes: ['video', 'carousel', 'story', 'feed_post'],
  supportedThemes: ['all'],
  requiredFields: [
    'brandHeadline',
    'serviceTitle',
    'serviceCategory',
    'scheduleOrMethod',
    'processSummary',
    'features',
    'commercialPricing',
    'contact',
  ],
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
    minDurationSeconds: 12,
    maxDurationSeconds: 30,
    defaultDurationSeconds: 16,
  },

  validateContent(content: unknown): {valid: boolean; errors: readonly string[]} {
    const errors: string[] = [];
    if (!content || typeof content !== 'object') {
      return {valid: false, errors: ['service_presentation: content must be a JSON object.']};
    }
    const c = content as Record<string, unknown>;

    if (typeof c.brandHeadline !== 'string' || c.brandHeadline.trim().length === 0) {
      errors.push('service_presentation: "brandHeadline" is required and cannot be empty.');
    }
    if (typeof c.serviceTitle !== 'string' || c.serviceTitle.trim().length === 0) {
      errors.push('service_presentation: "serviceTitle" is required and cannot be empty.');
    }
    if (typeof c.serviceCategory !== 'string' || c.serviceCategory.trim().length === 0) {
      errors.push('service_presentation: "serviceCategory" is required and cannot be empty.');
    }
    if (typeof c.scheduleOrMethod !== 'string' || c.scheduleOrMethod.trim().length === 0) {
      errors.push('service_presentation: "scheduleOrMethod" is required and cannot be empty.');
    }
    if (typeof c.processSummary !== 'string' || c.processSummary.trim().length === 0) {
      errors.push('service_presentation: "processSummary" is required and cannot be empty.');
    }

    if (!Array.isArray(c.features) || c.features.length < 2 || c.features.length > 4) {
      errors.push('service_presentation: "features" must be an array with 2 to 4 items.');
    } else {
      c.features.forEach((f, idx) => {
        if (!f || typeof f !== 'object') {
          errors.push(`service_presentation: feature #${idx + 1} must be an object.`);
          return;
        }
        const item = f as Record<string, unknown>;
        if (typeof item.title !== 'string' || item.title.trim().length === 0) {
          errors.push(`service_presentation: feature #${idx + 1} "title" is required.`);
        }
        if (typeof item.description !== 'string' || item.description.trim().length === 0) {
          errors.push(`service_presentation: feature #${idx + 1} "description" is required.`);
        }
      });
    }

    if (!c.commercialPricing || typeof c.commercialPricing !== 'object') {
      errors.push('service_presentation: "commercialPricing" is required.');
    } else {
      const p = c.commercialPricing as Record<string, unknown>;
      if (typeof p.label !== 'string' || p.label.trim().length === 0) {
        errors.push('service_presentation: commercialPricing.label is required.');
      }
      if (typeof p.value !== 'string' || p.value.trim().length === 0) {
        errors.push('service_presentation: commercialPricing.value is required.');
      }
    }

    if (!c.contact || typeof c.contact !== 'object') {
      errors.push('service_presentation: "contact" is required.');
    } else {
      const ct = c.contact as Record<string, unknown>;
      if (typeof ct.phone !== 'string' || ct.phone.trim().length === 0) {
        errors.push('service_presentation: contact.phone is required.');
      }
      if (typeof ct.cta !== 'string' || ct.cta.trim().length === 0) {
        errors.push('service_presentation: contact.cta is required.');
      }
    }

    return {valid: errors.length === 0, errors: Object.freeze(errors)};
  },

  createStoryboardIR(params: CreateIRParams<ServicePresentationContent>): StoryboardIR {
    const {brandId, brandName, brandColor, nicheId, nicheName, themeId, isDark, contentType, content} = params;

    const titleWords = content.serviceTitle.split(' ');
    const highlightWords = titleWords.length > 1 ? [titleWords[titleWords.length - 1]] : [];

    const formattedFeatures = content.features.map((f, idx) => ({
      number: `0${idx + 1}`,
      title: f.title,
      description: f.description,
      icon: 'spark',
    }));

    return {
      templateId: 'service_presentation',
      version: '1.0.0',
      brand: {id: brandId, name: brandName, primaryColor: brandColor},
      niche: {id: nicheId, name: nicheName},
      theme: {id: themeId, isDark},
      contentType,
      totalDurationSeconds: 15.0,
      scenes: [
        {
          id: 'scene_brand_opening',
          type: 'title_reveal',
          durationSeconds: 3.5,
          headline: content.serviceTitle,
          highlightWords,
          contextTag: `${content.brandHeadline.toUpperCase()} • ${content.serviceCategory.toUpperCase()}`,
        },
        {
          id: 'scene_process_features',
          type: 'cards_sequence',
          durationSeconds: 5.5,
          title: content.scheduleOrMethod,
          subtitle: content.processSummary,
          items: formattedFeatures,
        },
        {
          id: 'scene_commercial_offer',
          type: 'commercial_offer',
          durationSeconds: 3.0,
          serviceTitle: content.serviceTitle,
          features: content.features.map((f) => f.title),
          pricingLabel: content.commercialPricing.label,
          pricingValue: content.commercialPricing.value,
          pricingDisclaimer: content.commercialPricing.disclaimer,
        },
        {
          id: 'scene_contact_closing',
          type: 'closing_cta',
          durationSeconds: 3.0,
          callToAction: content.contact.cta,
          subMessage: content.brandHeadline,
          contactPhone: content.contact.phone,
          trustBadge: content.contact.guaranteeBadge ?? 'CONTRATAÇÃO SIMPLIFICADA SEM BUROCRACIA',
        },
      ],
    };
  },
};
