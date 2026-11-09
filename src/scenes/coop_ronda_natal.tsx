import {Circle, Layout, Line, makeScene2D, Path, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, loop, waitFor} from '@motion-canvas/core';
import {easeInOutSine, easeOutBack, easeOutCubic} from '../animations/easing';
import {fadeOut, fadeUp, scaleIn} from '../animations/transitions';
import {
  ChristmasBackground,
  ChristmasBanner,
  ChristmasEmblem,
  ChristmasLights,
  GiftBox,
  GoldenStar,
  PineBranch,
} from '../components/christmas';

// =========================================================================
// HELPER: TOP PERSISTENT FESTIVE HEADER
// =========================================================================
function FestiveHeaderPill() {
  return (
    <Rect
      y={-760}
      width={560}
      height={46}
      radius={23}
      fill="#B8000C"
      stroke="#FFD21A"
      lineWidth={2}
      shadowColor="#17171720"
      shadowBlur={12}
    >
      <Circle x={-230} y={0} size={10} fill="#FFD21A" />
      <Txt
        text="COOP RONDA"
        x={-50}
        y={0}
        fontFamily="Montserrat"
        fontSize={18}
        fontWeight={900}
        letterSpacing={3}
        fill="#FFFFFF"
      />
      <Rect x={130} y={0} width={2} height={18} fill="#FFD21A" />
      <Txt
        text="NATAL 2026"
        x={200}
        y={0}
        fontFamily="Montserrat"
        fontSize={15}
        fontWeight={800}
        letterSpacing={2}
        fill="#FFD21A"
      />
    </Rect>
  );
}

