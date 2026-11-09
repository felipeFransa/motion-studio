import {
  Camera,
  Circle,
  Layout,
  Line,
  makeScene2D,
  Rect,
  Txt,
} from '@motion-canvas/2d';
import {
  all,
  chain,
  createRef,
  createSignal,
  easeInOutCubic,
  easeInOutSine,
  easeOutCubic,
  sequence,
  type ThreadGenerator,
  waitFor,
} from '@motion-canvas/core';
import {TECH_MOTION_TOKENS} from '../theme/tech-motion';
import {
  createFloatingPanel,
  createTechBackground,
  createTechCamera,
  createUIMockup,
  focus_element,
  reset_camera,
  slow_zoom_in,
  slow_zoom_out,
  visualTextSelection,
} from '../components/tech';
import {KineticTitle} from '../components/kinetic-title';

export default makeScene2D(function* (view) {
  // Configuração de formato vertical 1080 × 1920
  view.fill(TECH_MOTION_TOKENS.colors.background);

  const camera = createTechCamera(0.96);

  // Background tecnológico determinístico (oversized para suportar movimentos de câmera)
  const bg = createTechBackground({
    tokens: TECH_MOTION_TOKENS,
    width: 2400,
    height: 3400,
    density: 10,
    opacity: 0.18,
    speed: 0.8,
    motionIntensity: 0.45,
    elementCount: 24,
    glow: true,
    seed: 42,
  });

  // Título Cinético da Cena 1
  const introTitle = KineticTitle({
    component: 'kinetic_title',
    variant: 'kinetic_impact',
    text: 'MOTION STUDIO',
    highlightWords: ['STUDIO'],
    fontSize: 78,
    fontWeight: 800,
    fontFamily: TECH_MOTION_TOKENS.typography.heading,
    color: TECH_MOTION_TOKENS.colors.textPrimary,
    highlightColor: TECH_MOTION_TOKENS.colors.accent,
    alignment: 'center',
    y: -40,
    maxWidth: 900,
    letterSpacing: 2,
    animation: {
      duration: 0.85,
      stagger: 0.12,
      distance: 30,
      easing: 'easeOutCubic',
    },
  });

  // Subtítulo da Cena 1
  const introSubtitle = new Txt({
    text: 'UM MOTOR. INFINITAS POSSIBILIDADES.',
    x: 0,
    y: 75,
    textWrap: false,
    textAlign: 'center',
    fontFamily: TECH_MOTION_TOKENS.typography.mono,
    fontSize: 20,
    fontWeight: 600,
    fill: TECH_MOTION_TOKENS.colors.accentSecondary,
    letterSpacing: 2.5,
    opacity: 0,
  });

  // Badge da Cena 1
  const introBadge = new Rect({
    layout: false,
    x: 0,
    y: -140,
    width: 240,
    height: 36,
    radius: TECH_MOTION_TOKENS.radii.full,
    fill: 'rgba(56, 189, 248, 0.08)',
    stroke: 'rgba(56, 189, 248, 0.35)',
    lineWidth: 1.5,
    opacity: 0,
  });
  introBadge.add(
    new Circle({
      x: -86,
      y: 0,
      size: 8,
      fill: TECH_MOTION_TOKENS.colors.accent,
    }),
  );
  introBadge.add(
    new Txt({
      text: 'TECH MOTION ENGINE',
      x: 10,
      y: 0,
      fontFamily: TECH_MOTION_TOKENS.typography.mono,
      fontSize: 12,
      fontWeight: 600,
      fill: TECH_MOTION_TOKENS.colors.textPrimary,
      letterSpacing: 2,
    }),
  );

  // -------------------------------------------------------------
  // Cena 2 & 3: 3 Interfaces / Painéis UI Mockup
  // -------------------------------------------------------------

  // Painel 1: Top-Left (Node Pipeline & Queue)
  const mockup1 = createUIMockup({
    title: 'PIPELINE CLUSTER',
    subtitle: 'NODE US-EAST-01',
    badge: 'ACTIVE',
    width: 580,
    height: 380,
    cards: [
      {label: 'THROUGHPUT', value: '4.8 GB/s', trend: '+12%'},
      {label: 'TEMPO MÉDIO', value: '0.84 s', trend: '-15%'},
    ],
    indicators: [
      {label: 'RENDER QUEUE', percentage: 64, valueText: '64/100', color: TECH_MOTION_TOKENS.colors.accent},
      {label: 'BUFFER CACHE', percentage: 42, valueText: '42%', color: TECH_MOTION_TOKENS.colors.accentSecondary},
    ],
    chartBars: [
      {label: 'A1', value: 40},
      {label: 'A2', value: 75},
      {label: 'A3', value: 90, highlighted: true},
      {label: 'A4', value: 60},
    ],
  });

  const panel1 = createFloatingPanel({
    x: -120,
    y: -460,
    width: 600,
    height: 400,
    depth: 3,
    children: [mockup1.node],
  });

  // Painel 2: Centro (Orquestrador Central / Analytics Principal)
  const mockup2 = createUIMockup({
    title: 'MOTION STUDIO CORE',
    subtitle: 'ORQUESTRAÇÃO EM TEMPO REAL',
    badge: 'ONLINE',
    width: 680,
    height: 460,
    cards: [
      {label: 'PROCESSAMENTO', value: '1.240 fps', trend: '+28.4%'},
      {label: 'RENDER LATENCY', value: '4.2 ms', trend: '-40.2%'},
    ],
    indicators: [
      {label: 'GPU WORKLOAD', percentage: 82, valueText: '82%', color: TECH_MOTION_TOKENS.colors.accent},
      {label: 'MEMORY POOL', percentage: 56, valueText: '56%', color: TECH_MOTION_TOKENS.colors.accentSecondary},
    ],
    chartBars: [
      {label: 'S1', value: 30},
      {label: 'S2', value: 55},
      {label: 'S3', value: 94, highlighted: true},
      {label: 'S4', value: 70},
      {label: 'S5', value: 85},
    ],
    actionButtonText: 'SINCRONIZAR ENGINE',
  });

  const panel2 = createFloatingPanel({
    x: 0,
    y: 40,
    width: 700,
    height: 480,
    depth: 1,
    children: [mockup2.node],
  });

  // Painel 3: Bottom-Right (Asset & Exporter Pipeline)
  const mockup3 = createUIMockup({
    title: 'ASSET COMPILER',
    subtitle: 'VÍDEO ENGINE V2.4',
    badge: 'READY',
    width: 580,
    height: 360,
    cards: [
      {label: 'VÍDEOS GERADOS', value: '10.420', trend: '+142%'},
      {label: 'DISPONIBILIDADE', value: '99.98%', trend: '+0.4%'},
    ],
    indicators: [
      {label: 'STORAGE I/O', percentage: 51, valueText: '51%', color: TECH_MOTION_TOKENS.colors.accent},
      {label: 'FFMPEG WORKERS', percentage: 75, valueText: '6/8', color: TECH_MOTION_TOKENS.colors.accentSecondary},
    ],
    chartBars: [
      {label: 'B1', value: 45},
      {label: 'B2', value: 65},
      {label: 'B3', value: 80},
      {label: 'B4', value: 95, highlighted: true},
    ],
  });

  const panel3 = createFloatingPanel({
    x: 120,
    y: 560,
    width: 600,
    height: 380,
    depth: 2,
    children: [mockup3.node],
  });

  // -------------------------------------------------------------
  // Cena 4: Painel Reorganizado + Tipografia de Transformação
  // -------------------------------------------------------------
  const transformationTitle = KineticTitle({
    component: 'kinetic_title',
    variant: 'editorial_reveal',
    text: 'CRIE. ANIME. PUBLIQUE.',
    highlightWords: ['ANIME.'],
    fontSize: 54,
    fontWeight: 800,
    fontFamily: TECH_MOTION_TOKENS.typography.heading,
    color: TECH_MOTION_TOKENS.colors.textPrimary,
    highlightColor: TECH_MOTION_TOKENS.colors.accent,
    alignment: 'center',
    y: -520,
    maxWidth: 960,
    letterSpacing: 3,
    animation: {
      duration: 0.8,
      stagger: 0.15,
      distance: 25,
      easing: 'easeOutCubic',
    },
  });

  // -------------------------------------------------------------
  // Cena 5: Encerramento
  // -------------------------------------------------------------
  const closingTitle = KineticTitle({
    component: 'kinetic_title',
    variant: 'kinetic_impact',
    text: 'MOTION STUDIO',
    highlightWords: ['STUDIO'],
    fontSize: 82,
    fontWeight: 800,
    fontFamily: TECH_MOTION_TOKENS.typography.heading,
    color: TECH_MOTION_TOKENS.colors.textPrimary,
    highlightColor: TECH_MOTION_TOKENS.colors.accent,
    alignment: 'center',
    y: -30,
    maxWidth: 960,
    letterSpacing: 3,
    animation: {
      duration: 0.8,
      stagger: 0.12,
      distance: 30,
      easing: 'easeOutCubic',
    },
  });

  const closingSubtitle = new Txt({
    text: 'CONTEÚDO VISUAL EM MOVIMENTO',
    x: 0,
    y: 70,
    fontFamily: TECH_MOTION_TOKENS.typography.mono,
    fontSize: 22,
    fontWeight: 600,
    fill: TECH_MOTION_TOKENS.colors.accentSecondary,
    letterSpacing: 3,
    opacity: 0,
  });

  const closingLine = new Line({
    points: [
      [-220, 115],
      [220, 115],
    ],
    stroke: TECH_MOTION_TOKENS.colors.accent,
    lineWidth: 2,
    opacity: 0,
  });

  // Overlay final de fade out
  const fadeOverlay = new Rect({
    layout: false,
    width: 1400,
    height: 2200,
    fill: TECH_MOTION_TOKENS.colors.background,
    opacity: 0,
  });

  // Montagem da cena no DOM do Motion Canvas usando TechCamera Virtual Stage
  view.add(camera.stage);

  camera.stage.add(bg.node);

  {/* Camada Cena 1 */}
  camera.stage.add(introBadge);
  camera.stage.add(introTitle.node);
  camera.stage.add(introSubtitle);

  {/* Camada Cenas 2, 3, 4: Painéis de Interface */}
  camera.stage.add(panel1.node);
  camera.stage.add(panel2.node);
  camera.stage.add(panel3.node);

  {/* Camada Cena 4: Título de Transformação */}
  camera.stage.add(transformationTitle.node);

  {/* Camada Cena 5: Encerramento */}
  camera.stage.add(closingTitle.node);
  camera.stage.add(closingSubtitle);
  camera.stage.add(closingLine);

  {/* Overlay final */}
  camera.stage.add(fadeOverlay);

  // Inicia animação de fundo em paralelo por toda a duração do vídeo (24s)
  yield bg.play(24);

  // =============================================================
  // CENA 1 — Abertura (0s - 4s, 4 segundos)
  // =============================================================
  // Inicialização da câmera
  camera.zoom(0.96);

  // Entrada do Badge
  yield* all(
    introBadge.opacity(1, 0.5, easeOutCubic),
    introBadge.y(-130, 0.5, easeOutCubic),
  );

  // Entrada cinética do título MOTION STUDIO
  yield* introTitle.play();

  // Entrada do subtítulo com fade e deslocamento sutil
  yield* all(
    introSubtitle.opacity(1, 0.6, easeOutCubic),
    introSubtitle.y(60, 0.6, easeOutCubic),
    slow_zoom_in(camera, {factor: 1.05, duration: 1.6, timing: easeInOutSine}),
  );

  yield* waitFor(0.5);

  // Saída da Cena 1
  yield* all(
    introBadge.opacity(0, 0.45, easeInOutCubic),
    introTitle.exit(0.45),
    introSubtitle.opacity(0, 0.45, easeInOutCubic),
    slow_zoom_out(camera, {targetZoom: 0.94, duration: 0.5, timing: easeInOutSine}),
  );

  // =============================================================
  // CENA 2 — Interfaces (4s - 9s, 5 segundos)
  // =============================================================
  // Os três painéis entram sequencialmente com deslocamento e profundidade
  yield* sequence(
    0.22,
    panel1.enter(0.7, 50),
    panel2.enter(0.75, 60),
    panel3.enter(0.7, 50),
  );

  // Mockups ativam seus indicadores internos
  yield* all(
    mockup1.enter(0.6),
    mockup2.enter(0.6),
    mockup3.enter(0.6),
  );

  // Câmera aproxima suavemente do painel central principal (Panel 2)
  yield* all(
    focus_element(camera, panel2.node, {
      zoom: 1.28,
      offset: [0, 15],
      duration: 1.6,
      timing: easeInOutCubic,
    }),
    panel2.floatDrift(1.6, 6, 2.0),
  );

  yield* waitFor(0.3);

  // =============================================================
  // CENA 3 — Dashboard (9s - 14s, 5 segundos)
  // =============================================================
  // Animação suave dos valores e barras de progresso
  yield* all(
    mockup2.animateMetrics(1.4),
    slow_zoom_in(camera, {factor: 1.06, duration: 2.2, timing: easeInOutSine}),
    panel2.floatDrift(2.2, 5, 2.2),
  );

  // Glide sutil de câmera para revelar detalhes da interface
  yield* all(
    camera.position([40, panel2.node.y() + 20], 1.5, easeInOutSine) as ThreadGenerator,
    waitFor(1.4),
  );

  // =============================================================
  // CENA 4 — Transformação Visual (14s - 19s, 5 segundos)
  // =============================================================
  // Câmera se afasta e centraliza
  yield* all(
    camera.zoom(0.96, 1.4, easeInOutCubic) as ThreadGenerator,
    camera.position([0, 0], 1.4, easeInOutCubic) as ThreadGenerator,
    // Os painéis se reorganizam em uma composição central harmoniosa
    panel1.node.y(-220, 1.2, easeInOutCubic),
    panel1.node.x(-160, 1.2, easeInOutCubic),
    panel1.node.scale(0.85, 1.2, easeInOutCubic),
    panel1.node.opacity(0.65, 1.2, easeInOutCubic),

    panel2.node.y(160, 1.2, easeInOutCubic),
    panel2.node.x(0, 1.2, easeInOutCubic),
    panel2.node.scale(0.92, 1.2, easeInOutCubic),
    panel2.node.opacity(0.95, 1.2, easeInOutCubic),

    panel3.node.y(520, 1.2, easeInOutCubic),
    panel3.node.x(160, 1.2, easeInOutCubic),
    panel3.node.scale(0.85, 1.2, easeInOutCubic),
    panel3.node.opacity(0.65, 1.2, easeInOutCubic),
  );

  // Tipografia de transformação surge no topo
  yield* transformationTitle.play();

  // Destaque na composição
  yield* waitFor(1.2);

  // Saída dos painéis e título de transformação
  yield* all(
    transformationTitle.exit(0.6),
    panel1.exit(0.6, -60),
    panel2.exit(0.6, 60),
    panel3.exit(0.6, 60),
    slow_zoom_in(camera, {factor: 1.04, duration: 0.8, timing: easeInOutSine}),
  );

  // =============================================================
  // CENA 5 — Encerramento (19s - 24s, 5 segundos)
  // =============================================================
  // Centraliza e prepara câmera para o fechamento
  camera.position([0, 0]);
  camera.zoom(1.0);

  // Entrada do título de encerramento
  yield* closingTitle.play();

  // Entrada de subtítulo e linha de destaque tecnológica
  yield* all(
    closingSubtitle.opacity(1, 0.6, easeOutCubic),
    closingSubtitle.y(60, 0.6, easeOutCubic),
    closingLine.opacity(0.8, 0.6, easeOutCubic),
    closingLine.points([[-160, 105], [160, 105]], 0.6, easeOutCubic),
    slow_zoom_out(camera, {factor: 0.95, duration: 2.2, timing: easeInOutSine}),
  );

  yield* waitFor(0.8);

  // Finalização suave com transição para o fundo Tech Motion
  yield* all(
    fadeOverlay.opacity(1, 1.0, easeInOutCubic),
    closingTitle.exit(0.8),
    closingSubtitle.opacity(0, 0.8, easeInOutCubic),
    closingLine.opacity(0, 0.8, easeInOutCubic),
  );

  yield* waitFor(0.2);
});
