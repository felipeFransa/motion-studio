import type {QuickTipsContent} from '../definitions/quick_tips';
import type {MythFactContent} from '../definitions/myths_facts';
import type {BenefitsListContent} from '../definitions/benefits_list';
import type {StepByStepContent} from '../definitions/step_by_step';
import type {ServicePresentationContent} from '../definitions/service_presentation';

export const SAMPLE_FITMARKETING_QUICK_TIPS: {
  schemaVersion: string;
  appId: 'fitmarketing';
  contentType: 'video';
  templateId: 'quick_tips';
  content: QuickTipsContent;
} = {
  schemaVersion: '1.0.0',
  appId: 'fitmarketing',
  contentType: 'video',
  templateId: 'quick_tips',
  content: {
    title: '3 DICAS PARA UMA ROTINA CONSISTENTE',
    subject: 'Treino e Alta Performance',
    tips: [
      {
        number: '01',
        title: 'Defina Horários Fixos',
        description: 'Trate seu treino como um compromisso inegociável na sua agenda diária.',
      },
      {
        number: '02',
        title: 'Priorize a Execução Correta',
        description: 'Qualidade de movimento supera carga excessiva e previne lesões.',
      },
      {
        number: '03',
        title: 'Valorize Pequenos Progressos',
        description: 'Constância semanal gera resultados duradouros e sustentáveis.',
      },
    ],
    summary: 'A disciplina diária constrói o corpo e a mente que você busca.',
    callToAction: 'COMECE SEU TREINO HOJE MESMO',
  },
};

export const SAMPLE_DENTMARKETING_MYTHS_FACTS: {
  schemaVersion: string;
  appId: 'dentmarketing';
  contentType: 'video';
  templateId: 'myths_facts';
  content: MythFactContent;
} = {
  schemaVersion: '1.0.0',
  appId: 'dentmarketing',
  contentType: 'video',
  templateId: 'myths_facts',
  content: {
    question: 'ESCOVAR COM FORÇA LIMPA MELHOR?',
    topic: 'Saúde Bucal Preventiva',
    mythStatement: 'Escova dura e muita força removem mais placa bacteriana.',
    mythExplanation: 'A força excessiva agride o esmalte dental e provoca retração gengival.',
    factStatement: 'Movimentos suaves com cerdas macias são a chave.',
    factExplanation: 'A limpeza correta é fruto da técnica e do uso diário do fio dental.',
    takeaway: 'Consulte seu dentista para uma avaliação preventiva regular.',
    callToAction: 'AGENDE SUA AVALIAÇÃO PREVENTIVA',
    editorialDisclaimer: 'DENTMARKETING • SAÚDE BUCAL BASEADA EM EVIDÊNCIAS',
  },
};

export const SAMPLE_BEAUTYMARKETING_BENEFITS: {
  schemaVersion: string;
  appId: 'beautymarketing';
  contentType: 'video';
  templateId: 'benefits_list';
  content: BenefitsListContent;
} = {
  schemaVersion: '1.0.0',
  appId: 'beautymarketing',
  contentType: 'video',
  templateId: 'benefits_list',
  content: {
    title: 'O PODER DO SEU AUTOCUIDADO',
    context: 'Estética & Bem-Estar',
    benefits: [
      {
        title: 'Revitalização da Pele',
        description: 'Hidratação profunda que devolve o viço e a luminosidade natural.',
        icon: 'spark',
      },
      {
        title: 'Elevação da Autoestima',
        description: 'Momentos dedicados a você fortalecem sua confiança diária.',
        icon: 'diamond',
      },
      {
        title: 'Prevenção e Longevidade',
        description: 'Protocolos modernos protegem sua beleza ao longo do tempo.',
        icon: 'target',
      },
    ],
    summary: 'Cuidar de si é um investimento na sua melhor versão todos os dias.',
    callToAction: 'VALORIZE SUA BELEZA HOJE',
  },
};

export const SAMPLE_COACHMARKETING_STEPS: {
  schemaVersion: string;
  appId: 'coachmarketing';
  contentType: 'video';
  templateId: 'step_by_step';
  content: StepByStepContent;
} = {
  schemaVersion: '1.0.0',
  appId: 'coachmarketing',
  contentType: 'video',
  templateId: 'step_by_step',
  content: {
    title: 'COMO ALCANÇAR SUAS METAS',
    subtitle: 'Método de Aceleração Executiva',
    steps: [
      {
        stepNumber: '01',
        title: 'Clareza de Objetivo',
        description: 'Defina exatamente onde quer chegar com métricas concretas.',
        dateOrPhase: 'Fase 1',
      },
      {
        stepNumber: '02',
        title: 'Plano de Ação Semanal',
        description: 'Divida o grande objetivo em blocos executáveis sem dispersão.',
        dateOrPhase: 'Fase 2',
      },
      {
        stepNumber: '03',
        title: 'Revisão e Ajuste Contínuo',
        description: 'Monitore métricas semanalmente para calibrar o foco e os ganhos.',
        dateOrPhase: 'Fase 3',
      },
    ],
    conclusion: 'A estratégia certa elimina o esforço inútil e acelera os resultados.',
    callToAction: 'ACELERE SUA PERFORMANCE AGORA',
  },
};

export const SAMPLE_FISIOMARKETING_SERVICE: {
  schemaVersion: string;
  appId: 'fisiomarketing';
  contentType: 'video';
  templateId: 'service_presentation';
  content: ServicePresentationContent;
} = {
  schemaVersion: '1.0.0',
  appId: 'fisiomarketing',
  contentType: 'video',
  templateId: 'service_presentation',
  content: {
    brandHeadline: 'FISIOTERAPIA & MOVIMENTO',
    serviceTitle: 'REABILITAÇÃO MOTORA AVANÇADA',
    serviceCategory: 'Alívio de Dor e Recuperação Funcional',
    scheduleOrMethod: 'AVALIAÇÃO POSTURAL BIOMECÂNICA',
    processSummary: 'Tratamentos guiados por evidência clínica para recuperar sua mobilidade.',
    features: [
      {
        title: 'Diagnóstico de Causa Real',
        description: 'Identificação precisa da origem da dor articular ou muscular.',
      },
      {
        title: 'Protocolos Personalizados',
        description: 'Exercícios terapêuticos adaptados ao seu ritmo e rotina.',
      },
      {
        title: 'Acompanhamento Próximo',
        description: 'Monitoramento contínuo da sua evolução motora a cada sessão.',
      },
    ],
    commercialPricing: {
      label: 'PLANO MENSAL DE TRATAMENTO',
      value: 'R$ 240,00',
      unit: '/ mês',
      disclaimer: 'Sem taxa de adesão • Sessões agendadas conforme avaliação clínica',
    },
    contact: {
      phone: '(31) 98765-4321',
      cta: 'AGENDE SUA AVALIAÇÃO INICIAL',
      guaranteeBadge: 'ATENDIMENTO HUMANIZADO COM FISIOTERAPEUTAS ESPECIALISTAS',
    },
  },
};