export default makeScene2D(function* (view) {
  // 1. MASTER CHRISTMAS BACKGROUND
  view.add(<ChristmasBackground />);

  // 2. FESTIVE DECORATIVE CORNERS & LIGHTS
  const foliageLayer = createRef<Layout>();
  view.add(
    <Layout ref={foliageLayer} opacity={0}>
      {/* Top Lights Garland */}
      <ChristmasLights y={-860} />

      {/* Top Pine Branches */}
      <PineBranch x={-480} y={-840} rotation={25} scale={1.25} />
      <PineBranch x={480} y={-840} rotation={-25} scale={1.25} />

      {/* Bottom Pine Branches */}
      <PineBranch x={-490} y={850} rotation={-30} scale={1.15} />
      <PineBranch x={490} y={850} rotation={30} scale={1.15} />

      {/* Subtle Hanging Baubles */}
      <Layout x={-360} y={-760}>
        <Line points={[[0, -100], [0, 0]]} stroke="#FFD21A" lineWidth={1} />
        <Circle y={16} size={32} fill="#B8000C" stroke="#FFD21A" lineWidth={1.5} />
        <Circle x={-4} y={12} size={6} fill="#FFFFFF" opacity={0.7} />
      </Layout>
      <Layout x={360} y={-780}>
        <Line points={[[0, -80], [0, 0]]} stroke="#FFD21A" lineWidth={1} />
        <Circle y={16} size={28} fill="#FFD21A" stroke="#C99700" lineWidth={1.5} />
        <Circle x={-3} y={13} size={5} fill="#FFFFFF" opacity={0.8} />
      </Layout>
    </Layout>,
  );

  // Fade in foliage & lights smoothly at start
  foliageLayer().opacity(0.1);
  foliageLayer().opacity(1, 1.2, easeInOutSine);

  // =========================================================================
  // CENA 1: ABERTURA NATALINA (0.0s – 7.0s | 7.0s)
  // "AMIGOS E CLIENTES" -> "COOP RONDA"
  // =========================================================================
  const s1Container = createRef<Layout>();
  const s1EmblemRef = createRef<Layout>();
  const s1Star1 = createRef<Layout>();
  const s1Star2 = createRef<Layout>();
  const s1Subtitle = createRef<Txt>();
  const s1Tagline = createRef<Txt>();
  const s1BannerRef = createRef<Layout>();

  view.add(
    <Layout ref={s1Container} opacity={0}>
      {/* Central Festive Emblem */}
      <Layout ref={s1EmblemRef} y={-230} opacity={0}>
        <ChristmasEmblem size={250} />
      </Layout>

      {/* Decorative Sparkling Stars */}
      <Layout ref={s1Star1} x={-260} y={-320} opacity={0}>
        <GoldenStar size={50} />
      </Layout>
      <Layout ref={s1Star2} x={260} y={-300} opacity={0}>
        <GoldenStar size={44} />
      </Layout>

      {/* Intro Greetings */}
      <Txt
        ref={s1Subtitle}
        text="AOS NOSSOS QUERIDOS"
        y={-20}
        fontFamily="Montserrat"
        fontSize={26}
        fontWeight={800}
        letterSpacing={6}
        fill="#C99700"
        opacity={0}
      />

      {/* Top Banner: AMIGOS E CLIENTES */}
      <Layout ref={s1BannerRef} y={70} opacity={0}>
        <ChristmasBanner
          width={820}
          height={92}
          title="AMIGOS E CLIENTES"
          titleColor="#FFFFFF"
          fillColor="#B8000C"
          strokeColor="#FFD21A"
        />
      </Layout>

      {/* Highlight Brand Card: COOP RONDA */}
      <Rect
        y={210}
        width={720}
        height={100}
        radius={20}
        fill="#FFD21A"
        stroke="#C99700"
        lineWidth={3}
        shadowColor="#17171725"
        shadowBlur={20}
        shadowOffsetY={6}
      >
        <Txt
          text="COOP RONDA"
          y={0}
          fontFamily="Montserrat"
          fontSize={52}
          fontWeight={900}
          letterSpacing={6}
          fill="#B8000C"
        />
      </Rect>

      <Txt
        ref={s1Tagline}
        text="PATRULHAMENTO • RONDA • SEGURANÇA"
        y={310}
        fontFamily="Montserrat"
        fontSize={18}
        fontWeight={800}
        letterSpacing={4}
        fill="#173D24"
        opacity={0}
      />
    </Layout>,
  );

  s1Container().opacity(1);
  yield* all(
    scaleIn(s1EmblemRef(), {duration: 0.9, scale: 0.65, easing: 'easeOutBack'}),
    scaleIn(s1Star1(), {duration: 0.8, delay: 0.2, scale: 0.5}),
    scaleIn(s1Star2(), {duration: 0.8, delay: 0.35, scale: 0.5}),
    fadeUp(s1Subtitle(), {distance: 25, duration: 0.7, delay: 0.3}),
    fadeUp(s1BannerRef(), {distance: 35, duration: 0.8, delay: 0.5}),
    fadeUp(s1Tagline(), {distance: 20, duration: 0.7, delay: 0.8}),
  );

  yield* waitFor(5.3);
  yield* fadeOut(s1Container(), {duration: 0.8, easing: 'easeInOutSine'});
  s1Container().remove();

  // =========================================================================
  // CENA 2: AGRADECIMENTO (7.0s – 15.0s | 8.0s)
  // "MAIS UM ANO JUNTOS!" -> Confiança, Parceria, Preferência
  // =========================================================================
  const s2Container = createRef<Layout>();
  const s2Heading = createRef<Txt>();
  const s2MainCard = createRef<Rect>();
  const s2Badge1 = createRef<Rect>();
  const s2Badge2 = createRef<Rect>();
  const s2Badge3 = createRef<Rect>();

  view.add(
    <Layout ref={s2Container} opacity={0}>
      <FestiveHeaderPill />

      {/* Star Accents */}
      <Layout x={-380} y={-640}>
        <GoldenStar size={36} />
      </Layout>
      <Layout x={380} y={-640}>
        <GoldenStar size={36} />
      </Layout>

      {/* Main Title */}
      <Txt
        ref={s2Heading}
        text="MAIS UM ANO JUNTOS!"
        y={-570}
        width={900}
        fontFamily="Montserrat"
        fontSize={46}
        fontWeight={900}
        textAlign="center"
        letterSpacing={3}
        fill="#B8000C"
        opacity={0}
      />

      {/* Subtitle Message Card */}
      <Rect
        ref={s2MainCard}
        y={-340}
        width={880}
        height={260}
        radius={24}
        fill="#FFFFFF"
        stroke="#FFD21A"
        lineWidth={2.5}
        shadowColor="#17171720"
        shadowBlur={20}
        shadowOffsetY={8}
        opacity={0}
      >
        <Rect y={-110} width={280} height={32} radius={16} fill="#B8000C">
          <Txt
            text="MENSAGEM DE GRATIDÃO"
            fontFamily="Montserrat"
            fontSize={13}
            fontWeight={900}
            letterSpacing={2}
            fill="#FFF8EC"
          />
        </Rect>

        <Txt
          text="Chegamos ao final de mais um ano e queremos agradecer de coração pela presença constante ao nosso lado."
          y={-10}
          width={800}
          fontFamily="Montserrat"
          fontSize={27}
          fontWeight={600}
          lineHeight={42}
          textAlign="center"
          textWrap={true}
          fill="#171717"
        />

        <Txt
          text="Obrigado pela dedicação e apoio ao nosso patrulhamento."
          y={78}
          width={760}
          fontFamily="Montserrat"
          fontSize={21}
          fontWeight={500}
          textAlign="center"
          fill="#8A0009"
        />
      </Rect>

      {/* 3 Pillars in Crimson & Gold Cards */}
      <Txt
        text="NOSSO AGRADECIMENTO PELA SUA:"
        y={-90}
        fontFamily="Montserrat"
        fontSize={20}
        fontWeight={800}
        letterSpacing={4}
        fill="#C99700"
      />

      {/* Pillar 1: CONFIANÇA */}
      <Rect
        ref={s2Badge1}
        x={0}
        y={20}
        width={860}
        height={110}
        radius={20}
        fill="#B8000C"
        stroke="#FFD21A"
        lineWidth={2}
        shadowColor="#17171725"
        shadowBlur={16}
        shadowOffsetY={6}
        opacity={0}
      >
        <Circle x={-360} y={0} size={54} fill="#FFD21A" />
        <Txt text="★" x={-360} y={3} fontFamily="Arial" fontSize={30} fill="#B8000C" />
        <Txt
          text="CONFIANÇA"
          x={50}
          y={-14}
          width={680}
          fontFamily="Montserrat"
          fontSize={28}
          fontWeight={900}
          letterSpacing={3}
          textAlign="left"
          fill="#FFFFFF"
        />
        <Txt
          text="Em abrir as portas do seu bairro e confiar em nossa ronda."
          x={50}
          y={22}
          width={680}
          fontFamily="Montserrat"
          fontSize={18}
          fontWeight={500}
          textAlign="left"
          fill="#FFF8EC"
        />
      </Rect>

      {/* Pillar 2: PARCERIA */}
      <Rect
        ref={s2Badge2}
        x={0}
        y={160}
        width={860}
        height={110}
        radius={20}
        fill="#B8000C"
        stroke="#FFD21A"
        lineWidth={2}
        shadowColor="#17171725"
        shadowBlur={16}
        shadowOffsetY={6}
        opacity={0}
      >
        <Circle x={-360} y={0} size={54} fill="#FFD21A" />
        <Txt text="★" x={-360} y={3} fontFamily="Arial" fontSize={30} fill="#B8000C" />
        <Txt
          text="PARCERIA"
          x={50}
          y={-14}
          width={680}
          fontFamily="Montserrat"
          fontSize={28}
          fontWeight={900}
          letterSpacing={3}
          textAlign="left"
          fill="#FFFFFF"
        />
        <Txt
          text="Uma relação construída diariamente com respeito mútuo."
          x={50}
          y={22}
          width={680}
          fontFamily="Montserrat"
          fontSize={18}
          fontWeight={500}
          textAlign="left"
          fill="#FFF8EC"
        />
      </Rect>

      {/* Pillar 3: PREFERÊNCIA */}
      <Rect
        ref={s2Badge3}
        x={0}
        y={300}
        width={860}
        height={110}
        radius={20}
        fill="#B8000C"
        stroke="#FFD21A"
        lineWidth={2}
        shadowColor="#17171725"
        shadowBlur={16}
        shadowOffsetY={6}
        opacity={0}
      >
        <Circle x={-360} y={0} size={54} fill="#FFD21A" />
        <Txt text="★" x={-360} y={3} fontFamily="Arial" fontSize={30} fill="#B8000C" />
        <Txt
          text="PREFERÊNCIA"
          x={50}
          y={-14}
          width={680}
          fontFamily="Montserrat"
          fontSize={28}
          fontWeight={900}
          letterSpacing={3}
          textAlign="left"
          fill="#FFFFFF"
        />
        <Txt
          text="Nos incentivando a manter o mais alto padrão de vigilância."
          x={50}
          y={22}
          width={680}
          fontFamily="Montserrat"
          fontSize={18}
          fontWeight={500}
          textAlign="left"
          fill="#FFF8EC"
        />
      </Rect>
    </Layout>,
  );

  s2Container().opacity(1);
  yield* all(
    fadeUp(s2Heading(), {distance: 30, duration: 0.8}),
    fadeUp(s2MainCard(), {distance: 30, duration: 0.8, delay: 0.2}),
    fadeUp(s2Badge1(), {distance: 25, duration: 0.7, delay: 0.45}),
    fadeUp(s2Badge2(), {distance: 25, duration: 0.7, delay: 0.65}),
    fadeUp(s2Badge3(), {distance: 25, duration: 0.7, delay: 0.85}),
  );

  yield* waitFor(5.75);
  yield* fadeOut(s2Container(), {duration: 0.7, easing: 'easeInOutSine'});
  s2Container().remove();

  // =========================================================================
  // CENA 3: NOSSA HISTÓRIA (15.0s – 23.0s | 8.0s)
  // "VOCÊ FAZ PARTE DA NOSSA HISTÓRIA!"
  // =========================================================================
  const s3Container = createRef<Layout>();
  const s3Title = createRef<Txt>();
  const s3Card1 = createRef<Rect>();
  const s3Card2 = createRef<Rect>();
  const s3Card3 = createRef<Rect>();

  view.add(
    <Layout ref={s3Container} opacity={0}>
      <FestiveHeaderPill />

      {/* Main Title Banner */}
      <ChristmasBanner
        y={-570}
        width={900}
        height={96}
        title="VOCÊ FAZ PARTE DA NOSSA HISTÓRIA!"
        titleColor="#FFD21A"
        fillColor="#B8000C"
        strokeColor="#FFD21A"
      />

      <Txt
        ref={s3Title}
        text="Cada um de vocês é a razão de estarmos nas ruas todas as noites."
        y={-450}
        width={840}
        fontFamily="Montserrat"
        fontSize={25}
        fontWeight={600}
        textAlign="center"
        textWrap={true}
        fill="#171717"
        opacity={0}
      />

      {/* 3 Community Feature Cards */}
      {/* Card 1: União & Comunidade */}
      <Rect
        ref={s3Card1}
        x={0}
        y={-280}
        width={880}
        height={150}
        radius={22}
        fill="#FFFFFF"
        stroke="#E8E0D3"
        lineWidth={1.5}
        shadowColor="#17171718"
        shadowBlur={16}
        shadowOffsetY={6}
        opacity={0}
      >
        <Rect x={-435} y={0} width={8} height={110} radius={4} fill="#B8000C" />
        <Circle x={-360} y={0} size={64} fill="#FFF8EC" stroke="#FFD21A" lineWidth={2} />
        <Txt text="🤝" x={-360} y={2} fontSize={32} />
        <Txt
          text="UNIÃO & COMUNIDADE"
          x={-70}
          y={-26}
          fontFamily="Montserrat"
          fontSize={26}
          fontWeight={800}
          letterSpacing={2}
          fill="#B8000C"
        />
        <Txt
          text="Trabalhamos lado a lado com os moradores para um bairro mais seguro e protegido."
          x={10}
          y={22}
          width={650}
          fontFamily="Montserrat"
          fontSize={19}
          fontWeight={500}
          lineHeight={26}
          fill="#555047"
        />
      </Rect>

      {/* Card 2: Presença Noturna */}
      <Rect
        ref={s3Card2}
        x={0}
        y={-90}
        width={880}
        height={150}
        radius={22}
        fill="#FFFFFF"
        stroke="#E8E0D3"
        lineWidth={1.5}
        shadowColor="#17171718"
        shadowBlur={16}
        shadowOffsetY={6}
        opacity={0}
      >
        <Rect x={-435} y={0} width={8} height={110} radius={4} fill="#FFD21A" />
        <Circle x={-360} y={0} size={64} fill="#FFF8EC" stroke="#C99700" lineWidth={2} />
        <Txt text="🌙" x={-360} y={2} fontSize={32} />
        <Txt
          text="PRESENÇA & CUIDADO"
          x={-80}
          y={-26}
          fontFamily="Montserrat"
          fontSize={26}
          fontWeight={800}
          letterSpacing={2}
          fill="#B8000C"
        />
        <Txt
          text="Vigilância ativa em cada esquina, garantindo o descanso tranquilo da sua família."
          x={10}
          y={22}
          width={650}
          fontFamily="Montserrat"
          fontSize={19}
          fontWeight={500}
          lineHeight={26}
          fill="#555047"
        />
      </Rect>

      {/* Card 3: Gratidão Mútua */}
      <Rect
        ref={s3Card3}
        x={0}
        y={100}
        width={880}
        height={150}
        radius={22}
        fill="#FFFFFF"
        stroke="#E8E0D3"
        lineWidth={1.5}
        shadowColor="#17171718"
        shadowBlur={16}
        shadowOffsetY={6}
        opacity={0}
      >
        <Rect x={-435} y={0} width={8} height={110} radius={4} fill="#173D24" />
        <Circle x={-360} y={0} size={64} fill="#FFF8EC" stroke="#173D24" lineWidth={2} />
        <Txt text="❤️" x={-360} y={2} fontSize={32} />
        <Txt
          text="RECONHECIMENTO MÚTUO"
          x={-50}
          y={-26}
          fontFamily="Montserrat"
          fontSize={26}
          fontWeight={800}
          letterSpacing={2}
          fill="#B8000C"
        />
        <Txt
          text="Agradecemos cada sorriso, cumprimento e palavra de incentivo recebidos nas rondas."
          x={10}
          y={22}
          width={650}
          fontFamily="Montserrat"
          fontSize={19}
          fontWeight={500}
          lineHeight={26}
          fill="#555047"
        />
      </Rect>

      {/* Warm Footer Note */}
      <Rect y={250} width={620} height={48} radius={24} fill="#FFF8EC" stroke="#FFD21A" lineWidth={1.5}>
        <Txt
          text="EQUIPE JORGE LUIZ • COOP RONDA"
          fontFamily="Montserrat"
          fontSize={16}
          fontWeight={800}
          letterSpacing={3}
          fill="#B8000C"
        />
      </Rect>
    </Layout>,
  );

  s3Container().opacity(1);
  yield* all(
    fadeUp(s3Title(), {distance: 25, duration: 0.7}),
    fadeUp(s3Card1(), {distance: 30, duration: 0.75, delay: 0.2}),
    fadeUp(s3Card2(), {distance: 30, duration: 0.75, delay: 0.45}),
    fadeUp(s3Card3(), {distance: 30, duration: 0.75, delay: 0.7}),
  );

  yield* waitFor(5.4);
  yield* fadeOut(s3Container(), {duration: 0.7, easing: 'easeInOutSine'});
  s3Container().remove();

  // =========================================================================
  // CENA 4: CAIXINHA DE NATAL (23.0s – 33.0s | 10.0s)
  // Presente animado abrindo suavemente e revelando a tradição de dezembro
  // =========================================================================
  const s4Container = createRef<Layout>();
  const s4GiftLid = createRef<Layout>();
  const s4GiftGlow = createRef<Circle>();
  const s4Card = createRef<Rect>();
  const s4StarLeft = createRef<Layout>();
  const s4StarRight = createRef<Layout>();

  view.add(
    <Layout ref={s4Container} opacity={0}>
      <FestiveHeaderPill />

      {/* Section Header */}
      <Txt
        text="UMA TRADIÇÃO DE DEZEMBRO"
        y={-600}
        fontFamily="Montserrat"
        fontSize={40}
        fontWeight={900}
        letterSpacing={4}
        fill="#B8000C"
      />

      <Rect y={-540} width={420} height={4} radius={2} fill="#FFD21A" />

      {/* Decorative Golden Stars */}
      <Layout ref={s4StarLeft} x={-320} y={-380} opacity={0}>
        <GoldenStar size={54} />
      </Layout>
      <Layout ref={s4StarRight} x={320} y={-380} opacity={0}>
        <GoldenStar size={54} />
      </Layout>

      {/* 3D Animated Gift Box */}
      <Layout y={-320}>
        <GiftBox lidRef={s4GiftLid} glowRef={s4GiftGlow} scale={1.25} />
      </Layout>

      {/* Main Explanatory Card */}
      <Rect
        ref={s4Card}
        y={80}
        width={880}
        height={380}
        radius={26}
        fill="#FFFFFF"
        stroke="#FFD21A"
        lineWidth={3}
        shadowColor="#17171725"
        shadowBlur={24}
        shadowOffsetY={10}
        opacity={0}
      >
        {/* Highlight Tag: CAIXINHA DE NATAL */}
        <Rect y={-150} width={460} height={52} radius={26} fill="#B8000C">
          <Txt
            text="★  CAIXINHA DE NATAL  ★"
            fontFamily="Montserrat"
            fontSize={22}
            fontWeight={900}
            letterSpacing={3}
            fill="#FFD21A"
          />
        </Rect>

        {/* Traditional Message */}
        <Txt
          text="Tradicionalmente, no mês de dezembro, os clientes costumam contribuir com uma mensalidade extra, como caixinha de Natal."
          y={-30}
          width={800}
          fontFamily="Montserrat"
          fontSize={27}
          fontWeight={600}
          lineHeight={42}
          textAlign="center"
          textWrap={true}
          fill="#171717"
        />

        {/* Recognition Statement */}
        <Rect y={105} width={780} height={70} radius={16} fill="#FFF8EC" stroke="#C99700" lineWidth={1}>
          <Txt
            text="Um gesto fraterno em reconhecimento e valorização ao trabalho da nossa equipe ao longo de todo o ano."
            y={0}
            width={740}
            fontFamily="Montserrat"
            fontSize={19}
            fontWeight={600}
            lineHeight={28}
            textAlign="center"
            textWrap={true}
            fill="#8A0009"
          />
        </Rect>
      </Rect>
    </Layout>,
  );

  s4Container().opacity(1);
  yield* all(
    fadeUp(s4Card(), {distance: 35, duration: 0.85}),
    scaleIn(s4StarLeft(), {duration: 0.8, delay: 0.3}),
    scaleIn(s4StarRight(), {duration: 0.8, delay: 0.45}),
  );

  // Animate the gift lid opening smoothly!
  yield* waitFor(0.8);
  if (s4GiftLid()) {
    yield* all(
      s4GiftLid().position.y(-95, 0.9, easeOutBack),
      s4GiftLid().rotation(-14, 0.9, easeOutBack),
      s4GiftGlow().scale(1.4, 0.9, easeOutCubic),
      s4GiftGlow().opacity(0.35, 0.9, easeOutCubic),
    );
  }

  yield* waitFor(6.75);
  yield* fadeOut(s4Container(), {duration: 0.7, easing: 'easeInOutSine'});
  s4Container().remove();

  // =========================================================================
  // CENA 5: CONTRIBUIÇÃO VOLUNTÁRIA (33.0s – 43.0s | 10.0s) [CENA CRÍTICA]
  // "ESSA CONTRIBUIÇÃO NÃO É OBRIGATÓRIA."
  // Destaque visual máximo de clareza, respeito e tranquilidade
  // =========================================================================
  const s5Container = createRef<Layout>();
  const s5Badge = createRef<Rect>();
  const s5MainCard = createRef<Rect>();
  const s5SubCard = createRef<Rect>();

  view.add(
    <Layout ref={s5Container} opacity={0}>
      <FestiveHeaderPill />

      {/* Respect & Information Badge */}
      <Rect
        ref={s5Badge}
        y={-570}
        width={560}
        height={48}
        radius={24}
        fill="#173D24"
        stroke="#FFD21A"
        lineWidth={2}
        opacity={0}
      >
        <Circle x={-230} y={0} size={10} fill="#FFD21A" />
        <Txt
          text="TRANSPARÊNCIA & RESPEITO"
          x={10}
          y={0}
          fontFamily="Montserrat"
          fontSize={18}
          fontWeight={800}
          letterSpacing={3}
          fill="#FFF8EC"
        />
      </Rect>

      {/* CRITICAL CARD: CONTRIBUIÇÃO NÃO OBRIGATÓRIA */}
      <Rect
        ref={s5MainCard}
        y={-280}
        width={900}
        height={380}
        radius={28}
        fill="#FFFFFF"
        stroke="#B8000C"
        lineWidth={3.5}
        shadowColor="#17171730"
        shadowBlur={26}
        shadowOffsetY={10}
        opacity={0}
      >
        {/* Upper Cardinal Red Attention Stripe */}
        <Rect y={-155} width={900} height={70} radius={[28, 28, 0, 0]} fill="#B8000C">
          <Txt
            text="IMPORTANTE LEMBRAR:"
            y={0}
            fontFamily="Montserrat"
            fontSize={22}
            fontWeight={900}
            letterSpacing={4}
            fill="#FFD21A"
          />
        </Rect>

        {/* PROMINENT TITLE */}
        <Txt
          text="ESSA CONTRIBUIÇÃO NÃO É OBRIGATÓRIA."
          y={-60}
          width={840}
          fontFamily="Montserrat"
          fontSize={38}
          fontWeight={900}
          lineHeight={50}
          textAlign="center"
          textWrap={true}
          fill="#B8000C"
        />

        {/* Decorative Divider */}
        <Line points={[[-320, 10], [320, 10]]} stroke="#FFD21A" lineWidth={2} />

        {/* Explanatory Body */}
        <Txt
          text="Fica inteiramente a critério de cada um, de acordo com suas possibilidades e seu orçamento."
          y={80}
          width={800}
          fontFamily="Montserrat"
          fontSize={28}
          fontWeight={600}
          lineHeight={42}
          textAlign="center"
          textWrap={true}
          fill="#171717"
        />
      </Rect>

      {/* Reassurance Card */}
      <Rect
        ref={s5SubCard}
        y={140}
        width={880}
        height={220}
        radius={24}
        fill="#FFF8EC"
        stroke="#C99700"
        lineWidth={2}
        shadowColor="#17171715"
        shadowBlur={16}
        shadowOffsetY={6}
        opacity={0}
      >
        <Circle x={-360} y={-20} size={50} fill="#B8000C" stroke="#FFD21A" lineWidth={1.5} />
        <Txt text="🛡️" x={-360} y={-20} fontSize={26} />

        <Txt
          text="NOSSO COMPROMISSO PERMANECE INALTERADO"
          x={20}
          y={-50}
          width={680}
          fontFamily="Montserrat"
          fontSize={22}
          fontWeight={800}
          letterSpacing={2}
          fill="#B8000C"
        />

        <Txt
          text="O atendimento, a vigilância e a ronda noturna continuam exatamente com a mesma dedicação, cuidado e carinho de sempre para com você e sua família."
          x={20}
          y={20}
          width={680}
          fontFamily="Montserrat"
          fontSize={19}
          fontWeight={500}
          lineHeight={28}
          textWrap={true}
          fill="#555047"
        />
      </Rect>
    </Layout>,
  );

  s5Container().opacity(1);
  yield* all(
    fadeUp(s5Badge(), {distance: 20, duration: 0.65}),
    fadeUp(s5MainCard(), {distance: 35, duration: 0.85, delay: 0.15}),
    fadeUp(s5SubCard(), {distance: 30, duration: 0.8, delay: 0.4}),
  );

  // Generous reading time for transparency scene (8.1s)
  yield* waitFor(8.1);
  yield* fadeOut(s5Container(), {duration: 0.7, easing: 'easeInOutSine'});
  s5Container().remove();

  // =========================================================================
  // CENA 6: AGRADECIMENTO FINAL (43.0s – 52.0s | 9.0s)
  // "DESDE JÁ, AGRADECEMOS A COMPREENSÃO."
  // =========================================================================
  const s6Container = createRef<Layout>();
  const s6Heading = createRef<Txt>();
  const s6Card = createRef<Rect>();
  const s6StarCenter = createRef<Layout>();

  view.add(
    <Layout ref={s6Container} opacity={0}>
      <FestiveHeaderPill />

      {/* Section Title */}
      <Txt
        ref={s6Heading}
        text="DESDE JÁ, AGRADECEMOS A COMPREENSÃO."
        y={-570}
        width={920}
        fontFamily="Montserrat"
        fontSize={42}
        fontWeight={900}
        lineHeight={56}
        textAlign="center"
        textWrap={true}
        letterSpacing={2}
        fill="#B8000C"
        opacity={0}
      />

      <Rect y={-490} width={380} height={4} radius={2} fill="#FFD21A" />

      {/* Gratitude Medallion Card */}
      <Rect
        ref={s6Card}
        y={-140}
        width={880}
        height={420}
        radius={28}
        fill="#FFFFFF"
        stroke="#FFD21A"
        lineWidth={3}
        shadowColor="#17171722"
        shadowBlur={22}
        shadowOffsetY={8}
        opacity={0}
      >
        {/* Emblem on Top of Card */}
        <Layout y={-110}>
          <Circle size={96} fill="#B8000C" stroke="#FFD21A" lineWidth={3} />
          <Txt text="⭐" y={2} fontSize={44} />
        </Layout>

        <Txt
          text="Nosso sincero reconhecimento e profunda gratidão a cada cliente que faz parte da nossa história."
          y={0}
          width={800}
          fontFamily="Montserrat"
          fontSize={28}
          fontWeight={600}
          lineHeight={44}
          textAlign="center"
          textWrap={true}
          fill="#171717"
        />

        <Line points={[[-300, 80], [300, 80]]} stroke="#E8E0D3" lineWidth={1.5} />

        <Txt
          text="É uma honra cuidar da tranquilidade e da segurança da sua casa."
          y={125}
          width={760}
          fontFamily="Montserrat"
          fontSize={22}
          fontWeight={700}
          textAlign="center"
          fill="#8A0009"
        />
      </Rect>

      {/* Triad of Golden Honor Stars */}
      <Layout y={210}>
        <Layout x={-140}>
          <GoldenStar size={42} />
        </Layout>
        <Layout ref={s6StarCenter}>
          <GoldenStar size={64} />
        </Layout>
        <Layout x={140}>
          <GoldenStar size={42} />
        </Layout>
      </Layout>
    </Layout>,
  );

  s6Container().opacity(1);
  yield* all(
    fadeUp(s6Heading(), {distance: 30, duration: 0.8}),
    fadeUp(s6Card(), {distance: 35, duration: 0.85, delay: 0.25}),
    scaleIn(s6StarCenter(), {duration: 0.8, delay: 0.5, scale: 0.5}),
  );

  yield* waitFor(7.2);
  yield* fadeOut(s6Container(), {duration: 0.7, easing: 'easeInOutSine'});
  s6Container().remove();

  // =========================================================================
  // CENA 7: ASSINATURA FINAL (52.0s – 60.0s | 8.0s)
  // "FELIZ NATAL!" -> EQUIPE JORGE LUIZ — COOP RONDA
  // =========================================================================
  const s7Container = createRef<Layout>();
  const s7Glow = createRef<Circle>();
  const s7Merry = createRef<Txt>();
  const s7Christmas = createRef<Txt>();
  const s7Banner = createRef<Layout>();
  const s7Wishes = createRef<Txt>();
  const s7Year = createRef<Txt>();

  view.add(
    <Layout ref={s7Container} opacity={0}>
      {/* Golden Ambient Halo */}
      <Circle
        ref={s7Glow}
        y={-280}
        size={700}
        fill="#FFD21A"
        opacity={0.12}
      />

      {/* Festive Emblem Centered */}
      <Layout y={-520}>
        <ChristmasEmblem size={220} />
      </Layout>

      {/* "FELIZ" */}
      <Txt
        ref={s7Merry}
        text="DESEJAMOS UM"
        y={-340}
        fontFamily="Montserrat"
        fontSize={30}
        fontWeight={800}
        letterSpacing={8}
        fill="#C99700"
        opacity={0}
      />

      {/* "FELIZ NATAL!" */}
      <Txt
        ref={s7Christmas}
        text="FELIZ NATAL!"
        y={-240}
        fontFamily="Montserrat"
        fontSize={76}
        fontWeight={900}
        letterSpacing={4}
        fill="#B8000C"
        shadowColor="#FFD21A40"
        shadowBlur={16}
        opacity={0}
      />

      {/* Official Signature Banner */}
      <Layout ref={s7Banner} y={-40} opacity={0}>
        <ChristmasBanner
          width={860}
          height={116}
          title="EQUIPE JORGE LUIZ"
          subtitle="COOP RONDA • SEGURANÇA E PATRULHAMENTO"
          titleColor="#FFD21A"
          fillColor="#B8000C"
          strokeColor="#FFD21A"
        />
      </Layout>

      {/* Warm Blessing Note */}
      <Txt
        ref={s7Wishes}
        text="Que a paz, a alegria e a proteção façam morada permanente em seu lar."
        y={110}
        width={800}
        fontFamily="Montserrat"
        fontSize={25}
        fontWeight={600}
        lineHeight={38}
        textAlign="center"
        textWrap={true}
        fill="#171717"
        opacity={0}
      />

      {/* Prosperous New Year Banner */}
      <Rect
        y={210}
        width={680}
        height={56}
        radius={28}
        fill="#173D24"
        stroke="#FFD21A"
        lineWidth={2}
      >
        <Txt
          text="E UM PRÓSPERO ANO NOVO!"
          fontFamily="Montserrat"
          fontSize={22}
          fontWeight={900}
          letterSpacing={4}
          fill="#FFF8EC"
        />
      </Rect>

      <Txt
        ref={s7Year}
        text="BOAS FESTAS  •  2026 / 2027"
        y={300}
        fontFamily="Montserrat"
        fontSize={18}
        fontWeight={800}
        letterSpacing={6}
        fill="#8A0009"
        opacity={0}
      />
    </Layout>,
  );

  s7Container().opacity(1);
  yield* all(
    fadeUp(s7Merry(), {distance: 25, duration: 0.7}),
    fadeUp(s7Christmas(), {distance: 35, duration: 0.8, delay: 0.2}),
    scaleIn(s7Banner(), {duration: 0.8, delay: 0.45, scale: 0.9}),
    fadeUp(s7Wishes(), {distance: 25, duration: 0.75, delay: 0.7}),
    fadeUp(s7Year(), {distance: 20, duration: 0.7, delay: 0.9}),
  );

  // Final hold until 59.0s, then graceful fade to 60.0s
  yield* waitFor(5.3);
  yield* all(
    fadeOut(s7Container(), {duration: 1.0, easing: 'easeInOutSine'}),
    fadeOut(foliageLayer(), {duration: 1.0, easing: 'easeInOutSine'}),
  );
});
