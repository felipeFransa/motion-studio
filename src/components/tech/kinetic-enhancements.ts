import {Layout, Rect, type Txt} from '@motion-canvas/2d';
import {
  all,
  easeInOutCubic,
  easeInOutSine,
  easeOutCubic,
  type ThreadGenerator,
  waitFor,
} from '@motion-canvas/core';
import type {KineticTitleInstance} from '../kinetic-title/types';

export interface VisualTextSelectionOptions {
  readonly selectionColor?: string;
  readonly textColor?: string;
  readonly duration?: number;
}

/**
 * Anima uma "caixa de seleção visual de texto", simulando o cursor / seleção
 * de texto tecnológico sobre uma palavra ou termo específico.
 */
export function* visualTextSelection(
  wordNode: Txt,
  options: VisualTextSelectionOptions = {},
): ThreadGenerator {
  const selectionColor = options.selectionColor ?? 'rgba(56, 189, 248, 0.28)';
  const duration = options.duration ?? 0.6;

  const parent = wordNode.parent() as Layout | null;
  if (!parent) return;

  const bounds = wordNode.size();
  const highlightBox = new Rect({
    x: wordNode.x(),
    y: wordNode.y(),
    width: 0,
    height: bounds.y + 12,
    radius: 4,
    fill: selectionColor,
    stroke: 'rgba(56, 189, 248, 0.6)',
    lineWidth: 1,
    opacity: 0,
  });

  // Insere atrás do texto
  parent.add(highlightBox);
  highlightBox.moveToBottom();

  // Expande a seleção da esquerda para a direita
  yield* all(
    highlightBox.opacity(1, duration * 0.3, easeOutCubic),
    highlightBox.width(bounds.x + 16, duration, easeOutCubic),
  );
}

/**
 * Transição cinematográfica e suave entre dois títulos cinéticos.
 * O título anterior faz slide/fade out enquanto o novo título surge.
 */
export function* transitionTitles(
  fromTitle: KineticTitleInstance,
  toTitle: KineticTitleInstance,
  options: {duration?: number; stagger?: number} = {},
): ThreadGenerator {
  const duration = options.duration ?? 0.8;
  const stagger = options.stagger ?? 0.2;

  yield* fromTitle.exit(duration * 0.6);
  yield* toTitle.play();
}

/**
 * Revelação progressiva de caracteres (efeito decodificador / terminal tech).
 */
export function* progressiveRevealText(
  txtNode: Txt,
  finalText: string,
  options: {duration?: number; scrambleChars?: string} = {},
): ThreadGenerator {
  const duration = options.duration ?? 0.9;
  const totalSteps = finalText.length;
  if (totalSteps === 0) return;

  const stepTime = Math.max(0.02, duration / totalSteps);
  const chars = options.scrambleChars ?? '01ABCDEF_';

  for (let i = 1; i <= totalSteps; i++) {
    const revealed = finalText.slice(0, i);
    const trail = i < totalSteps ? chars[i % chars.length] : '';
    txtNode.text(revealed + trail);
    yield* waitFor(stepTime);
  }
  txtNode.text(finalText);
}
