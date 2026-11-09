import {
  Circle,
  Layout,
  Rect,
  Txt,
  type View2D,
} from '@motion-canvas/2d';
import {
  all,
  createRef,
  type ThreadGenerator,
  waitFor,
} from '@motion-canvas/core';
import type {ResolvedTheme} from '../../../theme/types';
import type {
  StoryboardIR,
  TitleRevealSceneIR,
  CardsSequenceSceneIR,
  MythFactComparisonSceneIR,
  TimelineStepsSceneIR,
  ClosingCtaSceneIR,
  CommercialOfferSceneIR,
} from '../../types';
import {KineticTitle} from '../../../components/kinetic-title';
import {FeatureCards} from '../../../components/feature-cards';
import {Timeline} from '../../../components/timeline';

export interface MotionCanvasStoryboardController {
  play(): ThreadGenerator;
}

export function renderStoryboardToMotionCanvas(
  ir: StoryboardIR,
  theme: ResolvedTheme,
  view: View2D,
): MotionCanvasStoryboardController {
  // Master Background
  view.add(
    <Rect
      width={1080}
      height={1920}
      fill={theme.palette.background}
    />,
  );

  // Soft Ambient Radial/Grid Accent
  const ambientGlow = createRef<Circle>();
  view.add(
    <Circle
      ref={ambientGlow}
      size={900}
      fill={theme.palette.primary}
      opacity={theme.isDark ? 0.04 : 0.06}
      y={-200}
    />,
  );

  // Build each scene container
  const sceneRenderers = ir.scenes.map((scene, sceneIndex) => {
    const sceneContainer = createRef<Layout>();

    switch (scene.type) {
      case 'title_reveal': {
        const s = scene as TitleRevealSceneIR;
        const brandPill = createRef<Rect>();
        const headlineFontSize =
          s.headline.length > 40 ? 46 : s.headline.length > 25 ? 54 : 68;
        const titleInst = KineticTitle(
          theme.forKineticTitle({
            text: s.headline,
            highlightWords: s.highlightWords,
            y: 0,
            fontSize: headlineFontSize,
            maxWidth: 900,
          }),
        );

        view.add(
          <Layout ref={sceneContainer} opacity={0}>
            {/* Top Brand Pill */}
            <Rect
              ref={brandPill}
              y={-700}
              width={560}
              height={44}
              radius={22}
              fill={theme.palette.surface}
              stroke={theme.palette.border}
              lineWidth={1.5}
              opacity={0}
            >
              <Circle x={-225} y={0} size={12} fill={theme.palette.primary} />
              <Txt
                text={ir.brand.name.toUpperCase()}
                x={-50}
                y={0}
                fontFamily={theme.typography.fontFamily}
                fontSize={17}
                fontWeight={theme.typography.headingWeight}
                letterSpacing={2.5}
                fill={theme.palette.textPrimary}
              />
              <Rect x={135} y={0} width={2} height={16} fill={theme.palette.border} />
              <Txt
                text={ir.niche.name.split('&')[0].trim().toUpperCase()}
                x={195}
                y={0}
                fontFamily={theme.typography.fontFamily}
                fontSize={14}
                fontWeight={700}
                letterSpacing={2}
                fill={theme.palette.primary}
              />
            </Rect>

            {titleInst.node}
          </Layout>,
        );

        return {
          *play(): ThreadGenerator {
            sceneContainer().opacity(1);
            yield* brandPill().opacity(1, 0.4);
            yield* titleInst.play();
            yield* waitFor(1.2);
          },
          *exit(): ThreadGenerator {
            yield* sceneContainer().opacity(0, 0.35);
          },
        };
      }

      case 'cards_sequence': {
        const s = scene as CardsSequenceSceneIR;
        const headerPill = createRef<Rect>();
        const sectionTitle = createRef<Txt>();
        const sectionSubtitle = createRef<Txt>();

        const featureCardsInst = FeatureCards(
          theme.forFeatureCards({
            title: '',
            cards: s.items.map((it, idx) => ({
              id: `card_${idx}`,
              number: it.number ?? `0${idx + 1}`,
              title: it.title,
              description: it.description,
              icon: (it.icon as any) ?? 'spark',
              accentColor: theme.palette.primary,
            })),
            y: 40,
            maxWidth: 920,
          }),
        );

        view.add(
          <Layout ref={sceneContainer} opacity={0}>
            {/* Top Brand Pill */}
            <Rect
              ref={headerPill}
              y={-700}
              width={560}
              height={44}
              radius={22}
              fill={theme.palette.surface}
              stroke={theme.palette.border}
              lineWidth={1.5}
            >
              <Circle x={-225} y={0} size={12} fill={theme.palette.primary} />
              <Txt
                text={ir.brand.name.toUpperCase()}
                x={-50}
                y={0}
                fontFamily={theme.typography.fontFamily}
                fontSize={17}
                fontWeight={theme.typography.headingWeight}
                letterSpacing={2.5}
                fill={theme.palette.textPrimary}
              />
              <Rect x={135} y={0} width={2} height={16} fill={theme.palette.border} />
              <Txt
                text={ir.niche.name.split('&')[0].trim().toUpperCase()}
                x={195}
                y={0}
                fontFamily={theme.typography.fontFamily}
                fontSize={14}
                fontWeight={700}
                letterSpacing={2}
                fill={theme.palette.primary}
              />
            </Rect>

            {s.title ? (
              <Txt
                ref={sectionTitle}
                text={s.title.toUpperCase()}
                y={-540}
                width={900}
                fontFamily={theme.typography.fontFamily}
                fontSize={38}
                fontWeight={900}
                textAlign="center"
                letterSpacing={2}
                fill={theme.palette.textPrimary}
                opacity={0}
              />
            ) : null}

            {s.subtitle ? (
              <Txt
                ref={sectionSubtitle}
                text={s.subtitle}
                y={-470}
                width={860}
                fontFamily={theme.typography.fontFamily}
                fontSize={22}
                fontWeight={500}
                textAlign="center"
                fill={theme.palette.textSecondary}
                opacity={0}
              />
            ) : null}

            {featureCardsInst.node}
          </Layout>,
        );

        return {
          *play(): ThreadGenerator {
            sceneContainer().opacity(1);
            if (sectionTitle()) {
              yield* sectionTitle().opacity(1, 0.35);
            }
            if (sectionSubtitle()) {
              yield* sectionSubtitle().opacity(1, 0.35);
            }
            yield* featureCardsInst.play();
            yield* waitFor(1.5);
          },
          *exit(): ThreadGenerator {
            yield* sceneContainer().opacity(0, 0.35);
          },
        };
      }

      case 'myth_fact_comparison': {
        const s = scene as MythFactComparisonSceneIR;
        const mythCard = createRef<Rect>();
        const factCard = createRef<Rect>();
        const sectionTitle = createRef<Txt>();

        view.add(
          <Layout ref={sceneContainer} opacity={0}>
            {/* Header Title */}
            <Txt
              ref={sectionTitle}
              text="MITO  VS.  VERDADE"
              y={-540}
              fontFamily={theme.typography.fontFamily}
              fontSize={44}
              fontWeight={900}
              letterSpacing={4}
              fill={theme.palette.textPrimary}
              opacity={0}
            />

            {/* MYTH CARD (Red Alert Accent) */}
            <Rect
              ref={mythCard}
              y={-220}
              width={900}
              height={260}
              radius={24}
              fill={theme.isDark ? '#1C1215' : '#FFF5F5'}
              stroke="#EF4444"
              lineWidth={2}
              opacity={0}
            >
              <Rect x={-340} y={-75} width={100} height={32} radius={16} fill="#EF4444">
                <Txt
                  text="MITO"
                  fontFamily={theme.typography.fontFamily}
                  fontSize={16}
                  fontWeight={900}
                  letterSpacing={2}
                  fill="#FFFFFF"
                />
              </Rect>
              <Txt
                text={`"${s.mythStatement}"`}
                x={0}
                y={-25}
                width={800}
                fontFamily={theme.typography.fontFamily}
                fontSize={28}
                fontWeight={800}
                textAlign="center"
                fill={theme.isDark ? '#FFA4A4' : '#991B1B'}
              />
              <Txt
                text={s.mythExplanation}
                x={0}
                y={50}
                width={800}
                fontFamily={theme.typography.fontFamily}
                fontSize={21}
                fontWeight={500}
                textAlign="center"
                textWrap={true}
                fill={theme.palette.textSecondary}
              />
            </Rect>

            {/* FACT CARD (Theme Primary Accent) */}
            <Rect
              ref={factCard}
              y={140}
              width={900}
              height={280}
              radius={24}
              fill={theme.palette.surface}
              stroke={theme.palette.primary}
              lineWidth={2.5}
              opacity={0}
            >
              <Rect x={-340} y={-85} width={120} height={32} radius={16} fill={theme.palette.primary}>
                <Txt
                  text="FATO REAL"
                  fontFamily={theme.typography.fontFamily}
                  fontSize={15}
                  fontWeight={900}
                  letterSpacing={2}
                  fill={theme.palette.textOnPrimary}
                />
              </Rect>
              <Txt
                text={s.factStatement}
                x={0}
                y={-30}
                width={800}
                fontFamily={theme.typography.fontFamily}
                fontSize={30}
                fontWeight={900}
                textAlign="center"
                fill={theme.palette.textPrimary}
              />
              <Txt
                text={s.factExplanation}
                x={0}
                y={55}
                width={800}
                fontFamily={theme.typography.fontFamily}
                fontSize={22}
                fontWeight={500}
                textAlign="center"
                textWrap={true}
                fill={theme.palette.textSecondary}
              />
            </Rect>
          </Layout>,
        );

        return {
          *play(): ThreadGenerator {
            sceneContainer().opacity(1);
            yield* sectionTitle().opacity(1, 0.4);
            yield* all(
              mythCard().opacity(1, 0.5),
              mythCard().y(-200, 0.5),
            );
            yield* waitFor(0.2);
            yield* all(
              factCard().opacity(1, 0.5),
              factCard().y(120, 0.5),
            );
            yield* waitFor(1.6);
          },
          *exit(): ThreadGenerator {
            yield* sceneContainer().opacity(0, 0.35);
          },
        };
      }

      case 'timeline_steps': {
        const s = scene as TimelineStepsSceneIR;
        const timelineInst = Timeline(
          theme.forTimeline({
            title: s.title ?? 'ETAPAS DO MÉTODO',
            subtitle: s.subtitle,
            variant: 'process_steps',
            events: s.steps.map((st, idx) => ({
              id: `step_${idx}`,
              date: st.dateOrPhase ?? `0${idx + 1}`,
              title: st.title,
              description: st.description,
            })),
            y: 0,
            width: 900,
          }),
        );

        view.add(
          <Layout ref={sceneContainer} opacity={0}>
            {timelineInst.node}
          </Layout>,
        );

        return {
          *play(): ThreadGenerator {
            sceneContainer().opacity(1);
            yield* timelineInst.play();
            yield* waitFor(1.5);
          },
          *exit(): ThreadGenerator {
            yield* sceneContainer().opacity(0, 0.35);
          },
        };
      }

      case 'commercial_offer': {
        const s = scene as CommercialOfferSceneIR;
        const cardRef = createRef<Rect>();

        view.add(
          <Layout ref={sceneContainer} opacity={0}>
            <Rect
              ref={cardRef}
              y={0}
              width={900}
              height={500}
              radius={28}
              fill={theme.palette.surface}
              stroke={theme.palette.primary}
              lineWidth={2.5}
            >
              <Txt
                text={s.serviceTitle.toUpperCase()}
                x={0}
                y={-170}
                fontFamily={theme.typography.fontFamily}
                fontSize={32}
                fontWeight={900}
                letterSpacing={3}
                fill={theme.palette.textPrimary}
              />
              <Txt
                text={s.pricingLabel}
                x={0}
                y={-70}
                fontFamily={theme.typography.fontFamily}
                fontSize={24}
                fontWeight={700}
                fill={theme.palette.textSecondary}
              />
              <Txt
                text={s.pricingValue}
                x={0}
                y={20}
                fontFamily={theme.typography.fontFamily}
                fontSize={64}
                fontWeight={900}
                letterSpacing={2}
                fill={theme.palette.primary}
              />
              {s.pricingDisclaimer ? (
                <Txt
                  text={s.pricingDisclaimer}
                  x={0}
                  y={130}
                  width={800}
                  fontFamily={theme.typography.fontFamily}
                  fontSize={19}
                  fontWeight={500}
                  textAlign="center"
                  fill={theme.palette.textSecondary}
                />
              ) : null}
            </Rect>
          </Layout>,
        );

        return {
          *play(): ThreadGenerator {
            sceneContainer().opacity(1);
            yield* cardRef().opacity(1, 0.4);
            yield* waitFor(1.4);
          },
          *exit(): ThreadGenerator {
            yield* sceneContainer().opacity(0, 0.35);
          },
        };
      }

      case 'closing_cta': {
        const s = scene as ClosingCtaSceneIR;
        const ctaCard = createRef<Rect>();
        const trustBadgeRef = createRef<Rect>();

        view.add(
          <Layout ref={sceneContainer} opacity={0}>
            <Rect
              ref={ctaCard}
              y={-40}
              width={860}
              height={360}
              radius={32}
              fill={theme.palette.surface}
              stroke={theme.palette.border}
              lineWidth={2}
            >
              <Txt
                text={s.callToAction}
                x={0}
                y={-60}
                width={780}
                fontFamily={theme.typography.fontFamily}
                fontSize={42}
                fontWeight={900}
                textAlign="center"
                fill={theme.palette.textPrimary}
              />
              {s.subMessage ? (
                <Txt
                  text={s.subMessage}
                  x={0}
                  y={30}
                  width={760}
                  fontFamily={theme.typography.fontFamily}
                  fontSize={23}
                  fontWeight={600}
                  textAlign="center"
                  fill={theme.palette.textSecondary}
                />
              ) : null}
              {s.contactPhone ? (
                <Txt
                  text={s.contactPhone}
                  x={0}
                  y={100}
                  fontFamily={theme.typography.fontFamily}
                  fontSize={36}
                  fontWeight={900}
                  letterSpacing={2}
                  fill={theme.palette.primary}
                />
              ) : null}
            </Rect>

            {s.trustBadge ? (
              <Rect
                ref={trustBadgeRef}
                y={220}
                width={620}
                height={52}
                radius={26}
                fill={theme.palette.primary}
              >
                <Txt
                  text={s.trustBadge.toUpperCase()}
                  fontFamily={theme.typography.fontFamily}
                  fontSize={17}
                  fontWeight={800}
                  letterSpacing={2}
                  fill={theme.palette.textOnPrimary}
                />
              </Rect>
            ) : null}
          </Layout>,
        );

        return {
          *play(): ThreadGenerator {
            sceneContainer().opacity(1);
            yield* ctaCard().opacity(1, 0.4);
            if (trustBadgeRef()) {
              yield* trustBadgeRef().opacity(1, 0.4);
            }
            yield* waitFor(1.5);
          },
          *exit(): ThreadGenerator {
            yield* sceneContainer().opacity(0, 0.35);
          },
        };
      }

      default: {
        return {
          *play(): ThreadGenerator {
            yield* waitFor(1);
          },
          *exit(): ThreadGenerator {
            yield* waitFor(0.1);
          },
        };
      }
    }
  });

  return {
    *play(): ThreadGenerator {
      for (const sceneRunner of sceneRenderers) {
        yield* sceneRunner.play();
        yield* sceneRunner.exit();
        yield* waitFor(0.1);
      }
    },
  };
}
