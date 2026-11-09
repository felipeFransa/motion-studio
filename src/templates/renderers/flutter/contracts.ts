import type {StoryboardIR, SceneIR} from '../../types';
import type {ResolvedTheme} from '../../../theme/types';

export interface FlutterColorThemeContract {
  readonly primaryHex: string;
  readonly backgroundHex: string;
  readonly surfaceHex: string;
  readonly textPrimaryHex: string;
  readonly textSecondaryHex: string;
  readonly borderHex: string;
}

export interface FlutterSlideContract {
  readonly slideIndex: number;
  readonly sceneType: string;
  readonly headline?: string;
  readonly bodyText?: string;
  readonly highlightWords?: readonly string[];
  readonly items?: readonly {
    readonly index: number;
    readonly title: string;
    readonly description: string;
    readonly badge?: string;
  }[];
  readonly cta?: string;
  readonly suggestedDurationMs: number;
}

export interface FlutterStoryboardContract {
  readonly formatVersion: '1.0';
  readonly targetPlatform: 'flutter';
  readonly appId: string;
  readonly brandName: string;
  readonly templateId: string;
  readonly contentType: 'feed_post' | 'carousel' | 'story' | 'video';
  readonly theme: FlutterColorThemeContract;
  readonly slides: readonly FlutterSlideContract[];
}

export function exportFlutterContract(
  ir: StoryboardIR,
  theme: ResolvedTheme,
): FlutterStoryboardContract {
  const slides: FlutterSlideContract[] = ir.scenes.map((scene, idx) => {
    switch (scene.type) {
      case 'title_reveal':
        return {
          slideIndex: idx,
          sceneType: scene.type,
          headline: scene.headline,
          highlightWords: scene.highlightWords,
          bodyText: scene.contextTag,
          suggestedDurationMs: Math.round(scene.durationSeconds * 1000),
        };
      case 'cards_sequence':
        return {
          slideIndex: idx,
          sceneType: scene.type,
          headline: scene.title,
          bodyText: scene.subtitle,
          items: scene.items.map((it, itemIdx) => ({
            index: itemIdx + 1,
            title: it.title,
            description: it.description,
            badge: it.number,
          })),
          suggestedDurationMs: Math.round(scene.durationSeconds * 1000),
        };
      case 'myth_fact_comparison':
        return {
          slideIndex: idx,
          sceneType: scene.type,
          headline: scene.title,
          items: [
            {index: 1, title: 'MITO', description: `${scene.mythStatement} — ${scene.mythExplanation}`, badge: 'MITO'},
            {index: 2, title: 'VERDADE', description: `${scene.factStatement} — ${scene.factExplanation}`, badge: 'FATO'},
          ],
          suggestedDurationMs: Math.round(scene.durationSeconds * 1000),
        };
      case 'timeline_steps':
        return {
          slideIndex: idx,
          sceneType: scene.type,
          headline: scene.title,
          bodyText: scene.subtitle,
          items: scene.steps.map((st, stepIdx) => ({
            index: stepIdx + 1,
            title: st.title,
            description: st.description,
            badge: st.stepNumber,
          })),
          suggestedDurationMs: Math.round(scene.durationSeconds * 1000),
        };
      case 'closing_cta':
        return {
          slideIndex: idx,
          sceneType: scene.type,
          headline: scene.callToAction,
          bodyText: scene.subMessage,
          cta: scene.callToAction,
          suggestedDurationMs: Math.round(scene.durationSeconds * 1000),
        };
      default:
        return {
          slideIndex: idx,
          sceneType: (scene as SceneIR).type,
          headline: (scene as SceneIR).title,
          suggestedDurationMs: Math.round(scene.durationSeconds * 1000),
        };
    }
  });

  return {
    formatVersion: '1.0',
    targetPlatform: 'flutter',
    appId: ir.brand.id,
    brandName: ir.brand.name,
    templateId: ir.templateId,
    contentType: ir.contentType,
    theme: {
      primaryHex: theme.palette.primary,
      backgroundHex: theme.palette.background,
      surfaceHex: theme.palette.surface,
      textPrimaryHex: theme.palette.textPrimary,
      textSecondaryHex: theme.palette.textSecondary,
      borderHex: theme.palette.border,
    },
    slides: Object.freeze(slides),
  };
}
