import {getBrand} from '../../brand';
import {getNiche} from '../../niche';
import {ThemeEngine, type ResolvedTheme} from '../../theme';
import {getTemplate} from '../registry';
import {validateTemplateRequest, TemplateValidationError} from '../validation';
import type {MotionStudioConfig} from '../../contract/types';
import type {StoryboardIR, TemplateDefinition} from '../types';

export interface ResolvedTemplateResult {
  readonly config: MotionStudioConfig;
  readonly brand: ReturnType<typeof getBrand>;
  readonly niche: ReturnType<typeof getNiche>;
  readonly theme: ResolvedTheme;
  readonly template: TemplateDefinition<any>;
  readonly storyboardIR: StoryboardIR;
}

export class TemplateResolver {
  public static resolve(rawInput: unknown): ResolvedTemplateResult {
    // 1. Validar a solicitação
    const validation = validateTemplateRequest(rawInput);
    if (validation.success === false) {
      throw new TemplateValidationError(validation.errors);
    }
    const config = validation.data;

    // 2. Identificar o aplicativo
    const brand = getBrand(config.appId);

    // 3. Identificar o nicho
    const niche = getNiche(config.nicheId ?? brand.niche);

    // 4. Carregar o tema (Theme Engine)
    const theme = ThemeEngine.resolve(brand, (config.themeId as any) ?? 'editorial_premium');

    // 5. Identificar o template
    const template = getTemplate(config.templateId);

    // 6. Gerar a Representação Intermediária (IR)
    const storyboardIR = template.createStoryboardIR({
      brandId: brand.id,
      brandName: brand.name,
      brandColor: brand.primaryColor,
      nicheId: niche.id,
      nicheName: niche.name,
      themeId: theme.themeId,
      isDark: theme.isDark,
      contentType: config.contentType,
      content: config.contentData,
    });

    return {
      config,
      brand,
      niche,
      theme,
      template,
      storyboardIR: Object.freeze(storyboardIR),
    };
  }
}
