import {Circle, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, loop, waitFor} from '@motion-canvas/core';
import {easeInOutSine} from '../animations/easing';
import {fadeOut, fadeUp, scaleIn} from '../animations/transitions';
import {
  FeatureCards,
  type FeatureCardsInstance,
  type FeatureCardsOptions,
} from '../components/feature-cards';
import {
  Timeline,
  type TimelineInstance,
  type TimelineOptions,
} from '../components/timeline';
import {NumberedCircle} from '../components/numbered-circle';

interface FeatureDemo {
  label: string;
  config: FeatureCardsOptions;
}

interface TimelineDemo {
  label: string;
  config: TimelineOptions;
}

const cards = [
  {
    id: 'speed',
    number: '01',
    title: 'Mais velocidade',
    description: 'Reduza tarefas repetitivas e ganhe tempo para o que exige atenção.',
    icon: 'arrow',
    accentColor: '#F26A38',
  },
  {
    id: 'accuracy',
    number: '02',
    title: 'Menos erros',
    description: 'Padronize etapas e mantenha informações mais consistentes.',
    icon: 'target',
    accentColor: '#D9563F',
  },
  {
    id: 'productivity',
    number: '03',
    title: 'Mais produtividade',
    description: 'Concentre o trabalho da equipe nas decisões importantes.',
    icon: 'spark',
    accentColor: '#E9834D',
  },
  {
    id: 'visibility',
    number: '04',
    title: 'Mais clareza',
    description: 'Organize o fluxo para acompanhar cada etapa com facilidade.',
    icon: 'layers',
    accentColor: '#C66B43',
  },
] as const;

const demos: readonly FeatureDemo[] = [
  {
    label: '01  /  EDITORIAL STACK  /  CONTEÚDO DEMONSTRATIVO',
    config: {
      component: 'feature_cards',
      variant: 'editorial_stack',
      title: 'Vantagens da automação',
      subtitle: 'Exemplos ilustrativos, não são alegações estatísticas.',
      cards: cards.slice(0, 3),
      duration: 0.62,
      stagger: 0.2,
    },
  },
  {
    label: '02  /  FEATURE GRID  /  GRADE VISUAL',
    config: {
      component: 'feature_cards',
      variant: 'feature_grid',
      title: 'Recursos para trabalhar melhor',
      subtitle: 'Quatro possibilidades em uma composição modular.',
      cards,
      duration: 0.65,
      stagger: 0.18,
    },
  },
  {
    label: '03  /  SPOTLIGHT CARD  /  FOCO PRINCIPAL',
    config: {
      component: 'feature_cards',
      variant: 'spotlight_card',
      title: 'Uma ideia em primeiro plano',
      subtitle: 'A característica principal recebe mais espaço.',
      cards: [
        {...cards[0], highlight: true},
        cards[1],
        cards[2],
      ],
      duration: 0.8,
      stagger: 0.2,
    },
  },
  {
    label: '04  /  SEQUENTIAL REVEAL  /  ENTRADA SINCRONIZÁVEL',
    config: {
      component: 'feature_cards',
      variant: 'sequential_reveal',
      title: 'Uma sequência de benefícios',
      subtitle: 'A entrada individual permite acompanhar cada ponto.',
      cards: [
        {...cards[0], animationDelay: 0},
        {...cards[1], animationDelay: 0.15},
        {...cards[2], animationDelay: 0.3},
      ],
      duration: 0.62,
      stagger: 0.22,
    },
  },
];

const timelineEvents = [
  {
    id: 'research',
    date: '1950',
    title: 'Primeiros estudos',
    description: 'Pesquisadores começam a explorar como máquinas podem simular aspectos da inteligência.',
    icon: 'spark',
  },
  {
    id: 'games',
    date: '1997',
    title: 'Um marco nos jogos',
    description: 'Um sistema de computador vence o campeão mundial de xadrez em uma partida histórica.',
    icon: 'diamond',
  },
  {
    id: 'learning',
    date: '2012',
    title: 'Avanço do aprendizado profundo',
    description: 'Redes neurais ganham destaque em tarefas de reconhecimento visual.',
    icon: 'arrow',
  },
  {
    id: 'generative',
    date: '2022',
    title: 'IA generativa em evidência',
    description: 'Ferramentas generativas passam a ser conhecidas por um público mais amplo.',
    icon: 'dot',
    highlight: true,
  },
] as const;

