import type {NicheConfig, NicheId} from './types';

export const NICHE_REGISTRY: Readonly<Record<NicheId, NicheConfig>> = Object.freeze({
  fitness: {
    id: 'fitness',
    name: 'Fitness & Performance',
    description: 'Marketing e conteúdo para academias, estúdios, personal trainers e atletas.',
    coreTopics: ['Treino e Hipertrofia', 'Condicionamento Físico', 'Motivação Diária', 'Resultados de Alunos', 'Dicas Técnicas'],
    vocabulary: ['hipertrofia', 'disciplina', 'evolução', 'treino pesado', 'performance', 'resultado', 'força'],
    contentRestrictions: ['Não prometer resultados milagrosos sem esforço', 'Evitar posturas com risco de lesão sem aviso'],
    suggestedTemplates: ['stat_showcase', 'comparison_before_after', 'feature_pillars', 'kinetic_announcement'],
  },
  odontologia: {
    id: 'odontologia',
    name: 'Odontologia & Estética Dental',
    description: 'Comunicação clínica, clareamento, implantes e saúde bucal humanizada.',
    coreTopics: ['Ortodontia e Alinhadores', 'Implantes e Próteses', 'Estética do Sorriso', 'Prevenção e Limpeza', 'Mitos Odontológicos'],
    vocabulary: ['sorriso', 'saúde bucal', 'transformação', 'tecnologia odontológica', 'conforto', 'prevenção'],
    contentRestrictions: ['Respeitar código de ética do CFO', 'Não expor pacientes de forma sensacionalista'],
    suggestedTemplates: ['comparison_before_after', 'stat_showcase', 'feature_pillars', 'timeline_treatment'],
  },
  beleza: {
    id: 'beleza',
    name: 'Beleza & Estética',
    description: 'Salões premium, estética facial e corporal, skincare e maquiagem.',
    coreTopics: ['Harmonização e Skincare', 'Cuidados Capilares', 'Unhas e Micropigmentação', 'Tendências de Make', 'Autocuidado'],
    vocabulary: ['brilho', 'autoestima', 'cuidado', 'sofisticação', 'pele saudável', 'beleza natural', 'transformação'],
    contentRestrictions: ['Não prometer rejuvenescimento irreal', 'Indicar necessidade de avaliação individual'],
    suggestedTemplates: ['kinetic_announcement', 'comparison_before_after', 'feature_pillars', 'stat_showcase'],
  },
  veterinaria: {
    id: 'veterinaria',
    name: 'Medicina Veterinária & Pet Care',
    description: 'Hospitais veterinários, clínicas pet, vacinação e bem-estar animal.',
    coreTopics: ['Vacinação e Vermifugação', 'Alimentação Pet', 'Emergências e Sintomas', 'Comportamento Animal', 'Cirurgias Seguras'],
    vocabulary: ['saúde pet', 'amor de quatro patas', 'cuidado preventivo', 'tutor responsável', 'vida longa', 'veterinário de confiança'],
    contentRestrictions: ['Não orientar automedicação para animais', 'Alertar sobre riscos de alimentos proibidos'],
    suggestedTemplates: ['feature_pillars', 'stat_showcase', 'timeline_treatment', 'kinetic_announcement'],
  },
  gastronomia: {
    id: 'gastronomia',
    name: 'Gastronomia & Restaurantes',
    description: 'Restaurantes, bistrôs, cafeterias, chefs e delivery gastronômico.',
    coreTopics: ['Pratos Principais', 'Ingredientes Selecionados', 'Experiência Gastronômica', 'Bastidores da Cozinha', 'Cardápio Especial'],
    vocabulary: ['sabor inesquecível', 'artesanal', 'frescor', 'experiência sensorial', 'ingredientes nobres', 'delivery rápido'],
    contentRestrictions: ['Alérgenos devem ser destacados quando relevante'],
    suggestedTemplates: ['kinetic_announcement', 'feature_pillars', 'stat_showcase', 'comparison_before_after'],
  },
  coaching: {
    id: 'coaching',
    name: 'Coaching & Alta Performance',
    description: 'Mentoria executiva, liderança, carreira e mindset estratégico.',
    coreTopics: ['Gestão de Tempo', 'Liderança de Equipes', 'Inteligência Emocional', 'Metas e Planejamento', 'Resolução de Conflitos'],
    vocabulary: ['alta performance', 'clareza', 'estratégia', 'propósito', 'liderança', 'alavancagem', 'resultados consistentes'],
    contentRestrictions: ['Não associar com promessas de enriquecimento rápido'],
    suggestedTemplates: ['stat_showcase', 'feature_pillars', 'timeline_treatment', 'kinetic_announcement'],
  },
  fisioterapia: {
    id: 'fisioterapia',
    name: 'Fisioterapia & Reabilitação',
    description: 'Recuperação funcional, pilates clínico, fisioterapia desportiva e preventiva.',
    coreTopics: ['Alívio de Dores', 'Reabilitação Ortopédica', 'Pilates e Flexibilidade', 'Ergonomia no Trabalho', 'Pós-Cirúrgico'],
    vocabulary: ['movimento sem dor', 'reabilitação', 'qualidade de vida', 'postura correta', 'funcionalidade', 'autonomia'],
    contentRestrictions: ['Evitar prescrever exercícios específicos sem diagnóstico individual'],
    suggestedTemplates: ['comparison_before_after', 'timeline_treatment', 'stat_showcase', 'feature_pillars'],
  },
  quiropraxia: {
    id: 'quiropraxia',
    name: 'Quiropraxia & Saúde da Coluna',
    description: 'Ajustes quiropráticos, descompressão, saúde neuromuscular e postura.',
    coreTopics: ['Ajuste da Coluna', 'Dores no Nervo Ciático', 'Hérnia de Disco e Prevenção', 'Estresse e Tensão Muscular', 'Mobilidade'],
    vocabulary: ['alinhamento vertebral', 'sistema nervoso', 'alívio imediato', 'ajuste postural', 'vitalidade', 'descompressão'],
    contentRestrictions: ['Esclarecer que quiropraxia exige formação especializada'],
    suggestedTemplates: ['comparison_before_after', 'feature_pillars', 'stat_showcase', 'timeline_treatment'],
  },
  nutricao: {
    id: 'nutricao',
    name: 'Nutrição Clínica & Esportiva',
    description: 'Reeducação alimentar, emagrecimento consciente, hipertrofia e exames.',
    coreTopics: ['Composição Corporal', 'Planejamento de Refeições', 'Suplementação Baseada em Evidência', 'Metabolismo', 'Relação com a Comida'],
    vocabulary: ['nutrição com ciência', 'equilíbrio', 'metabolismo ativo', 'energia limpa', 'hábitos sustentáveis', 'comida de verdade'],
    contentRestrictions: ['Não incentivar dietas restritivas extremas ou modismos sem embasamento'],
    suggestedTemplates: ['stat_showcase', 'comparison_before_after', 'feature_pillars', 'timeline_treatment'],
  },
  psicologia: {
    id: 'psicologia',
    name: 'Psicologia Clínica & Saúde Mental',
    description: 'Terapia humanizada, manejo da ansiedade, autoconhecimento e equilíbrio.',
    coreTopics: ['Gestão da Ansiedade', 'Autoconhecimento e Limites', 'Relacionamentos Saudáveis', 'Burnout e Trabalho', 'Depressão e Suporte'],
    vocabulary: ['acolhimento', 'saúde mental', 'escuta atenta', 'autoconhecimento', 'paz interior', 'espaço seguro', 'clareza emocional'],
    contentRestrictions: ['Nunca prescrever medicamentos', 'Fornecer canais de emergência (CVV 188) em temas críticos'],
    suggestedTemplates: ['feature_pillars', 'kinetic_announcement', 'stat_showcase', 'timeline_treatment'],
  },
});

export function getNiche(id: NicheId): NicheConfig {
  const niche = NICHE_REGISTRY[id];
  if (!niche) {
    throw new Error(`NicheRegistry: Unknown nicheId "${id}".`);
  }
  return niche;
}

export function getAllNiches(): readonly NicheConfig[] {
  return Object.values(NICHE_REGISTRY);
}

export function isKnownNiche(id: string): id is NicheId {
  return id in NICHE_REGISTRY;
}
