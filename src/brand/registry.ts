import type {AppBrand, BrandId} from './types';

export const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

export function isValidHexColor(color: string): boolean {
  return typeof color === 'string' && HEX_COLOR_REGEX.test(color.trim());
}

export function assertValidHexColor(color: string, fieldName = 'color'): string {
  if (!isValidHexColor(color)) {
    throw new TypeError(`BrandRegistry: "${fieldName}" must be a valid hex color code (e.g. #FF4D00 or #FFF). Received: "${color}".`);
  }
  return color.trim().toUpperCase();
}

export const BRAND_REGISTRY: Readonly<Record<BrandId, AppBrand>> = Object.freeze({
  fitmarketing: {
    id: 'fitmarketing',
    name: 'FitMarketing',
    niche: 'fitness',
    primaryColor: assertValidHexColor('#FF4D00', 'primaryColor'),
    complementaryColors: {
      primary: '#FF4D00',
      secondary: '#FF7A00',
      accent: '#FFB800',
      background: '#0D0E12',
      surface: '#181A20',
      surfaceElevated: '#232630',
      textPrimary: '#FFFFFF',
      textSecondary: '#A0A5B5',
      border: '#2E3342',
    },
    typographyStyle: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 900,
      bodyWeight: 500,
      letterSpacing: 2,
    },
    animationStyle: {
      motionStyle: 'energetic',
      intensity: 'high',
      defaultEasing: 'easeOutCubic',
      durationMultiplier: 0.9,
      staggerMultiplier: 0.85,
    },
    contentCategories: ['treino', 'hipertrofia', 'motivacao', 'resultados', 'nutricao_esportiva'],
    allowedTemplates: ['stat_showcase', 'comparison_before_after', 'feature_pillars', 'kinetic_announcement', 'timeline_process'],
    editorialTone: {
      voice: 'Treinador motivador e focado em superação',
      tone: ['enérgico', 'disciplinado', 'direto', 'inspirador'],
      keywords: ['foco', 'disciplina', 'evolução', 'treino', 'superação', 'resultado'],
      readingPace: 'fast',
      audience: 'Praticantes de atividade física, atletas e pessoas buscando emagrecimento ou ganho muscular',
    },
    defaultThemeId: 'editorial_premium',
  },

  dentmarketing: {
    id: 'dentmarketing',
    name: 'DentMarketing',
    niche: 'odontologia',
    primaryColor: assertValidHexColor('#0EA5E9', 'primaryColor'),
    complementaryColors: {
      primary: '#0EA5E9',
      secondary: '#0284C7',
      accent: '#38BDF8',
      background: '#F0F9FF',
      surface: '#FFFFFF',
      surfaceElevated: '#E0F2FE',
      textPrimary: '#0C4A6E',
      textSecondary: '#475569',
      border: '#BAE6FD',
    },
    typographyStyle: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 800,
      bodyWeight: 400,
      letterSpacing: 1.5,
    },
    animationStyle: {
      motionStyle: 'smooth',
      intensity: 'moderate',
      defaultEasing: 'easeOutCubic',
      durationMultiplier: 1.0,
      staggerMultiplier: 1.0,
    },
    contentCategories: ['clareamento', 'ortodontia', 'implantes', 'prevencao', 'estetica_dental'],
    allowedTemplates: ['comparison_before_after', 'stat_showcase', 'feature_pillars', 'timeline_treatment', 'kinetic_announcement'],
    editorialTone: {
      voice: 'Especialista em saúde e estética bucal com acolhimento clínico',
      tone: ['seguro', 'humanizado', 'científico', 'acolhedor'],
      keywords: ['sorriso', 'segurança', 'clareamento', 'estética', 'saúde bucal', 'conforto'],
      readingPace: 'moderate',
      audience: 'Pacientes que buscam transformar o sorriso ou manter a saúde bucal em dia',
    },
    defaultThemeId: 'editorial_premium',
  },

  beautymarketing: {
    id: 'beautymarketing',
    name: 'BeautyMarketing',
    niche: 'beleza',
    primaryColor: assertValidHexColor('#EC4899', 'primaryColor'),
    complementaryColors: {
      primary: '#EC4899',
      secondary: '#DB2777',
      accent: '#F472B6',
      background: '#FDF2F8',
      surface: '#FFFFFF',
      surfaceElevated: '#FCE7F3',
      textPrimary: '#831843',
      textSecondary: '#6B7280',
      border: '#FBCFE8',
    },
    typographyStyle: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 800,
      bodyWeight: 400,
      letterSpacing: 2,
    },
    animationStyle: {
      motionStyle: 'smooth',
      intensity: 'moderate',
      defaultEasing: 'easeOutCubic',
      durationMultiplier: 1.05,
      staggerMultiplier: 1.0,
    },
    contentCategories: ['harmonizacao', 'skincare', 'cabelos', 'unhas', 'autocuidado'],
    allowedTemplates: ['kinetic_announcement', 'comparison_before_after', 'feature_pillars', 'stat_showcase', 'timeline_treatment'],
    editorialTone: {
      voice: 'Consultora de estilo e bem-estar sofisticada e próxima',
      tone: ['elegante', 'aspiracional', 'empoderador', 'leve'],
      keywords: ['autoestima', 'beleza', 'brilho', 'renovação', 'cuidado', 'sofisticação'],
      readingPace: 'moderate',
      audience: 'Pessoas que valorizam autocuidado, bem-estar estético e procedimentos de alta qualidade',
    },
    defaultThemeId: 'editorial_premium',
  },

  vetmarketing: {
    id: 'vetmarketing',
    name: 'VetMarketing',
    niche: 'veterinaria',
    primaryColor: assertValidHexColor('#22C55E', 'primaryColor'),
    complementaryColors: {
      primary: '#22C55E',
      secondary: '#16A34A',
      accent: '#4ADE80',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      surfaceElevated: '#DCFCE7',
      textPrimary: '#14532D',
      textSecondary: '#4B5563',
      border: '#BBF7D0',
    },
    typographyStyle: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 800,
      bodyWeight: 400,
      letterSpacing: 1,
    },
    animationStyle: {
      motionStyle: 'smooth',
      intensity: 'moderate',
      defaultEasing: 'easeOutCubic',
      durationMultiplier: 1.0,
      staggerMultiplier: 1.0,
    },
    contentCategories: ['vacinacao', 'alimentacao_pet', 'cuidados_preventivos', 'emergencias', 'comportamento'],
    allowedTemplates: ['feature_pillars', 'stat_showcase', 'timeline_treatment', 'kinetic_announcement', 'comparison_before_after'],
    editorialTone: {
      voice: 'Médico veterinário amigo e guardião da saúde dos animais',
      tone: ['afetuoso', 'confiável', 'didático', 'preventivo'],
      keywords: ['pet', 'saúde animal', 'proteção', 'amor', 'prevenção', 'tutor'],
      readingPace: 'moderate',
      audience: 'Tutores de cães, gatos e outros pets que buscam o melhor cuidado para seus animais',
    },
    defaultThemeId: 'editorial_premium',
  },

  chefmarketing: {
    id: 'chefmarketing',
    name: 'ChefMarketing',
    niche: 'gastronomia',
    primaryColor: assertValidHexColor('#EF4444', 'primaryColor'),
    complementaryColors: {
      primary: '#EF4444',
      secondary: '#DC2626',
      accent: '#F97316',
      background: '#120F0F',
      surface: '#1F1A1A',
      surfaceElevated: '#2D2525',
      textPrimary: '#FFF5F5',
      textSecondary: '#A8A29E',
      border: '#443737',
    },
    typographyStyle: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 900,
      bodyWeight: 500,
      letterSpacing: 2,
    },
    animationStyle: {
      motionStyle: 'dynamic',
      intensity: 'high',
      defaultEasing: 'easeOutCubic',
      durationMultiplier: 0.95,
      staggerMultiplier: 0.9,
    },
    contentCategories: ['pratos_principais', 'experiencia_gastronomica', 'cardapio_da_semana', 'bastidores', 'promocoes'],
    allowedTemplates: ['kinetic_announcement', 'feature_pillars', 'stat_showcase', 'comparison_before_after'],
    editorialTone: {
      voice: 'Chef apaixonado pela arte dos sabores e hospitalidade',
      tone: ['apetitoso', 'caloroso', 'expressivo', 'autêntico'],
      keywords: ['sabor', 'frescor', 'experiência', 'artesanal', 'gastronomia', 'cardápio'],
      readingPace: 'fast',
      audience: 'Apreciadores da boa mesa, famílias e clientes que valorizam momentos gastronômicos únicos',
    },
    defaultThemeId: 'editorial_premium',
  },

  coachmarketing: {
    id: 'coachmarketing',
    name: 'CoachMarketing',
    niche: 'coaching',
    primaryColor: assertValidHexColor('#8B5CF6', 'primaryColor'),
    complementaryColors: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA',
      background: '#0F0E17',
      surface: '#1E1B2E',
      surfaceElevated: '#2E2A44',
      textPrimary: '#FFFFFF',
      textSecondary: '#A5A1B8',
      border: '#3E3859',
    },
    typographyStyle: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 900,
      bodyWeight: 400,
      letterSpacing: 2,
    },
    animationStyle: {
      motionStyle: 'authoritative',
      intensity: 'high',
      defaultEasing: 'easeOutCubic',
      durationMultiplier: 1.0,
      staggerMultiplier: 0.9,
    },
    contentCategories: ['lideranca', 'produtividade', 'mindset', 'gestao_de_tempo', 'alta_performance'],
    allowedTemplates: ['stat_showcase', 'feature_pillars', 'timeline_treatment', 'kinetic_announcement'],
    editorialTone: {
      voice: 'Mentor executivo experiente, focado em alavancagem e metas',
      tone: ['estratégico', 'visionário', 'desafiador', 'claro'],
      keywords: ['liderança', 'clareza', 'estratégia', 'propósito', 'resultados', 'alta performance'],
      readingPace: 'moderate',
      audience: 'Líderes, empresários, executivos e profissionais que desejam acelerar a carreira',
    },
    defaultThemeId: 'editorial_premium',
  },

  fisiomarketing: {
    id: 'fisiomarketing',
    name: 'FisioMarketing',
    niche: 'fisioterapia',
    primaryColor: assertValidHexColor('#3B82F6', 'primaryColor'),
    complementaryColors: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      accent: '#60A5FA',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      surfaceElevated: '#EFF6FF',
      textPrimary: '#1E3A8A',
      textSecondary: '#64748B',
      border: '#BFDBFE',
    },
    typographyStyle: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 800,
      bodyWeight: 400,
      letterSpacing: 1.5,
    },
    animationStyle: {
      motionStyle: 'smooth',
      intensity: 'moderate',
      defaultEasing: 'easeOutCubic',
      durationMultiplier: 1.0,
      staggerMultiplier: 1.0,
    },
    contentCategories: ['reabilitacao', 'alivio_de_dor', 'pilates_clinico', 'postura', 'prevencao_lesoes'],
    allowedTemplates: ['comparison_before_after', 'timeline_treatment', 'stat_showcase', 'feature_pillars'],
    editorialTone: {
      voice: 'Especialista em reabilitação motora e movimento humano',
      tone: ['técnico e acessível', 'empático', 'restaurador', 'positivo'],
      keywords: ['movimento', 'reabilitação', 'sem dor', 'qualidade de vida', 'postura', 'autonomia'],
      readingPace: 'moderate',
      audience: 'Pessoas com dores crônicas, atletas lesionados e pacientes pós-operatórios',
    },
    defaultThemeId: 'editorial_premium',
  },

  quiromarketing: {
    id: 'quiromarketing',
    name: 'QuiroMarketing',
    niche: 'quiropraxia',
    primaryColor: assertValidHexColor('#059669', 'primaryColor'),
    complementaryColors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10B981',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      surfaceElevated: '#DCFCE7',
      textPrimary: '#064E3B',
      textSecondary: '#4B5563',
      border: '#A7F3D0',
    },
    typographyStyle: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 800,
      bodyWeight: 400,
      letterSpacing: 1.5,
    },
    animationStyle: {
      motionStyle: 'calm',
      intensity: 'moderate',
      defaultEasing: 'easeOutCubic',
      durationMultiplier: 1.05,
      staggerMultiplier: 1.0,
    },
    contentCategories: ['coluna_vertebral', 'ajuste_postural', 'dor_ciatica', 'ergonomia', 'vitalidade'],
    allowedTemplates: ['comparison_before_after', 'feature_pillars', 'stat_showcase', 'timeline_treatment'],
    editorialTone: {
      voice: 'Profissional de saúde da coluna que devolve o alinhamento e vitalidade',
      tone: ['equilibrado', 'confiável', 'preciso', 'vital'],
      keywords: ['alinhamento', 'coluna saudável', 'ajuste', 'vitalidade', 'descompressão', 'postura'],
      readingPace: 'relaxed',
      audience: 'Trabalhadores sedentários, quem sofre de dor nas costas e pessoas em busca de prevenção neuromuscular',
    },
    defaultThemeId: 'editorial_premium',
  },

  nutrimarketing: {
    id: 'nutrimarketing',
    name: 'NutriMarketing',
    niche: 'nutricao',
    primaryColor: assertValidHexColor('#84CC16', 'primaryColor'),
    complementaryColors: {
      primary: '#84CC16',
      secondary: '#65A30D',
      accent: '#A3E635',
      background: '#F7FEE7',
      surface: '#FFFFFF',
      surfaceElevated: '#ECFCCB',
      textPrimary: '#365314',
      textSecondary: '#4D7C0F',
      border: '#D9F99D',
    },
    typographyStyle: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 800,
      bodyWeight: 400,
      letterSpacing: 1.5,
    },
    animationStyle: {
      motionStyle: 'smooth',
      intensity: 'moderate',
      defaultEasing: 'easeOutCubic',
      durationMultiplier: 1.0,
      staggerMultiplier: 1.0,
    },
    contentCategories: ['reeducacao_alimentar', 'emagrecimento', 'nutricao_esportiva', 'metabolismo', 'receitas_saudaveis'],
    allowedTemplates: ['stat_showcase', 'comparison_before_after', 'feature_pillars', 'timeline_treatment'],
    editorialTone: {
      voice: 'Nutricionista baseado em evidências, acolhedor e focado em constância',
      tone: ['didático', 'saudável', 'encorajador', 'científico'],
      keywords: ['nutrição com ciência', 'equilíbrio', 'comida de verdade', 'energia', 'metabolismo', 'saúde'],
      readingPace: 'moderate',
      audience: 'Pessoas querendo melhorar sua alimentação, emagrecer com saúde ou otimizar treinos',
    },
    defaultThemeId: 'editorial_premium',
  },

  psicomarketing: {
    id: 'psicomarketing',
    name: 'PsicoMarketing',
    niche: 'psicologia',
    primaryColor: assertValidHexColor('#A78BFA', 'primaryColor'),
    complementaryColors: {
      primary: '#A78BFA',
      secondary: '#8B5CF6',
      accent: '#C4B5FD',
      background: '#0E0D14',
      surface: '#1A1824',
      surfaceElevated: '#282538',
      textPrimary: '#F5F3FF',
      textSecondary: '#A7A3B8',
      border: '#3D3852',
    },
    typographyStyle: {
      headingFont: 'Arial',
      bodyFont: 'Arial',
      headingWeight: 700,
      bodyWeight: 400,
      letterSpacing: 1.5,
    },
    animationStyle: {
      motionStyle: 'calm',
      intensity: 'subtle',
      defaultEasing: 'easeOutCubic',
      durationMultiplier: 1.15,
      staggerMultiplier: 1.1,
    },
    contentCategories: ['ansiedade', 'autoconhecimento', 'relacionamentos', 'burnout', 'equilibrio_emocional'],
    allowedTemplates: ['feature_pillars', 'kinetic_announcement', 'stat_showcase', 'timeline_treatment'],
    editorialTone: {
      voice: 'Psicólogo que oferece escuta atenta, espaço seguro e clareza emocional',
      tone: ['sereno', 'profundo', 'respeitoso', 'acolhedor'],
      keywords: ['autoconhecimento', 'saúde mental', 'acolhimento', 'paz interior', 'limites', 'clareza'],
      readingPace: 'relaxed',
      audience: 'Pessoas em busca de bem-estar emocional, manejo do estresse e desenvolvimento psicológico',
    },
    defaultThemeId: 'editorial_premium',
  },
});

export function getBrand(id: BrandId): AppBrand {
  const brand = BRAND_REGISTRY[id];
  if (!brand) {
    const validBrands = Object.keys(BRAND_REGISTRY).join(', ');
    throw new Error(`BrandRegistry: Unknown appId "${id}". Must be one of: ${validBrands}.`);
  }
  return brand;
}

export function getAllBrands(): readonly AppBrand[] {
  return Object.values(BRAND_REGISTRY);
}

export function isKnownBrand(id: string): id is BrandId {
  return id in BRAND_REGISTRY;
}