const timelineDemos: readonly TimelineDemo[] = [
  {
    label: '05  /  VERTICAL TIMELINE  /  CONTEÚDO DEMONSTRATIVO',
    config: {
      component: 'timeline',
      variant: 'vertical_timeline',
      title: 'Uma trajetória ilustrativa',
      subtitle: 'Marcos selecionados para demonstrar o componente.',
      events: timelineEvents,
      dateFormat: 'year',
      highlightEventId: 'generative',
      duration: 0.62,
      stagger: 0.15,
    },
  },
  {
    label: '06  /  HORIZONTAL TIMELINE  /  EIXO RESPONSIVO',
    config: {
      component: 'timeline',
      variant: 'horizontal_timeline',
      title: 'Marcos em sequência',
      subtitle: 'Cada faixa organiza dois eventos para preservar a leitura vertical.',
      events: timelineEvents,
      direction: 'right_to_left',
      markerStyle: 'diamond',
      duration: 0.58,
      stagger: 0.12,
    },
  },
  {
    label: '07  /  MILESTONE CARDS  /  DESTAQUE EDITORIAL',
    config: {
      component: 'timeline',
      variant: 'milestone_cards',
      title: 'Momentos de transformação',
      subtitle: 'Exemplos ilustrativos, não uma cronologia completa.',
      events: timelineEvents,
      highlightEventId: 'learning',
      duration: 0.68,
      stagger: 0.17,
    },
  },
  {
    label: '08  /  PROCESS STEPS  /  PROGRESSO POR ETAPAS',
    config: {
      component: 'timeline',
      variant: 'process_steps',
      title: 'Etapas de um projeto',
      subtitle: 'Fluxo demonstrativo com avanço sequencial.',
      direction: 'top_to_bottom',
      events: [
        {id: 'scope', date: 'ETAPA 01', title: 'Definir o escopo', description: 'Alinhar objetivo, público e resultado esperado.'},
        {id: 'research-step', date: 'ETAPA 02', title: 'Pesquisar', description: 'Reunir referências e informações relevantes.'},
        {id: 'design', date: 'ETAPA 03', title: 'Desenhar a solução', description: 'Organizar conteúdo e direção visual.'},
        {id: 'review', date: 'ETAPA 04', title: 'Revisar', description: 'Validar os detalhes antes de finalizar.'},
        {id: 'deliver', date: 'ETAPA 05', title: 'Entregar', description: 'Preparar os arquivos finais para publicação.'},
      ],
      duration: 0.55,
      stagger: 0.12,
    },
  },
];

