import {makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {fadeOut, fadeUp} from '../animations/transitions';
import {Timeline} from '../components/timeline';

export default makeScene2D(function* (view) {
  const bg = createRef<Rect>();
  const testLabel = createRef<Txt>();

  view.add(<Rect ref={bg} width={1080} height={1920} fill="#F2EBDD" />);
  view.add(
    <Txt
      ref={testLabel}
      text=""
      x={0}
      y={-720}
      fontSize={22}
      fontFamily="Arial"
      fontWeight={700}
      letterSpacing={2}
      fill="#777064"
      opacity={0}
    />,
  );

  // ==========================================
  // TESTE 1: 4 EVENTOS — MARCOS EM SEQUÊNCIA (CORE DEMO)
  // ==========================================
  testLabel().text('TESTE 1 / 4 EVENTOS / HORIZONTAL (MARCOS EM SEQUÊNCIA)');
  yield* fadeUp(testLabel(), {distance: 8, duration: 0.3});

  const timeline4 = Timeline({
    width: 960,
    y: 0,
    component: 'timeline',
    variant: 'horizontal_timeline',
    title: 'Marcos em sequência',
    subtitle: 'Cada faixa organiza dois eventos para preservar a leitura vertical.',
    events: [
      {
        id: 'e1',
        date: '1950',
        number: '01',
        title: 'Primeiros estudos',
        description: 'Pesquisadores começam a explorar como máquinas podem simular aspectos da inteligência.',
        icon: 'spark',
      },
      {
        id: 'e2',
        date: '1997',
        number: '02',
        title: 'Um marco nos jogos',
        description: 'Um sistema de computador vence o campeão mundial de xadrez em uma partida histórica.',
        icon: 'diamond',
      },
      {
        id: 'e3',
        date: '2012',
        number: '03',
        title: 'Avanço do aprendizado profundo',
        description: 'Redes neurais ganham destaque em tarefas de reconhecimento visual.',
        icon: 'arrow',
      },
      {
        id: 'e4',
        date: '2022',
        number: '04',
        title: 'IA generativa em evidência',
        description: 'Ferramentas generativas passam a ser conhecidas por um público mais amplo.',
        icon: 'dot',
        highlight: true,
      },
    ],
    direction: 'left_to_right',
    markerStyle: 'circle',
    duration: 0.5,
    stagger: 0.1,
  });

  view.add(timeline4.node);
  yield* timeline4.play();
  yield* waitFor(1.5);
  yield* all(timeline4.exit(0.35), fadeOut(testLabel(), {duration: 0.3}));
  yield* waitFor(0.1);

  // ==========================================
  // TESTE 2: 2 EVENTOS — TÍTULOS CURTOS
  // ==========================================
  testLabel().text('TESTE 2 / 2 EVENTOS / TÍTULOS CURTOS');
  yield* fadeUp(testLabel(), {distance: 8, duration: 0.3});

  const timeline2 = Timeline({
    width: 960,
    y: 0,
    component: 'timeline',
    variant: 'horizontal_timeline',
    title: 'Ciclo Rápido',
    subtitle: 'Demonstração de layout horizontal com dois marcos.',
    events: [
      {
        id: 'c1',
        date: 'FASE 1',
        number: '01',
        title: 'Concepção',
        description: 'Planejamento e alinhamento dos objetivos centrais.',
        icon: 'spark',
      },
      {
        id: 'c2',
        date: 'FASE 2',
        number: '02',
        title: 'Lançamento',
        description: 'Disponibilização da versão estável para os usuários.',
        icon: 'arrow',
        highlight: true,
      },
    ],
    direction: 'left_to_right',
    markerStyle: 'circle',
    duration: 0.45,
    stagger: 0.1,
  });

  view.add(timeline2.node);
  yield* timeline2.play();
  yield* waitFor(1.2);
  yield* all(timeline2.exit(0.35), fadeOut(testLabel(), {duration: 0.3}));
  yield* waitFor(0.1);

  // ==========================================
  // TESTE 3: 3 EVENTOS — TÍTULOS LONGOS E MÚLTIPLAS LINHAS
  // ==========================================
  testLabel().text('TESTE 3 / 3 EVENTOS / TEXTOS EXTENSOS');
  yield* fadeUp(testLabel(), {distance: 8, duration: 0.3});

  const timeline3 = Timeline({
    width: 960,
    y: 0,
    component: 'timeline',
    variant: 'horizontal_timeline',
    title: 'Transformação Contínua',
    subtitle: 'Validação com títulos extensos e descrições com múltiplas linhas.',
    events: [
      {
        id: 't1',
        date: '2020',
        number: '01',
        title: 'Fundação e Estruturação Estratégica Inicial',
        description: 'Pesquisa detalhada de mercado com mapeamento de oportunidades e requisitos essenciais para a arquitetura.',
        icon: 'spark',
      },
      {
        id: 't2',
        date: '2022',
        number: '02',
        title: 'Expansão Acelerada da Capacidade Técnica',
        description: 'Desenvolvimento das ferramentas nucleares com otimização contínua de performance e renderização gráfica.',
        icon: 'arrow',
      },
      {
        id: 't3',
        date: '2024',
        number: '03',
        title: 'Consolidação e Integração em Escala Global',
        description: 'Adoção generalizada com fluxos automatizados, alta confiabilidade e suporte completo a múltiplos formatos visuais.',
        icon: 'diamond',
        highlight: true,
      },
    ],
    direction: 'left_to_right',
    markerStyle: 'diamond',
    duration: 0.45,
    stagger: 0.1,
  });

  view.add(timeline3.node);
  yield* timeline3.play();
  yield* waitFor(1.2);
  yield* all(timeline3.exit(0.35), fadeOut(testLabel(), {duration: 0.3}));
  yield* waitFor(0.1);

  // ==========================================
  // TESTE 4: 5 EVENTOS — DIREÇÃO RIGHT TO LEFT
  // ==========================================
  testLabel().text('TESTE 4 / 5 EVENTOS / RIGHT TO LEFT');
  yield* fadeUp(testLabel(), {distance: 8, duration: 0.3});

  const timeline5 = Timeline({
    width: 960,
    y: 0,
    component: 'timeline',
    variant: 'horizontal_timeline',
    title: 'Jornada em Cinco Marcos',
    subtitle: 'Distribuição serpentina com 5 eventos da direita para a esquerda.',
    events: [
      {id: 'm1', date: 'ETAPA 1', number: '01', title: 'Descoberta', description: 'Levantamento de necessidades e análise prévia.', icon: 'spark'},
      {id: 'm2', date: 'ETAPA 2', number: '02', title: 'Definição', description: 'Estruturação do escopo e diretrizes visuais.', icon: 'arrow'},
      {id: 'm3', date: 'ETAPA 3', number: '03', title: 'Criação', description: 'Construção dos módulos e animações fundamentais.', icon: 'dot'},
      {id: 'm4', date: 'ETAPA 4', number: '04', title: 'Validação', description: 'Testes de integração e revisão de qualidade.', icon: 'diamond'},
      {id: 'm5', date: 'ETAPA 5', number: '05', title: 'Publicação', description: 'Entrega final com rendering otimizado.', icon: 'spark', highlight: true},
    ],
    direction: 'right_to_left',
    markerStyle: 'circle',
    duration: 0.4,
    stagger: 0.08,
  });

  view.add(timeline5.node);
  yield* timeline5.play();
  yield* waitFor(1.2);
  yield* all(timeline5.exit(0.35), fadeOut(testLabel(), {duration: 0.3}));
  yield* waitFor(0.1);

  // ==========================================
  // TESTE 5: 6 EVENTOS — NÚMEROS 1 A 6 E CAPACIDADE MÁXIMA
  // ==========================================
  testLabel().text('TESTE 5 / 6 EVENTOS / DÍGITOS 1 A 6');
  yield* fadeUp(testLabel(), {distance: 8, duration: 0.3});

  const timeline6 = Timeline({
    width: 960,
    y: 0,
    component: 'timeline',
    variant: 'horizontal_timeline',
    title: 'Capacidade Máxima (6 Marcos)',
    subtitle: 'Teste de 3 faixas completas com numeração de dígito único 1 a 6.',
    events: [
      {id: 's1', date: 'PASSO 1', number: '1', title: 'Iniciação', description: 'Briefing e premissas técnicas.', icon: 'dot'},
      {id: 's2', date: 'PASSO 2', number: '2', title: 'Arquitetura', description: 'Estruturação dos componentes.', icon: 'dot'},
      {id: 's3', date: 'PASSO 3', number: '3', title: 'Design', description: 'Direção de arte e estilo visual.', icon: 'dot'},
      {id: 's4', date: 'PASSO 4', number: '4', title: 'Motion', description: 'Configuração de curvas e timing.', icon: 'dot'},
      {id: 's5', date: 'PASSO 5', number: '5', title: 'Refino', description: 'Ajuste fino de conectores e texto.', icon: 'dot'},
      {id: 's6', date: 'PASSO 6', number: '6', title: 'Finalização', description: 'Renderização em alta resolução.', icon: 'spark', highlight: true},
    ],
    direction: 'left_to_right',
    markerStyle: 'circle',
    duration: 0.35,
    stagger: 0.06,
  });

  view.add(timeline6.node);
  yield* timeline6.play();
  yield* waitFor(1.2);
  yield* all(timeline6.exit(0.35), fadeOut(testLabel(), {duration: 0.3}));
  yield* waitFor(0.1);

  // ==========================================
  // TESTE 6: VERTICAL TIMELINE (4 EVENTOS)
  // ==========================================
  testLabel().text('TESTE 6 / VERTICAL TIMELINE / 4 EVENTOS');
  yield* fadeUp(testLabel(), {distance: 8, duration: 0.3});

  const timelineVertical = Timeline({
    width: 960,
    y: 0,
    component: 'timeline',
    variant: 'vertical_timeline',
    title: 'Eixo Vertical',
    subtitle: 'Validação de compatibilidade da variante vertical.',
    events: [
      {id: 'v1', date: '1950', number: '01', title: 'Primeiros estudos', description: 'Simulação inicial de processos cognitivos.', icon: 'spark'},
      {id: 'v2', date: '1997', number: '02', title: 'Superação nos jogos', description: 'Computadores vencem campeões de xadrez.', icon: 'diamond'},
      {id: 'v3', date: '2012', number: '03', title: 'Deep Learning', description: 'Reconhecimento avançado de padrões.', icon: 'arrow'},
      {id: 'v4', date: '2022', number: '04', title: 'Era Generativa', description: 'Criação multimodal em tempo real.', icon: 'dot', highlight: true},
    ],
    duration: 0.45,
    stagger: 0.08,
  });

  view.add(timelineVertical.node);
  yield* timelineVertical.play();
  yield* waitFor(1.2);
  yield* all(timelineVertical.exit(0.35), fadeOut(testLabel(), {duration: 0.3}));
  yield* waitFor(0.1);

  // ==========================================
  // TESTE 7: MILESTONE CARDS (4 EVENTOS)
  // ==========================================
  testLabel().text('TESTE 7 / MILESTONE CARDS / 4 EVENTOS');
  yield* fadeUp(testLabel(), {distance: 8, duration: 0.3});

  const timelineCards = Timeline({
    width: 960,
    y: 0,
    component: 'timeline',
    variant: 'milestone_cards',
    title: 'Cartões de Destaque',
    subtitle: 'Validação da variante com painéis e cards editoriais.',
    events: [
      {id: 'mc1', date: 'FASE 01', number: '01', title: 'Descoberta', description: 'Mapeamento de referências e briefing.', icon: 'spark'},
      {id: 'mc2', date: 'FASE 02', number: '02', title: 'Desenho', description: 'Prototipação de telas e identidade.', icon: 'arrow'},
      {id: 'mc3', date: 'FASE 03', number: '03', title: 'Execução', description: 'Implementação de motion e código.', icon: 'diamond'},
      {id: 'mc4', date: 'FASE 04', number: '04', title: 'Entrega', description: 'Exportação em padrão broadcast.', icon: 'dot', highlight: true},
    ],
    duration: 0.45,
    stagger: 0.08,
  });

  view.add(timelineCards.node);
  yield* timelineCards.play();
  yield* waitFor(1.2);
  yield* all(timelineCards.exit(0.35), fadeOut(testLabel(), {duration: 0.3}));
  yield* waitFor(0.1);

  // ==========================================
  // TESTE 8: PROCESS STEPS (5 EVENTOS)
  // ==========================================
  testLabel().text('TESTE 8 / PROCESS STEPS / 5 ETAPAS');
  yield* fadeUp(testLabel(), {distance: 8, duration: 0.3});

  const timelineSteps = Timeline({
    width: 960,
    y: 0,
    component: 'timeline',
    variant: 'process_steps',
    title: 'Fluxo em Etapas',
    subtitle: 'Validação com barra de progresso dinâmica contínua.',
    events: [
      {id: 'ps1', date: 'ETAPA 01', number: '01', title: 'Alinhamento', description: 'Definição dos objetivos do projeto.', icon: 'dot'},
      {id: 'ps2', date: 'ETAPA 02', number: '02', title: 'Pesquisa', description: 'Coleta de dados e referências.', icon: 'dot'},
      {id: 'ps3', date: 'ETAPA 03', number: '03', title: 'Layout', description: 'Estruturação dos elementos visuais.', icon: 'dot'},
      {id: 'ps4', date: 'ETAPA 04', number: '04', title: 'Animação', description: 'Aplicação de física e interpolação.', icon: 'dot'},
      {id: 'ps5', date: 'ETAPA 05', number: '05', title: 'Entrega', description: 'Exportação com fidelidade gráfica.', icon: 'dot', highlight: true},
    ],
    duration: 0.4,
    stagger: 0.06,
  });

  view.add(timelineSteps.node);
  yield* timelineSteps.play();
  yield* waitFor(1.5);
  yield* all(timelineSteps.exit(0.35), fadeOut(testLabel(), {duration: 0.3}));
  yield* waitFor(0.5);
});
