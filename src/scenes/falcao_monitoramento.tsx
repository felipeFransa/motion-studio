import {Circle, Layout, Line, makeScene2D, Path, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, loop, waitFor} from '@motion-canvas/core';
import {easeInOutSine, easeOutCubic} from '../animations/easing';
import {fadeOut, fadeUp, scaleIn, slideInRight} from '../animations/transitions';
import {KineticTitle} from '../components/kinetic-title';
import {StatCard} from '../components/stat-card';

// =========================================================================
// HELPER: FALCON VECTOR EMBLEM
// Stylized original geometric falcon / nocturnal surveillance shield
// =========================================================================
function FalconEmblem({size = 120}: {size?: number}) {
  const scale = size / 120;
  return (
    <Layout width={size} height={size}>
      {/* Outer subtle shield glow */}
      <Circle size={size * 1.15} fill="#FF5A36" opacity={0.12} />
      <Circle size={size * 0.95} stroke="#FF5A36" lineWidth={2} opacity={0.35} />

      {/* Falcon Wings & Shield Geometry */}
      <Path
        data="M 0 -48 L 38 -20 L 32 18 L 0 52 L -32 18 L -38 -20 Z"
        fill="#0F1F3D"
        stroke="#FF5A36"
        lineWidth={3 * scale}
        scale={scale}
      />
      {/* Left Wing Facets */}
      <Path
        data="M 0 -44 L -30 -16 L -16 6 L 0 20 Z"
        fill="#FF5A36"
        opacity={0.85}
        scale={scale}
      />
      {/* Right Wing Facets */}
      <Path
        data="M 0 -44 L 30 -16 L 16 6 L 0 20 Z"
        fill="#FF7A59"
        scale={scale}
      />
      {/* Central Falcon Beak / Crest */}
      <Path
        data="M 0 -36 L 8 -12 L 0 4 L -8 -12 Z"
        fill="#FFFFFF"
        scale={scale}
      />
    </Layout>
  );
}

// =========================================================================
// HELPER: BRAND HEADER PILL (Used across scenes 2-6 for continuity)
// =========================================================================
function BrandHeader() {
  return (
    <Rect y={-680} width={560} height={42} radius={21} fill="#091326" stroke="#162747" lineWidth={1.5}>
      <Circle x={-225} y={0} size={10} fill="#FF5A36" />
      <Txt
        text="FALCÃO MONITORAMENTO"
        x={-45}
        y={0}
        fontFamily="Arial"
        fontSize={18}
        fontWeight={800}
        letterSpacing={3}
        fill="#FFFFFF"
      />
      <Rect x={135} y={0} width={2} height={16} fill="#2A3D63" />
      <Txt
        text="CAIÇARA"
        x={195}
        y={0}
        fontFamily="Arial"
        fontSize={16}
        fontWeight={700}
        letterSpacing={2}
        fill="#FF5A36"
      />
    </Rect>
  );
}