export default makeScene2D(function* (view) {
  const label = createRef<Txt>();
  const signature = createRef<Txt>();
  const accent = createRef<Circle>();
  const orbit = createRef<Circle>();
  const rule = createRef<Rect>();
  const numberedCircleSurface = createRef<Rect>();

  view.add(<Rect width={1080} height={1920} fill="#F2EBDD" />);
  view.add(<Circle ref={accent} x={430} y={-760} size={112} fill="#F26A38" opacity={0} />);
  view.add(
    <Circle ref={orbit} x={430} y={-760} size={154} stroke="#F26A38" lineWidth={2} opacity={0} />,
  );
  view.add(
    <Txt
      ref={label}
      text=""
      x={0}
      y={-590}
      fontSize={22}
      fontFamily="Arial"
      fontWeight={700}
      letterSpacing={2}
      fill="#777064"
      opacity={0}
    />,
  );
  view.add(
    <Rect ref={rule} x={0} y={-542} width={92} height={4} radius={2} fill="#F26A38" opacity={0} />,
  );
  view.add(
    <Txt
      ref={signature}
      text="MOTION STUDIO  /  COMPONENT LIBRARY"
      x={0}
      y={800}
      fontSize={19}
      fontFamily="Arial"
      fontWeight={700}
      letterSpacing={3}
      fill="#777064"
      opacity={0}
    />,
  );

  const instances: Array<{instance: FeatureCardsInstance; demo: FeatureDemo}> = [];
  for (const demo of demos) {
    const instance = FeatureCards({
      maxWidth: 900,
      y: 30,
      ...demo.config,
    });
    view.add(instance.node);
    instances.push({instance, demo});
  }
  const timelineInstances: Array<{instance: TimelineInstance; demo: TimelineDemo}> = [];
  for (const demo of timelineDemos) {
    const instance = Timeline({
      width: 960,
      y: 50,
      ...demo.config,
    });
    view.add(instance.node);
    timelineInstances.push({instance, demo});
  }
  const numberedCircleSamples = [
    {number: '1', size: 52, x: -330},
    {number: '01', size: 62, x: -110},
    {number: '10', size: 72, x: 110},
    {number: '100', size: 82, x: 330},
  ].map(({number, size, x}) =>
    NumberedCircle({
      number,
      size,
      circleColor: '#FFFDF8',
      textColor: '#F26A38',
      fontSize: 18,
      fontWeight: 800,
      strokeColor: '#F26A38',
      strokeWidth: 3,
      x,
      y: 8,
    }),
  );
  const numberedCircleLabels = [
    {text: '1', x: -330, size: 52},
    {text: '01', x: -110, size: 62},
    {text: '10', x: 110, size: 72},
    {text: '100', x: 330, size: 82},
  ].map(({text, x, size}) => new Txt({
    text: `${text}  /  ${size}px`,
    x,
    y: 92,
    fontSize: 20,
    fontFamily: 'Arial',
    fontWeight: 700,
    fill: '#777064',
    opacity: 0,
  }));
  view.add(
    <Rect
      ref={numberedCircleSurface}
      width={900}
      height={400}
      y={45}
      radius={32}
      fill="#FFFDF8"
      stroke="#E8E0D3"
      lineWidth={1}
      shadowColor="#19191920"
      shadowBlur={24}
      shadowOffsetY={12}
      opacity={0}
    />,
  );
  for (const sample of numberedCircleSamples) {
    sample.node.opacity(0);
    view.add(sample.node);
  }
  for (const sampleLabel of numberedCircleLabels) view.add(sampleLabel);

  yield* all(
    fadeUp(signature(), {distance: 10, duration: 0.42}),
    fadeUp(accent(), {distance: 8, duration: 0.48}),
    fadeUp(orbit(), {distance: 8, duration: 0.48}),
  );

  for (const {instance, demo} of instances) {
    label().text(demo.label);
    yield* all(
      fadeUp(label(), {distance: 14, duration: 0.42}),
      fadeUp(rule(), {distance: 8, duration: 0.38, delay: 0.08}),
      instance.play(),
      loop(1, function* () {
        yield* all(
          accent().y(-770, 0.6, easeInOutSine),
          orbit().y(-770, 0.6, easeInOutSine),
        );
        yield* all(
          accent().y(-750, 0.6, easeInOutSine),
          orbit().y(-750, 0.6, easeInOutSine),
        );
      }),
    );
    yield* waitFor(0.75);
    yield* all(
      instance.exit(0.38),
      fadeOut(label(), {duration: 0.32, easing: 'easeInOutSine'}),
      fadeOut(rule(), {duration: 0.32, easing: 'easeInOutSine'}),
    );
    yield* waitFor(0.18);
  }

  for (const {instance, demo} of timelineInstances) {
    label().text(demo.label);
    yield* all(
      fadeUp(label(), {distance: 14, duration: 0.42}),
      fadeUp(rule(), {distance: 8, duration: 0.38, delay: 0.08}),
      instance.play(),
      loop(1, function* () {
        yield* all(
          accent().y(-770, 0.6, easeInOutSine),
          orbit().y(-770, 0.6, easeInOutSine),
        );
        yield* all(
          accent().y(-750, 0.6, easeInOutSine),
          orbit().y(-750, 0.6, easeInOutSine),
        );
      }),
    );
    yield* waitFor(1.5);
    yield* all(
      instance.exit(0.38),
      fadeOut(label(), {duration: 0.32, easing: 'easeInOutSine'}),
      fadeOut(rule(), {duration: 0.32, easing: 'easeInOutSine'}),
    );
    yield* waitFor(0.18);
  }

  label().text('09  /  NUMBERED CIRCLE  /  ALINHAMENTO E ESCALA');
  yield* all(
    fadeUp(label(), {distance: 14, duration: 0.42}),
    fadeUp(rule(), {distance: 8, duration: 0.38, delay: 0.08}),
    scaleIn(numberedCircleSurface(), {duration: 0.55, scale: 0.98}),
    ...numberedCircleSamples.map((sample) =>
      scaleIn(sample.node, {duration: 0.7, scale: 0.65}),
    ),
    ...numberedCircleLabels.map((sampleLabel, index) =>
      fadeUp(sampleLabel, {distance: 8, duration: 0.5, delay: index * 0.08}),
    ),
    loop(1, function* () {
      yield* all(
        accent().y(-770, 0.6, easeInOutSine),
        orbit().y(-770, 0.6, easeInOutSine),
      );
      yield* all(
        accent().y(-750, 0.6, easeInOutSine),
        orbit().y(-750, 0.6, easeInOutSine),
      );
    }),
  );
  yield* waitFor(1.5);
  yield* all(
    fadeOut(numberedCircleSurface(), {duration: 0.38, easing: 'easeInOutSine'}),
    ...numberedCircleSamples.map((sample) =>
      fadeOut(sample.node, {duration: 0.38, easing: 'easeInOutSine'}),
    ),
    ...numberedCircleLabels.map((sampleLabel) =>
      fadeOut(sampleLabel, {duration: 0.32, easing: 'easeInOutSine'}),
    ),
    fadeOut(label(), {duration: 0.32, easing: 'easeInOutSine'}),
    fadeOut(rule(), {duration: 0.32, easing: 'easeInOutSine'}),
  );

  yield* all(
    fadeOut(signature(), {duration: 0.42, easing: 'easeInOutSine'}),
    fadeOut(accent(), {duration: 0.42, easing: 'easeInOutSine'}),
    fadeOut(orbit(), {duration: 0.42, easing: 'easeInOutSine'}),
  );
});
