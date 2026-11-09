import {
  easeInCubic,
  easeInOutCubic,
  easeInOutSine,
  easeOutBack,
  easeOutCubic,
  easeOutExpo,
  easeOutQuint,
  type TimingFunction,
} from '@motion-canvas/core';

export {
  easeInCubic,
  easeInOutCubic,
  easeInOutSine,
  easeOutBack,
  easeOutCubic,
  easeOutExpo,
  easeOutQuint,
};

export const easingFunctions = {
  easeOutCubic,
  easeInCubic,
  easeInOutCubic,
  easeOutQuint,
  easeOutExpo,
  easeInOutSine,
  easeOutBack,
} satisfies Record<string, TimingFunction>;

export type EasingName = keyof typeof easingFunctions;

export function resolveEasing(easing: EasingName = 'easeOutCubic'): TimingFunction {
  return easingFunctions[easing];
}
