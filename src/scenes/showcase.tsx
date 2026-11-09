import {Circle, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {fadeOut, fadeUp, scaleIn} from '../animations/transitions';
import {KineticTitle} from '../components/kinetic-title';
import {StatCard} from '../components/stat-card';
import {Comparison} from '../components/comparison';
import {FeatureCards} from '../components/feature-cards';
import {Timeline} from '../components/timeline';

export default makeScene2D(function* (view) {
  // Editorial background
  view.add(<Rect width={1080} height={1920} fill="#F2EBDD" />);

  // Editorial frame accents
  const topAccent = createRef<Circle>();
  const topOrbit = createRef<Circle>();
  const sceneBadge = createRef<Txt>();
  const badgeRule = createRef<Rect>();
  const footerSignature = createRef<Txt>();
  const footerRule = createRef<Rect>();

  view.add(
    <Circle
      ref={topAccent}
      x={430}
      y={-790}
      size={84}
      fill="#F26A38"
      opacity={0}
    />,
  );
  view.add(
    <Circle
      ref={topOrbit}
      x={430}
      y={-790}
      size={120}
      stroke="#F26A38"
      lineWidth={1.5}
      opacity={0}
    />,
  );

  // Top category badge
  view.add(
    <Txt
      ref={sceneBadge}
      text="01  /  ABERTURA"
      x={0}
      y={-640}
      fontSize={20}
      fontFamily="Arial"
      fontWeight={700}
      letterSpacing={3}
      fill="#777064"
      opacity={0}
    />,
  );
  view.add(
    <Rect
      ref={badgeRule}
      x={0}
      y={-605}
      width={72}
      height={3}
      radius={1.5}
      fill="#F26A38"
      opacity={0}
    />,
  );

  // Bottom footer signature
  view.add(
    <Rect
      ref={footerRule}
      x={0}
      y={785}
      width={120}
      height={2}
      radius={1}
      fill="#D8CBB7"
      opacity={0}
    />,
  );
  view.add(
    <Txt
      ref={footerSignature}
      text="MOTION STUDIO  /  EDITORIAL PREMIUM"
      x={0}
      y={825}
      fontSize={17}
      fontFamily="Arial"
      fontWeight={700}
      letterSpacing={3}
      fill="#777064"
      opacity={0}
    />,
  );

  // -------------------------------------------------------------
  // Component Instances
  // -------------------------------------------------------------

  // Scene 1: KineticTitle (0–4s)
  const titleInstance = KineticTitle({
    component: 'kinetic_title',
    variant: 'editorial_reveal',
    text: 'IDEIAS QUE SE TRANSFORMAM',
    highlightWords: ['TRANSFORMAM'],
    fontSize: 84,
    fontWeight: 900,
    fontFamily: 'Arial',
    color: '#191919',
    highlightColor: '#F26A38',
    alignment: 'center',
    maxWidth: 920,
    x: 0,
    y: 0,
    letterSpacing: 2,
    animation: {
      duration: 1.1,
      stagger: 0.12,
      distance: 36,
      easing: 'easeOutCubic',
      direction: 'up',
    },
  });
  view.add(titleInstance.node);

  // Scene 2: StatCard (4–8s)
  const statInstance = StatCard({
    component: 'stat_card',
    variant: 'counter_impact',
    value: 73,
    startValue: 0,
    suffix: '%',
    title: 'das pessoas preferem conteúdos visuais',
    description: 'A retenção e o engajamento aumentam quando a informação ganha movimento e clareza.',
    accentColor: '#F26A38',
    backgroundColor: '#191919',
    fontSize: 130,
    alignment: 'center',
    x: 0,
    y: 40,
    width: 900,
    height: 560,
    animation: {
      duration: 1.05,
      easing: 'easeOutCubic',
    },
  });
  view.add(statInstance.node);

  // Scene 3: Comparison (8–12s)
  const comparisonInstance = Comparison({
    component: 'comparison',
    variant: 'data_comparison',
    title: 'ANTES VS. DEPOIS',
    subtitle: 'Taxa de retenção e atenção do público',
    leftLabel: 'ESTÁTICO',
    leftTitle: 'Antes',
    leftDescription: 'Formato convencional com retenção moderada',
    leftValue: 30,
    leftColor: '#777064',
    rightLabel: 'COM MOTION',
    rightTitle: 'Depois',
    rightDescription: 'Experiência imersiva de alto engajamento',
    rightValue: 85,
    rightColor: '#F26A38',
    accentColor: '#D9563F',
    backgroundColor: '#FFFDF8',
    valueFormat: 'percent',
    suffix: '%',
    showDifference: true,
    highlightResult: 'higher',
    chartOrientation: 'vertical',
    alignment: 'center',
    x: 0,
    y: 40,
    width: 920,
    height: 680,
    duration: 0.55,
    easing: 'easeOutCubic',
  });
  view.add(comparisonInstance.node);

  // Scene 4: FeatureCards (12–16s)
  const featuresInstance = FeatureCards({
    component: 'feature_cards',
    variant: 'sequential_reveal',
    title: 'TUDO EM UM SÓ LUGAR',
    subtitle: 'Três pilares para uma produção visual marcante',
    cards: [
      {
        id: 'creativity',
        number: '01',
        title: 'Criatividade',
        description: 'Narrativas visuais dinâmicas que conectam a ideia ao espectador com originalidade.',
        icon: 'spark',
        accentColor: '#F26A38',
        animationDelay: 0,
      },
      {
        id: 'speed',
        number: '02',
        title: 'Velocidade',
        description: 'Estruturação ágil e produção consistente com componentes modulares reutilizáveis.',
        icon: 'arrow',
        accentColor: '#D9563F',
        animationDelay: 0.06,
      },
      {
        id: 'quality',
        number: '03',
        title: 'Qualidade',
        description: 'Design editorial refinado, equilíbrio tipográfico e acabamento premium em cada frame.',
        icon: 'diamond',
        accentColor: '#E9834D',
        highlight: true,
        animationDelay: 0.12,
      },
    ],
    maxWidth: 900,
    x: 0,
    y: 35,
    backgroundColor: '#FFFDF8',
    accentColor: '#F26A38',
    duration: 0.35,
    stagger: 0.1,
    easing: 'easeOutCubic',
  });
  view.add(featuresInstance.node);

  // Scene 5: Timeline (16–20s)
  const timelineInstance = Timeline({
    component: 'timeline',
    variant: 'process_steps',
    title: 'SEU CONTEÚDO. OUTRO NÍVEL.',
    subtitle: 'O fluxo de transformação da sua mensagem',
    events: [
      {
        id: 'concept',
        date: 'ETAPA 01',
        number: '01',
        title: 'Conceito & Roteiro',
        description: 'Estruturação clara da mensagem e definição do ritmo visual.',
        icon: 'spark',
        color: '#777064',
      },
      {
        id: 'motion',
        date: 'ETAPA 02',
        number: '02',
        title: 'Motion Design',
        description: 'Animação fluida com tipografia e cores da identidade editorial.',
        icon: 'arrow',
        color: '#D9563F',
      },
      {
        id: 'impact',
        date: 'ETAPA 03',
        number: '03',
        title: 'Impacto Visual',
        description: 'Resultado elegante e memorável para qualquer canal de distribuição.',
        icon: 'diamond',
        highlight: true,
        color: '#F26A38',
      },
    ],
    direction: 'top_to_bottom',
    markerStyle: 'circle',
    showNumbers: true,
    x: 0,
    y: 30,
    width: 920,
    height: 840,
    duration: 0.38,
    stagger: 0.08,
    backgroundColor: '#FFFDF8',
    accentColor: '#F26A38',
    easing: 'easeOutCubic',
  });
  view.add(timelineInstance.node);

  // -------------------------------------------------------------
  // ANIMATION TIMELINE (~20 SECONDS TOTAL: ~4s PER SCENE)
  // -------------------------------------------------------------

  // Initial layout elements entry + Scene 1
  yield* all(
    fadeUp(sceneBadge(), {distance: 14, duration: 0.45}),
    scaleIn(badgeRule(), {scale: 0.3, duration: 0.4}),
    fadeUp(footerRule(), {distance: 8, duration: 0.45}),
    fadeUp(footerSignature(), {distance: 10, duration: 0.5}),
    scaleIn(topAccent(), {scale: 0.5, duration: 0.55}),
    scaleIn(topOrbit(), {scale: 0.4, duration: 0.65}),
    titleInstance.play(),
  );

  // =============================================================
  // CENA 1: ABERTURA (0–4s)
  // KineticTitle: "IDEIAS QUE SE TRANSFORMAM"
  // =============================================================
  yield* waitFor(1.9);
  yield* titleInstance.exit(0.35);
  yield* waitFor(0.1);

  // =============================================================
  // CENA 2: ESTATÍSTICA (4–8s)
  // StatCard: "73%" + "das pessoas preferem conteúdos visuais"
  // =============================================================
  sceneBadge().text('02  /  ESTATÍSTICA');
  yield* statInstance.play();
  yield* waitFor(2.0);
  yield* statInstance.exit(0.35);
  yield* waitFor(0.1);

  // =============================================================
  // CENA 3: COMPARAÇÃO (8–12s)
  // Comparison: "ANTES VS. DEPOIS" (30% vs 85%, +55 p.p.)
  // =============================================================
  sceneBadge().text('03  /  COMPARAÇÃO');
  yield* comparisonInstance.play();
  yield* waitFor(1.8);
  yield* comparisonInstance.exit(0.35);
  yield* waitFor(0.1);

  // =============================================================
  // CENA 4: BENEFÍCIOS (12–16s)
  // FeatureCards: "TUDO EM UM SÓ LUGAR" (Criatividade, Velocidade, Qualidade)
  // =============================================================
  sceneBadge().text('04  /  BENEFÍCIOS');
  yield* featuresInstance.play();
  yield* waitFor(1.6);
  yield* featuresInstance.exit(0.35);
  yield* waitFor(0.1);

  // =============================================================
  // CENA 5: ENCERRAMENTO (16–20s)
  // Timeline: "SEU CONTEÚDO. OUTRO NÍVEL."
  // =============================================================
  sceneBadge().text('05  /  ENCERRAMENTO');
  yield* timelineInstance.play();
  yield* waitFor(2.0);

  // Elegant outro fade
  yield* all(
    timelineInstance.exit(0.5),
    fadeOut(sceneBadge(), {duration: 0.45}),
    fadeOut(badgeRule(), {duration: 0.45}),
    fadeOut(footerRule(), {duration: 0.45}),
    fadeOut(footerSignature(), {duration: 0.45}),
    fadeOut(topAccent(), {duration: 0.45}),
    fadeOut(topOrbit(), {duration: 0.45}),
  );
  yield* waitFor(0.3);
});
