import type {AppBrand} from '../brand/types';
import type {ComparisonOptions} from '../components/comparison/types';
import type {FeatureCardsOptions} from '../components/feature-cards/types';
import type {KineticTitleOptions} from '../components/kinetic-title/types';
import type {StatCardOptions} from '../components/stat-card/types';
import type {TimelineOptions} from '../components/timeline/types';
import {getThemePreset, THEME_PRESETS} from './presets';
import type {
  ResolvedTheme,
  ThemePalette,
  ThemePreset,
  ThemePresetId,
  ThemeTypography,
  ThemeMotion,
} from './types';

export class ThemeEngine {
  public static resolve(brand: AppBrand, presetId: ThemePresetId = 'editorial_premium'): ResolvedTheme {
    const preset: ThemePreset = THEME_PRESETS[presetId] ?? getThemePreset('editorial_premium');
    const palette: ThemePalette = preset.createPalette(brand);
    const typography: ThemeTypography = preset.createTypography(brand);
    const motion: ThemeMotion = preset.createMotion(brand);

    return {
      themeId: preset.id,
      brandId: brand.id,
      brandName: brand.name,
      isDark: preset.isDark,
      palette,
      typography,
      motion,

      forKineticTitle(options: Partial<KineticTitleOptions> & {text: string}): KineticTitleOptions {
        const anim = options.animation ?? {};
        const baseDuration = anim.duration ?? 1.1;
        const baseStagger = anim.stagger ?? 0.12;

        return {
          component: 'kinetic_title',
          variant: options.variant ?? 'editorial_reveal',
          text: options.text,
          highlightWords: options.highlightWords ?? [],
          fontSize: options.fontSize ?? 84,
          fontWeight: options.fontWeight ?? typography.headingWeight,
          fontFamily: options.fontFamily ?? typography.fontFamily,
          color: options.color ?? palette.textPrimary,
          highlightColor: options.highlightColor ?? palette.primary,
          alignment: options.alignment ?? 'center',
          maxWidth: options.maxWidth ?? 920,
          x: options.x ?? 0,
          y: options.y ?? 0,
          letterSpacing: options.letterSpacing ?? typography.letterSpacing,
          animation: {
            duration: baseDuration * motion.durationMultiplier,
            stagger: baseStagger * motion.staggerMultiplier,
            distance: anim.distance ?? 36,
            easing: anim.easing ?? motion.defaultEasing,
            direction: anim.direction ?? 'up',
          },
        };
      },

      forStatCard(options: Partial<StatCardOptions> & {value: number}): StatCardOptions {
        const anim = options.animation ?? {};
        const baseDuration = anim.duration ?? 1.05;

        return {
          component: 'stat_card',
          variant: options.variant ?? 'counter_impact',
          value: options.value,
          startValue: options.startValue ?? 0,
          prefix: options.prefix,
          suffix: options.suffix ?? '%',
          title: options.title ?? '',
          description: options.description ?? '',
          color: options.color ?? palette.textPrimary,
          accentColor: options.accentColor ?? palette.primary,
          backgroundColor: options.backgroundColor ?? palette.surface,
          progressColor: options.progressColor ?? palette.primary,
          trackColor: options.trackColor ?? palette.border,
          fontSize: options.fontSize ?? 130,
          alignment: options.alignment ?? 'center',
          x: options.x ?? 0,
          y: options.y ?? 40,
          width: options.width ?? 900,
          height: options.height ?? 560,
          animation: {
            duration: baseDuration * motion.durationMultiplier,
            easing: anim.easing ?? motion.defaultEasing,
          },
        };
      },

      forComparison(
        options: Partial<ComparisonOptions> & {leftValue: number; rightValue: number},
      ): ComparisonOptions {
        return {
          component: 'comparison',
          variant: options.variant ?? 'data_comparison',
          title: options.title ?? 'ANTES VS. DEPOIS',
          subtitle: options.subtitle,
          leftLabel: options.leftLabel ?? 'Antes',
          leftValue: options.leftValue,
          leftColor: options.leftColor ?? palette.textSecondary,
          rightLabel: options.rightLabel ?? 'Depois',
          rightValue: options.rightValue,
          rightColor: options.rightColor ?? palette.primary,
          accentColor: options.accentColor ?? palette.primaryDark,
          backgroundColor: options.backgroundColor ?? palette.surface,
          valueFormat: options.valueFormat ?? 'percent',
          suffix: options.suffix ?? '%',
          showDifference: options.showDifference ?? true,
          highlightResult: options.highlightResult ?? 'higher',
          chartOrientation: options.chartOrientation ?? 'vertical',
          alignment: options.alignment ?? 'center',
          x: options.x ?? 0,
          y: options.y ?? 40,
          width: options.width ?? 920,
          height: options.height ?? 680,
          duration: (options.duration ?? 0.55) * motion.durationMultiplier,
          easing: options.easing ?? motion.defaultEasing,
        };
      },

      forFeatureCards(
        options: Partial<FeatureCardsOptions> & {cards: FeatureCardsOptions['cards']},
      ): FeatureCardsOptions {
        const themedCards = options.cards.map((c) => ({
          ...c,
          accentColor: c.accentColor ?? palette.primary,
        }));

        return {
          component: 'feature_cards',
          variant: options.variant ?? 'sequential_reveal',
          title: options.title ?? 'DIFERENCIAIS',
          subtitle: options.subtitle,
          cards: themedCards,
          maxWidth: options.maxWidth ?? 920,
          backgroundColor: options.backgroundColor ?? palette.surface,
          accentColor: options.accentColor ?? palette.primary,
          primaryColor: options.primaryColor ?? palette.textPrimary,
          secondaryColor: options.secondaryColor ?? palette.textSecondary,
          stagger: (options.stagger ?? 0.16) * motion.staggerMultiplier,
          duration: (options.duration ?? 0.8) * motion.durationMultiplier,
          easing: options.easing ?? motion.defaultEasing,
          x: options.x ?? 0,
          y: options.y ?? 20,
        };
      },

      forTimeline(options: Partial<TimelineOptions> & {events: TimelineOptions['events']}): TimelineOptions {
        return {
          component: 'timeline',
          variant: options.variant ?? 'vertical_timeline',
          title: options.title ?? 'CRONOGRAMA',
          subtitle: options.subtitle,
          events: options.events,
          primaryColor: options.primaryColor ?? palette.textPrimary,
          accentColor: options.accentColor ?? palette.primary,
          backgroundColor: options.backgroundColor ?? palette.surface,
          x: options.x ?? 0,
          y: options.y ?? 0,
          width: options.width ?? 920,
          height: options.height ?? 1100,
          duration: (options.duration ?? 0.8) * motion.durationMultiplier,
          stagger: (options.stagger ?? 0.15) * motion.staggerMultiplier,
          easing: options.easing ?? motion.defaultEasing,
        };
      },
    };
  }
}

export function resolveTheme(brand: AppBrand, presetId: ThemePresetId = 'editorial_premium'): ResolvedTheme {
  return ThemeEngine.resolve(brand, presetId);
}