export default makeScene2D(function* (view) {
  // Master Dark Navy Cinematic Canvas Background
  view.add(<Rect width={1080} height={1920} fill="#070D1B" />);

  // Ambient Radar / Nocturnal Rings in background
  const radarRing1 = createRef<Circle>();
  const radarRing2 = createRef<Circle>();
  const radarRing3 = createRef<Circle>();

  view.add(
    <Circle
      ref={radarRing1}
      size={600}
      stroke="#142342"
      lineWidth={1.5}
      opacity={0.4}
    />,
  );
  view.add(
    <Circle
      ref={radarRing2}
      size={1000}
      stroke="#142342"
      lineWidth={1.5}
      lineDash={[6, 12]}
      opacity={0.3}
    />,
  );
  view.add(
    <Circle
      ref={radarRing3}
      size={1400}
      stroke="#142342"
      lineWidth={1.5}
      opacity={0.2}
    />,
  );

  // =========================================================================
  // CENA 1: ABERTURA IMPACTANTE (0s – 5.0s)
  // =========================================================================
  const scene1Container = createRef<Layout>();
  const s1Emblem = createRef<Layout>();
  const s1FalconTitle = createRef<Txt>();
  const s1MonitorTitle = createRef<Txt>();
  const s1ServiceBadge = createRef<Rect>();
  const s1LocationBadge = createRef<Rect>();

  view.add(
    <Layout ref={scene1Container} y={0} opacity={0}>
      <Layout ref={s1Emblem} y={-240} opacity={0}>
        <FalconEmblem size={150} />
      </Layout>

      <Txt
        ref={s1FalconTitle}
        text="FALCÃO"
        x={0}
        y={-70}
        fontFamily="Arial"
        fontSize={96}
        fontWeight={900}
        letterSpacing={10}
        fill="#FFFFFF"
        opacity={0}
      />
      <Txt
        ref={s1MonitorTitle}
        text="MONITORAMENTO"
        x={0}
        y={40}
        fontFamily="Arial"
        fontSize={38}
        fontWeight={800}
        letterSpacing={8}
        fill="#FF5A36"
        opacity={0}
      />

      <Rect
        ref={s1ServiceBadge}
        x={0}
        y={150}
        width={680}
        height={54}
        radius={27}
        fill="#0F1E38"
        stroke="#22375F"
        lineWidth={1.5}
        opacity={0}
      >
        <Txt
          text="PATRULHAMENTO E RONDA NOTURNA"
          fontFamily="Arial"
          fontSize={22}
          fontWeight={800}
          letterSpacing={3}
          fill="#F5EFE6"
        />
      </Rect>

      <Rect
        ref={s1LocationBadge}
        x={0}
        y={230}
        width={380}
        height={48}
        radius={24}
        fill="#FF5A36"
        opacity={0}
      >
        <Txt
          text="BAIRRO CAIÇARA"
          fontFamily="Arial"
          fontSize={21}
          fontWeight={800}
          letterSpacing={4}
          fill="#FFFFFF"
        />
      </Rect>
    </Layout>,
  );

  // Animate Scene 1 Entry
  scene1Container().opacity(1);
  yield* all(
    scaleIn(s1Emblem(), {duration: 0.8, scale: 0.6, easing: 'easeOutBack'}),
    fadeUp(s1FalconTitle(), {distance: 40, duration: 0.8, delay: 0.15}),
    fadeUp(s1MonitorTitle(), {distance: 30, duration: 0.8, delay: 0.3}),
    fadeUp(s1ServiceBadge(), {distance: 25, duration: 0.7, delay: 0.45}),
    fadeUp(s1LocationBadge(), {distance: 25, duration: 0.7, delay: 0.6}),
  );

  yield* waitFor(2.7);
  yield* fadeOut(scene1Container(), {duration: 0.6, easing: 'easeInOutSine'});
  scene1Container().remove();

  // =========================================================================
  // CENA 2: APRESENTAÇÃO DO SERVIÇO (5.0s – 10.0s)
  // =========================================================================
  const scene2Container = createRef<Layout>();
  const s2Heading = createRef<Txt>();
  const s2RespCard = createRef<Rect>();
  const s2ClockCard = createRef<Rect>();

  view.add(
    <Layout ref={scene2Container} y={0} opacity={0}>
      <BrandHeader />

      {/* Main Headline */}
      <Txt
        ref={s2Heading}
        text="MAIS TRANQUILIDADE PARA SUA FAMÍLIA E SEU COMÉRCIO."
        x={0}
        y={-480}
        width={920}
        fontFamily="Arial"
        fontSize={46}
        fontWeight={900}
        lineHeight={62}
        textAlign="center"
        textWrap={true}
        fill="#FFFFFF"
        opacity={0}
      />

      {/* Responsável Felipe França */}
      <Rect
        ref={s2RespCard}
        x={0}
        y={-280}
        width={620}
        height={68}
        radius={34}
        fill="#0F1F3D"
        stroke="#FF5A36"
        lineWidth={2}
        opacity={0}
      >
        <Circle x={-225} y={0} size={14} fill="#FF5A36" />
        <Txt
          text="RESPONSÁVEL: FELIPE FRANÇA"
          x={18}
          y={0}
          fontFamily="Arial"
          fontSize={24}
          fontWeight={800}
          letterSpacing={3}
          fill="#FFFFFF"
        />
      </Rect>

      {/* Horário de Atendimento e Madrugada */}
      <Rect
        ref={s2ClockCard}
        x={0}
        y={90}
        width={920}
        height={460}
        radius={36}
        fill="#0D1A33"
        stroke="#1E335C"
        lineWidth={1.5}
        opacity={0}
      >
        {/* Night Surveillance Clock Graphic */}
        <Circle x={0} y={-110} size={130} fill="#080E1C" stroke="#2B4370" lineWidth={3}>
          <Circle size={8} fill="#FF5A36" />
          {/* Clock Hands indicating Night Patrol */}
          <Line points={[[0, 0], [0, -38]]} stroke="#FF5A36" lineWidth={4} radius={2} />
          <Line points={[[0, 0], [28, 14]]} stroke="#FFFFFF" lineWidth={3} radius={2} />
        </Circle>

        {/* Days of Operation */}
        <Txt
          text="SEGUNDA A SÁBADO"
          x={0}
          y={0}
          fontFamily="Arial"
          fontSize={34}
          fontWeight={900}
          letterSpacing={4}
          fill="#FFB703"
        />

        {/* Hours */}
        <Txt
          text="21:00 ÀS 05:00"
          x={0}
          y={68}
          fontFamily="Arial"
          fontSize={64}
          fontWeight={900}
          letterSpacing={3}
          fill="#FFFFFF"
        />

        {/* Night Description */}
        <Txt
          text="Patrulhamento intensivo e vigilância ativa durante toda a madrugada."
          x={0}
          y={150}
          width={760}
          fontFamily="Arial"
          fontSize={22}
          fontWeight={400}
          lineHeight={32}
          textAlign="center"
          textWrap={true}
          fill="#CBD5E1"
        />
      </Rect>
    </Layout>,
  );

  scene2Container().opacity(1);
  yield* all(
    fadeUp(s2Heading(), {distance: 35, duration: 0.7}),
    fadeUp(s2RespCard(), {distance: 25, duration: 0.65, delay: 0.2}),
    scaleIn(s2ClockCard(), {duration: 0.75, scale: 0.9, delay: 0.35}),
  );

  yield* waitFor(3.1);
  yield* fadeOut(scene2Container(), {duration: 0.6, easing: 'easeInOutSine'});
  scene2Container().remove();

  // =========================================================================
  // CENA 3: COMO FUNCIONA A RONDA (10.0s – 16.0s)
  // =========================================================================
  const scene3Container = createRef<Layout>();
  const s3Title = createRef<Txt>();
  const s3Desc = createRef<Txt>();
  const s3MapCard = createRef<Rect>();
  const s3StatContainer = createRef<Layout>();

  view.add(
    <Layout ref={scene3Container} y={0} opacity={0}>
      <BrandHeader />

      <Txt
        ref={s3Title}
        text="PRESENÇA ATIVA DURANTE A NOITE"
        x={0}
        y={-490}
        width={920}
        fontFamily="Arial"
        fontSize={44}
        fontWeight={900}
        textAlign="center"
        fill="#FFFFFF"
        opacity={0}
      />

      <Txt
        ref={s3Desc}
        text="Nossa equipe realiza rondas noturnas motorizadas pelas ruas e em frente aos estabelecimentos, com média de passagem a cada 60 minutos."
        x={0}
        y={-370}
        width={880}
        fontFamily="Arial"
        fontSize={24}
        fontWeight={400}
        lineHeight={38}
        textAlign="center"
        textWrap={true}
        fill="#CBD5E1"
        opacity={0}
      />

      {/* Visual Patrol Route Card */}
      <Rect
        ref={s3MapCard}
        x={0}
        y={-60}
        width={920}
        height={320}
        radius={28}
        fill="#0D1A33"
        stroke="#1E335C"
        lineWidth={1.5}
        opacity={0}
      >
        {/* Neighborhood Street Grid Lines */}
        <Line points={[[-400, -80], [400, -80]]} stroke="#1A2D4F" lineWidth={2} lineDash={[8, 8]} />
        <Line points={[[-400, 40], [400, 40]]} stroke="#1A2D4F" lineWidth={2} lineDash={[8, 8]} />
        <Line points={[[-200, -140], [-200, 140]]} stroke="#1A2D4F" lineWidth={2} lineDash={[8, 8]} />
        <Line points={[[200, -140], [200, 140]]} stroke="#1A2D4F" lineWidth={2} lineDash={[8, 8]} />

        {/* Active Patrol Route Path */}
        <Path
          data="M -360 -80 L -200 -80 L -200 40 L 200 40 L 200 -80 L 360 -80"
          stroke="#FF5A36"
          lineWidth={4}
          lineCap="round"
          lineJoin="round"
        />

        {/* Patrol Route Checkpoint Nodes */}
        <Circle x={-200} y={-80} size={28} fill="#0D1A33" stroke="#FF5A36" lineWidth={3}>
          <Circle size={8} fill="#FF5A36" />
        </Circle>
        <Circle x={-200} y={40} size={28} fill="#0D1A33" stroke="#FF5A36" lineWidth={3}>
          <Circle size={8} fill="#FF5A36" />
        </Circle>
        <Circle x={200} y={40} size={28} fill="#0D1A33" stroke="#FF5A36" lineWidth={3}>
          <Circle size={8} fill="#FF5A36" />
        </Circle>
        <Circle x={200} y={-80} size={28} fill="#0D1A33" stroke="#FF5A36" lineWidth={3}>
          <Circle size={8} fill="#FF5A36" />
        </Circle>

        {/* Motorbike Patrol Vehicle Indicator */}
        <Rect x={0} y={40} width={220} height={52} radius={26} fill="#FF5A36">
          <Txt
            text="RONDA MOTORIZADA"
            fontFamily="Arial"
            fontSize={17}
            fontWeight={800}
            letterSpacing={2}
            fill="#FFFFFF"
          />
        </Rect>
      </Rect>

      {/* 60 Minutes Stat Card */}
      <Layout ref={s3StatContainer} x={0} y={270} opacity={0}>
        <Rect
          width={920}
          height={210}
          radius={28}
          fill="#0F1F3D"
          stroke="#FF5A36"
          lineWidth={2}
        >
          <Txt
            text="MÉDIA DE PASSAGEM"
            x={0}
            y={-50}
            fontFamily="Arial"
            fontSize={22}
            fontWeight={800}
            letterSpacing={4}
            fill="#FFB703"
          />
          <Txt
            text="A CADA 60 MINUTOS"
            x={0}
            y={10}
            fontFamily="Arial"
            fontSize={48}
            fontWeight={900}
            letterSpacing={2}
            fill="#FFFFFF"
          />
          <Txt
            text="Circulação contínua e preventiva pelas vias do Bairro Caiçara."
            x={0}
            y={65}
            fontFamily="Arial"
            fontSize={20}
            fontWeight={400}
            fill="#CBD5E1"
          />
        </Rect>
      </Layout>

      {/* Frequency notice */}
      <Txt
        text="* Passagem preventiva contínua com média estimada por rota."
        x={0}
        y={420}
        fontFamily="Arial"
        fontSize={17}
        fontWeight={400}
        fill="#64748B"
      />
    </Layout>,
  );

  scene3Container().opacity(1);
  yield* all(
    fadeUp(s3Title(), {distance: 35, duration: 0.7}),
    fadeUp(s3Desc(), {distance: 25, duration: 0.7, delay: 0.15}),
    scaleIn(s3MapCard(), {duration: 0.75, scale: 0.92, delay: 0.3}),
    fadeUp(s3StatContainer(), {distance: 30, duration: 0.7, delay: 0.45}),
  );

  yield* waitFor(4.1);
  yield* fadeOut(scene3Container(), {duration: 0.6, easing: 'easeInOutSine'});
  scene3Container().remove();

  // =========================================================================
  // CENA 4: APOIO DIRETO AO MORADOR (16.0s – 24.0s)
  // 6 Services presented in 2 dynamic, legible 3-card groups
  // =========================================================================
  const scene4Container = createRef<Layout>();
  const s4Title = createRef<Txt>();
  const s4Subtitle = createRef<Txt>();
  const s4Batch1 = createRef<Layout>();
  const s4Batch2 = createRef<Layout>();
  const s4Punchline = createRef<Rect>();

  view.add(
    <Layout ref={scene4Container} y={0} opacity={0}>
      <BrandHeader />

      <Txt
        ref={s4Title}
        text="VOCÊ NÃO ESTÁ SOZINHO."
        x={0}
        y={-500}
        width={920}
        fontFamily="Arial"
        fontSize={52}
        fontWeight={900}
        letterSpacing={2}
        textAlign="center"
        fill="#FFFFFF"
        opacity={0}
      />

      <Txt
        ref={s4Subtitle}
        text="Além das rondas, os moradores contam com atendimento direto da equipe por telefone."
        x={0}
        y={-410}
        width={880}
        fontFamily="Arial"
        fontSize={23}
        fontWeight={400}
        lineHeight={34}
        textAlign="center"
        textWrap={true}
        fill="#CBD5E1"
        opacity={0}
      />

      {/* Batch 1: Services 1, 2, 3 */}
      <Layout ref={s4Batch1} y={-40} opacity={0}>
        {[
          {
            num: '01',
            title: 'Acompanhamento de Chegada e Saída',
            desc: 'Apoio na entrada ou saída da sua residência durante a noite.',
          },
          {
            num: '02',
            title: 'Averiguação de Barulhos Suspeitos',
            desc: 'Verificação rápida de movimentações anormais nas imediações.',
          },
          {
            num: '03',
            title: 'Apoio Diante do Portão',
            desc: 'Presença e suporte caso pessoas desconhecidas insistam na campainha.',
          },
        ].map((item, idx) => (
          <Rect
            key={item.num}
            y={(idx - 1) * 160}
            width={920}
            height={138}
            radius={22}
            fill="#0D1A33"
            stroke="#1E335C"
            lineWidth={1.5}
          >
            <Circle x={-390} y={0} size={54} fill="#080E1C" stroke="#FF5A36" lineWidth={2}>
              <Txt text={item.num} fontFamily="Arial" fontSize={22} fontWeight={800} fill="#FF5A36" />
            </Circle>
            <Txt
              text={item.title}
              x={-20}
              y={-22}
              width={660}
              fontFamily="Arial"
              fontSize={25}
              fontWeight={800}
              fill="#FFFFFF"
            />
            <Txt
              text={item.desc}
              x={-20}
              y={24}
              width={660}
              fontFamily="Arial"
              fontSize={19}
              fontWeight={400}
              fill="#94A3B8"
            />
          </Rect>
        ))}
      </Layout>

      {/* Batch 2: Services 4, 5, 6 */}
      <Layout ref={s4Batch2} y={-40} opacity={0}>
        {[
          {
            num: '04',
            title: 'Apoio em Emergências',
            desc: 'Presença e assistência imediata em momentos de necessidade urgente.',
          },
          {
            num: '05',
            title: 'Acionamento da Polícia Militar',
            desc: 'Contato ágil com as autoridades públicas quando necessário.',
          },
          {
            num: '06',
            title: 'Ajuda em Urgências da Madrugada',
            desc: 'Apoio para buscar medicamentos essenciais em horários críticos.',
          },
        ].map((item, idx) => (
          <Rect
            key={item.num}
            y={(idx - 1) * 160}
            width={920}
            height={138}
            radius={22}
            fill="#0F1F3D"
            stroke="#FF5A36"
            lineWidth={1.5}
          >
            <Circle x={-390} y={0} size={54} fill="#080E1C" stroke="#FFB703" lineWidth={2}>
              <Txt text={item.num} fontFamily="Arial" fontSize={22} fontWeight={800} fill="#FFB703" />
            </Circle>
            <Txt
              text={item.title}
              x={-20}
              y={-22}
              width={660}
              fontFamily="Arial"
              fontSize={25}
              fontWeight={800}
              fill="#FFFFFF"
            />
            <Txt
              text={item.desc}
              x={-20}
              y={24}
              width={660}
              fontFamily="Arial"
              fontSize={19}
              fontWeight={400}
              fill="#CBD5E1"
            />
          </Rect>
        ))}
      </Layout>

      {/* Bottom Tagline */}
      <Rect
        ref={s4Punchline}
        x={0}
        y={360}
        width={760}
        height={60}
        radius={30}
        fill="#FF5A36"
        opacity={0}
      >
        <Txt
          text="MAIS SEGURANÇA. MAIS TRANQUILIDADE."
          fontFamily="Arial"
          fontSize={24}
          fontWeight={900}
          letterSpacing={3}
          fill="#FFFFFF"
        />
      </Rect>
    </Layout>,
  );

  scene4Container().opacity(1);
  yield* all(
    fadeUp(s4Title(), {distance: 30, duration: 0.6}),
    fadeUp(s4Subtitle(), {distance: 25, duration: 0.6, delay: 0.15}),
    fadeUp(s4Batch1(), {distance: 35, duration: 0.7, delay: 0.25}),
  );

  // Read Batch 1
  yield* waitFor(2.6);

  // Transition from Batch 1 to Batch 2
  yield* fadeOut(s4Batch1(), {duration: 0.35});
  yield* all(
    fadeUp(s4Batch2(), {distance: 35, duration: 0.6}),
    fadeUp(s4Punchline(), {distance: 25, duration: 0.6, delay: 0.2}),
  );

  // Read Batch 2
  yield* waitFor(2.6);
  yield* fadeOut(scene4Container(), {duration: 0.6, easing: 'easeInOutSine'});
  scene4Container().remove();

  // =========================================================================
  // CENA 5: QUEM PODE UTILIZAR O SERVIÇO (24.0s – 29.0s)
  // =========================================================================
  const scene5Container = createRef<Layout>();
  const s5Title = createRef<Txt>();
  const s5Card1 = createRef<Rect>();
  const s5Card2 = createRef<Rect>();
  const s5Card3 = createRef<Rect>();

  view.add(
    <Layout ref={scene5Container} y={0} opacity={0}>
      <BrandHeader />

      <Txt
        ref={s5Title}
        text="ATENDIMENTO PARA DIFERENTES NECESSIDADES"
        x={0}
        y={-470}
        width={860}
        fontFamily="Arial"
        fontSize={36}
        fontWeight={900}
        textAlign="center"
        textWrap={true}
        lineHeight={48}
        fill="#FFFFFF"
        opacity={0}
      />

      {/* 1. Residências */}
      <Rect
        ref={s5Card1}
        x={0}
        y={-240}
        width={920}
        height={170}
        radius={28}
        fill="#0D1A33"
        stroke="#1E335C"
        lineWidth={1.5}
        opacity={0}
      >
        <Circle x={-360} y={0} size={84} fill="#080E1C" stroke="#FF5A36" lineWidth={2}>
          {/* House icon graphic */}
          <Path
            data="M -20 6 L 0 -14 L 20 6 L 14 6 L 14 18 L -14 18 L -14 6 Z"
            fill="#FF5A36"
          />
        </Circle>
        <Txt
          text="RESIDÊNCIAS"
          x={10}
          y={-30}
          width={640}
          fontFamily="Arial"
          fontSize={32}
          fontWeight={900}
          letterSpacing={2}
          fill="#FFFFFF"
        />
        <Txt
          text="Casas, sobrados e vilas com vigilância noturna constante na porta do imóvel."
          x={10}
          y={25}
          width={640}
          fontFamily="Arial"
          fontSize={21}
          fontWeight={400}
          fill="#94A3B8"
        />
      </Rect>

      {/* 2. Apartamentos */}
      <Rect
        ref={s5Card2}
        x={0}
        y={-40}
        width={920}
        height={170}
        radius={28}
        fill="#0D1A33"
        stroke="#1E335C"
        lineWidth={1.5}
        opacity={0}
      >
        <Circle x={-360} y={0} size={84} fill="#080E1C" stroke="#FF5A36" lineWidth={2}>
          {/* Building icon graphic */}
          <Path
            data="M -14 18 L -14 -18 L 14 -18 L 14 18 Z"
            fill="#FF5A36"
          />
          <Circle x={-5} y={-8} size={4} fill="#080E1C" />
          <Circle x={5} y={-8} size={4} fill="#080E1C" />
          <Circle x={-5} y={4} size={4} fill="#080E1C" />
          <Circle x={5} y={4} size={4} fill="#080E1C" />
        </Circle>
        <Txt
          text="APARTAMENTOS"
          x={10}
          y={-30}
          width={640}
          fontFamily="Arial"
          fontSize={32}
          fontWeight={900}
          letterSpacing={2}
          fill="#FFFFFF"
        />
        <Txt
          text="Condomínios, prédios residenciais e portarias com acompanhamento seguro."
          x={10}
          y={25}
          width={640}
          fontFamily="Arial"
          fontSize={21}
          fontWeight={400}
          fill="#94A3B8"
        />
      </Rect>

      {/* 3. Estabelecimentos Comerciais */}
      <Rect
        ref={s5Card3}
        x={0}
        y={160}
        width={920}
        height={170}
        radius={28}
        fill="#0F1F3D"
        stroke="#FF5A36"
        lineWidth={2}
        opacity={0}
      >
        <Circle x={-360} y={0} size={84} fill="#080E1C" stroke="#FFB703" lineWidth={2}>
          {/* Storefront icon graphic */}
          <Path
            data="M -20 -4 L 20 -4 L 16 18 L -16 18 Z"
            fill="#FFB703"
          />
          <Path
            data="M -22 -4 L 0 -18 L 22 -4 Z"
            fill="#FFFFFF"
          />
        </Circle>
        <Txt
          text="ESTABELECIMENTOS COMERCIAIS"
          x={10}
          y={-30}
          width={640}
          fontFamily="Arial"
          fontSize={30}
          fontWeight={900}
          letterSpacing={2}
          fill="#FFB703"
        />
        <Txt
          text="Lojas, escritórios, consultórios e galpões protegidos durante a madrugada."
          x={10}
          y={25}
          width={640}
          fontFamily="Arial"
          fontSize={21}
          fontWeight={400}
          fill="#CBD5E1"
        />
      </Rect>
    </Layout>,
  );

  scene5Container().opacity(1);
  yield* all(
    fadeUp(s5Title(), {distance: 35, duration: 0.65}),
    fadeUp(s5Card1(), {distance: 30, duration: 0.6, delay: 0.15}),
    fadeUp(s5Card2(), {distance: 30, duration: 0.6, delay: 0.3}),
    fadeUp(s5Card3(), {distance: 30, duration: 0.6, delay: 0.45}),
  );

  yield* waitFor(3.1);
  yield* fadeOut(scene5Container(), {duration: 0.6, easing: 'easeInOutSine'});
  scene5Container().remove();

  // =========================================================================
  // CENA 6: VALORES TRANSPARENTES (29.0s – 34.0s)
  // =========================================================================
  const scene6Container = createRef<Layout>();
  const s6Title = createRef<Txt>();
  const s6Subtitle = createRef<Txt>();
  const s6Price1 = createRef<Rect>();
  const s6Price2 = createRef<Rect>();
  const s6Price3 = createRef<Rect>();

  view.add(
    <Layout ref={scene6Container} y={0} opacity={0}>
      <BrandHeader />

      <Txt
        ref={s6Title}
        text="PROTEÇÃO COM TAXA MENSAL"
        x={0}
        y={-480}
        width={920}
        fontFamily="Arial"
        fontSize={48}
        fontWeight={900}
        textAlign="center"
        fill="#FFFFFF"
        opacity={0}
      />

      <Txt
        ref={s6Subtitle}
        text="Investimento acessível com valor fixo e previsível para cada categoria."
        x={0}
        y={-400}
        width={860}
        fontFamily="Arial"
        fontSize={22}
        fontWeight={400}
        textAlign="center"
        fill="#CBD5E1"
        opacity={0}
      />

      {/* 1. Residências Price Card */}
      <Rect
        ref={s6Price1}
        x={0}
        y={-230}
        width={920}
        height={160}
        radius={26}
        fill="#0D1A33"
        stroke="#1E335C"
        lineWidth={1.5}
        opacity={0}
      >
        <Txt
          text="RESIDÊNCIAS"
          x={-220}
          y={0}
          fontFamily="Arial"
          fontSize={32}
          fontWeight={900}
          letterSpacing={3}
          fill="#FFFFFF"
        />
        <Txt
          text="R$ 60,00"
          x={200}
          y={0}
          fontFamily="Arial"
          fontSize={50}
          fontWeight={900}
          fill="#FF5A36"
        />
        <Txt
          text="/ MÊS"
          x={340}
          y={4}
          fontFamily="Arial"
          fontSize={20}
          fontWeight={700}
          fill="#94A3B8"
        />
      </Rect>

      {/* 2. Apartamentos Price Card */}
      <Rect
        ref={s6Price2}
        x={0}
        y={-40}
        width={920}
        height={160}
        radius={26}
        fill="#0D1A33"
        stroke="#1E335C"
        lineWidth={1.5}
        opacity={0}
      >
        <Txt
          text="APARTAMENTOS"
          x={-200}
          y={0}
          fontFamily="Arial"
          fontSize={32}
          fontWeight={900}
          letterSpacing={3}
          fill="#FFFFFF"
        />
        <Txt
          text="R$ 60,00"
          x={200}
          y={0}
          fontFamily="Arial"
          fontSize={50}
          fontWeight={900}
          fill="#FF5A36"
        />
        <Txt
          text="/ MÊS"
          x={340}
          y={4}
          fontFamily="Arial"
          fontSize={20}
          fontWeight={700}
          fill="#94A3B8"
        />
      </Rect>

      {/* 3. Comércios Price Card */}
      <Rect
        ref={s6Price3}
        x={0}
        y={150}
        width={920}
        height={160}
        radius={26}
        fill="#0F1F3D"
        stroke="#FFB703"
        lineWidth={2}
        opacity={0}
      >
        <Txt
          text="COMÉRCIOS"
          x={-240}
          y={0}
          fontFamily="Arial"
          fontSize={32}
          fontWeight={900}
          letterSpacing={3}
          fill="#FFB703"
        />
        <Txt
          text="R$ 80,00"
          x={200}
          y={0}
          fontFamily="Arial"
          fontSize={50}
          fontWeight={900}
          fill="#FFB703"
        />
        <Txt
          text="/ MÊS"
          x={340}
          y={4}
          fontFamily="Arial"
          fontSize={20}
          fontWeight={700}
          fill="#F5EFE6"
        />
      </Rect>

      {/* Bottom Reassurance Banner */}
      <Rect x={0} y={320} width={620} height={48} radius={24} fill="#0F1E38">
        <Txt
          text="Sem taxas adicionais • Contribuição mensal fixa"
          fontFamily="Arial"
          fontSize={19}
          fontWeight={600}
          fill="#94A3B8"
        />
      </Rect>
    </Layout>,
  );

  scene6Container().opacity(1);
  yield* all(
    fadeUp(s6Title(), {distance: 35, duration: 0.65}),
    fadeUp(s6Subtitle(), {distance: 25, duration: 0.6, delay: 0.15}),
    fadeUp(s6Price1(), {distance: 30, duration: 0.6, delay: 0.25}),
    fadeUp(s6Price2(), {distance: 30, duration: 0.6, delay: 0.4}),
    fadeUp(s6Price3(), {distance: 30, duration: 0.6, delay: 0.55}),
  );

  yield* waitFor(3.1);
  yield* fadeOut(scene6Container(), {duration: 0.6, easing: 'easeInOutSine'});
  scene6Container().remove();

  // =========================================================================
  // CENA 7: ENCERRAMENTO E CONTATO (34.0s – 40.0s)
  // Generous reading time and authoritative branding
  // =========================================================================
  const scene7Container = createRef<Layout>();
  const s7Emblem = createRef<Layout>();
  const s7BrandTitle = createRef<Txt>();
  const s7ServiceText = createRef<Txt>();
  const s7LocationBadge = createRef<Rect>();
  const s7RespCard = createRef<Rect>();
  const s7PhoneCard = createRef<Rect>();
  const s7ContractNotice = createRef<Rect>();
  const s7CtaText = createRef<Txt>();
  const s7FinalSlogan = createRef<Txt>();

  view.add(
    <Layout ref={scene7Container} y={0} opacity={0}>
      {/* Falcon Emblem */}
      <Layout ref={s7Emblem} y={-540} opacity={0}>
        <FalconEmblem size={110} />
      </Layout>

      {/* Brand Title */}
      <Txt
        ref={s7BrandTitle}
        text="FALCÃO MONITORAMENTO"
        x={0}
        y={-430}
        fontFamily="Arial"
        fontSize={46}
        fontWeight={900}
        letterSpacing={6}
        fill="#FFFFFF"
        opacity={0}
      />

      <Txt
        ref={s7ServiceText}
        text="PATRULHAMENTO E RONDA NOTURNA"
        x={0}
        y={-370}
        fontFamily="Arial"
        fontSize={22}
        fontWeight={800}
        letterSpacing={4}
        fill="#FF5A36"
        opacity={0}
      />

      {/* Location Badge */}
      <Rect
        ref={s7LocationBadge}
        x={0}
        y={-310}
        width={340}
        height={44}
        radius={22}
        fill="#0F1E38"
        stroke="#2C4372"
        lineWidth={1.5}
        opacity={0}
      >
        <Txt
          text="BAIRRO CAIÇARA"
          fontFamily="Arial"
          fontSize={19}
          fontWeight={800}
          letterSpacing={3}
          fill="#FFFFFF"
        />
      </Rect>

      {/* Responsável Felipe França */}
      <Rect
        ref={s7RespCard}
        x={0}
        y={-220}
        width={560}
        height={56}
        radius={28}
        fill="#0D1A33"
        opacity={0}
      >
        <Txt
          text="RESPONSÁVEL: FELIPE FRANÇA"
          fontFamily="Arial"
          fontSize={22}
          fontWeight={800}
          letterSpacing={3}
          fill="#CBD5E1"
        />
      </Rect>

      {/* Primary Phone Card */}
      <Rect
        ref={s7PhoneCard}
        x={0}
        y={-80}
        width={820}
        height={160}
        radius={32}
        fill="#0F1F3D"
        stroke="#FF5A36"
        lineWidth={3}
        opacity={0}
      >
        <Circle x={-290} y={0} size={76} fill="#FF5A36">
          {/* Phone handset icon */}
          <Path
            data="M -12 -14 C -14 -10 -14 -4 -4 6 C 6 16 12 16 16 14 L 20 8 L 12 2 L 8 6 C 6 4 4 2 2 0 L 6 -4 L 0 -12 Z"
            fill="#FFFFFF"
          />
        </Circle>

        <Txt
          text="LIGUE OU CHAME NO WHATSAPP"
          x={50}
          y={-30}
          fontFamily="Arial"
          fontSize={18}
          fontWeight={800}
          letterSpacing={3}
          fill="#FFB703"
        />
        <Txt
          text="(31) 97126-6370"
          x={50}
          y={24}
          fontFamily="Arial"
          fontSize={54}
          fontWeight={900}
          letterSpacing={2}
          fill="#FFFFFF"
        />
      </Rect>

      {/* Important: Cadastro, não contrato */}
      <Rect
        ref={s7ContractNotice}
        x={0}
        y={90}
        width={720}
        height={64}
        radius={32}
        fill="#FF5A36"
        opacity={0}
      >
        <Txt
          text="É UM CADASTRO, NÃO UM CONTRATO."
          fontFamily="Arial"
          fontSize={24}
          fontWeight={900}
          letterSpacing={3}
          fill="#FFFFFF"
        />
      </Rect>

      {/* Final CTA */}
      <Txt
        ref={s7CtaText}
        text="Entre em contato e conheça nosso serviço."
        x={0}
        y={190}
        fontFamily="Arial"
        fontSize={28}
        fontWeight={700}
        fill="#FFFFFF"
        opacity={0}
      />

      {/* Slogan */}
      <Txt
        ref={s7FinalSlogan}
        text="MAIS TRANQUILIDADE PARA VOCÊ E SUA FAMÍLIA."
        x={0}
        y={260}
        width={860}
        fontFamily="Arial"
        fontSize={24}
        fontWeight={800}
        letterSpacing={2}
        textAlign="center"
        fill="#FFB703"
        opacity={0}
      />
    </Layout>,
  );

  scene7Container().opacity(1);
  yield* all(
    scaleIn(s7Emblem(), {duration: 0.7, scale: 0.65}),
    fadeUp(s7BrandTitle(), {distance: 25, duration: 0.65, delay: 0.15}),
    fadeUp(s7ServiceText(), {distance: 20, duration: 0.6, delay: 0.25}),
    fadeUp(s7LocationBadge(), {distance: 20, duration: 0.6, delay: 0.35}),
    fadeUp(s7RespCard(), {distance: 20, duration: 0.6, delay: 0.45}),
    scaleIn(s7PhoneCard(), {duration: 0.8, scale: 0.88, delay: 0.6}),
    fadeUp(s7ContractNotice(), {distance: 25, duration: 0.7, delay: 0.8}),
    fadeUp(s7CtaText(), {distance: 20, duration: 0.6, delay: 0.95}),
    fadeUp(s7FinalSlogan(), {distance: 20, duration: 0.6, delay: 1.1}),
  );

  // Full, comfortable reading time for contact and closing
  yield* waitFor(4.1);

  // Gentle closing fade
  yield* fadeOut(scene7Container(), {duration: 0.8, easing: 'easeInOutSine'});
  yield* waitFor(0.2);
});
