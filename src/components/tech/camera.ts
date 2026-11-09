import {Camera, Node} from '@motion-canvas/2d';
import {
  all,
  easeInOutCubic,
  easeInOutSine,
  type PossibleVector2,
  type ThreadGenerator,
  type TimingFunction,
  type Vector2,
} from '@motion-canvas/core';

export type CameraPresetName =
  | 'slow_zoom_in'
  | 'slow_zoom_out'
  | 'pan_left'
  | 'pan_right'
  | 'focus_element'
  | 'cinematic_reveal'
  | 'reset_camera';

export interface CameraMotionOptions {
  readonly duration?: number;
  readonly timing?: TimingFunction;
}

export interface ZoomMotionOptions extends CameraMotionOptions {
  /** Relative multiplier (e.g. 1.15 = zoom in 15%, 0.85 = zoom out 15%) or absolute zoom if specified. */
  readonly factor?: number;
  /** Absolute target zoom if supplied, overrides factor. */
  readonly targetZoom?: number;
}

export interface PanMotionOptions extends CameraMotionOptions {
  /** Pixel distance to shift the camera viewport. */
  readonly distance?: number;
}

export interface FocusElementOptions extends CameraMotionOptions {
  /** Target zoom when centering on the node. Defaults to 1.25. */
  readonly zoom?: number;
  /** Optional pixel offset from the element center [x, y]. */
  readonly offset?: readonly [number, number];
}

export interface CinematicRevealOptions extends CameraMotionOptions {
  /** Starting zoom level. Defaults to 0.88. */
  readonly startZoom?: number;
  /** Final zoom level. Defaults to 1.0. */
  readonly endZoom?: number;
  /** Optional starting offset [x, y] to pan back to [0, 0]. */
  readonly startOffset?: readonly [number, number];
}

/**
 * Interface unifying Motion Canvas Camera and Virtual World Stage Camera.
 * Operates exclusively on the world container without scaling individual elements.
 */
export interface TechCameraInstance {
  readonly stage: Node;
  zoom(): number;
  zoom(value: number): void;
  zoom(value: number, duration: number, timing?: TimingFunction): ThreadGenerator;
  zoom(value?: number, duration?: number, timing?: TimingFunction): number | void | ThreadGenerator;
  position(): {x: number; y: number};
  position(value: PossibleVector2): void;
  position(value: PossibleVector2, duration: number, timing?: TimingFunction): ThreadGenerator;
  position(value?: PossibleVector2, duration?: number, timing?: TimingFunction): {x: number; y: number} | void | ThreadGenerator;
  centerOn(target: Node | readonly [number, number], duration?: number, timing?: TimingFunction): ThreadGenerator;
  reset(duration?: number, timing?: TimingFunction): ThreadGenerator;
}

export type CameraLike = Camera | TechCameraInstance;

/**
 * Creates a Virtual World Camera container that operates seamlessly without
 * sub-canvas clipping or unparented scene graph boundaries.
 */
export function createTechCamera(initialZoom = 1.0): TechCameraInstance {
  const stage = new Node({scale: initialZoom});
  let currentZoom = initialZoom;

  const instance: TechCameraInstance = {
    stage,
    zoom(value?: number, duration?: number, timing: TimingFunction = easeInOutCubic): any {
      if (value === undefined) {
        return currentZoom;
      }
      currentZoom = value;
      if (duration !== undefined && duration > 0) {
        return stage.scale(value, duration, timing);
      }
      stage.scale(value);
      return undefined;
    },
    position(value?: any, duration?: number, timing: TimingFunction = easeInOutCubic): any {
      if (value === undefined) {
        const p = stage.position();
        return {x: -p.x, y: -p.y};
      }
      const targetPos: [number, number] = Array.isArray(value)
        ? [-value[0], -value[1]]
        : typeof value === 'object' && 'x' in value
          ? [-value.x, -value.y]
          : [0, 0];
      if (duration !== undefined && duration > 0) {
        return stage.position(targetPos, duration, timing);
      }
      stage.position(targetPos);
      return undefined;
    },
    *centerOn(target: Node | readonly [number, number], duration = 1.0, timing = easeInOutCubic): ThreadGenerator {
      const targetPos = target instanceof Node ? target.position() : {x: target[0], y: target[1]};
      yield* stage.position([-targetPos.x, -targetPos.y], duration, timing);
    },
    *reset(duration = 1.0, timing = easeInOutCubic): ThreadGenerator {
      currentZoom = 1.0;
      yield* all(
        stage.scale(1.0, duration, timing),
        stage.position([0, 0], duration, timing),
        stage.rotation(0, duration, timing),
      );
    },
  };

  return instance;
}

/**
 * Helper to call camera.zoom whether on Camera or TechCameraInstance
 */
function tweenZoom(
  camera: CameraLike,
  targetZoom: number,
  duration: number,
  timing: TimingFunction,
): ThreadGenerator {
  if (camera instanceof Camera) {
    return camera.zoom(targetZoom, duration, timing);
  }
  return camera.zoom(targetZoom, duration, timing) as ThreadGenerator;
}

/**
 * Preset: slow_zoom_in
 * Smooth, controlled zoom into the current focus point.
 */
export function* slow_zoom_in(
  camera: CameraLike,
  options: ZoomMotionOptions = {},
): ThreadGenerator {
  const duration = options.duration ?? 3.0;
  const timing = options.timing ?? easeInOutSine;
  const currentZoom = camera.zoom();
  const targetZoom = options.targetZoom ?? currentZoom * (options.factor ?? 1.15);

  yield* tweenZoom(camera, targetZoom, duration, timing);
}

/**
 * Preset: slow_zoom_out
 * Pulls back gradually to reveal broader context.
 */
export function* slow_zoom_out(
  camera: CameraLike,
  options: ZoomMotionOptions = {},
): ThreadGenerator {
  const duration = options.duration ?? 3.0;
  const timing = options.timing ?? easeInOutSine;
  const currentZoom = camera.zoom();
  const targetZoom = options.targetZoom ?? currentZoom * (options.factor ?? 0.85);

  yield* tweenZoom(camera, targetZoom, duration, timing);
}

/**
 * Preset: pan_left
 * Glides camera viewpoint towards the left.
 */
export function* pan_left(
  camera: CameraLike,
  options: PanMotionOptions = {},
): ThreadGenerator {
  const duration = options.duration ?? 2.0;
  const distance = options.distance ?? 150;
  const timing = options.timing ?? easeInOutCubic;
  const current = camera.position();

  if (camera instanceof Camera) {
    yield* camera.position([current.x - distance, current.y], duration, timing);
  } else {
    yield* (camera.position([current.x - distance, current.y], duration, timing) as ThreadGenerator);
  }
}

/**
 * Preset: pan_right
 * Glides camera viewpoint towards the right.
 */
export function* pan_right(
  camera: CameraLike,
  options: PanMotionOptions = {},
): ThreadGenerator {
  const duration = options.duration ?? 2.0;
  const distance = options.distance ?? 150;
  const timing = options.timing ?? easeInOutCubic;
  const current = camera.position();

  if (camera instanceof Camera) {
    yield* camera.position([current.x + distance, current.y], duration, timing);
  } else {
    yield* (camera.position([current.x + distance, current.y], duration, timing) as ThreadGenerator);
  }
}

/**
 * Preset: focus_element
 * Re-centers and zooms smoothly onto a target UI panel or metric card.
 */
export function* focus_element(
  camera: CameraLike,
  target: Node,
  options: FocusElementOptions = {},
): ThreadGenerator {
  const duration = options.duration ?? 1.4;
  const timing = options.timing ?? easeInOutCubic;
  const zoom = options.zoom ?? 1.25;

  if (options.offset) {
    const pos = target.position();
    const offsetPos: [number, number] = [pos.x + options.offset[0], pos.y + options.offset[1]];
    yield* all(
      (camera.centerOn as any)(offsetPos, duration, timing),
      tweenZoom(camera, zoom, duration, timing),
    );
  } else {
    yield* all(
      camera.centerOn(target, duration, timing),
      tweenZoom(camera, zoom, duration, timing),
    );
  }
}

/**
 * Preset: cinematic_reveal
 * Starts wide or offset and sweeps in to 1.0 zoom centered at origin.
 */
export function* cinematic_reveal(
  camera: CameraLike,
  options: CinematicRevealOptions = {},
): ThreadGenerator {
  const duration = options.duration ?? 2.0;
  const timing = options.timing ?? easeInOutCubic;
  const startZoom = options.startZoom ?? 0.88;
  const endZoom = options.endZoom ?? 1.0;

  camera.zoom(startZoom);
  if (options.startOffset) {
    camera.position([options.startOffset[0], options.startOffset[1]]);
  }

  yield* all(
    tweenZoom(camera, endZoom, duration, timing),
    (camera instanceof Camera
      ? camera.position([0, 0], duration, timing)
      : (camera.position([0, 0], duration, timing) as ThreadGenerator)),
  );
}

/**
 * Preset: reset_camera
 * Smoothly resets camera position, rotation, and zoom to defaults ([0, 0], 0 deg, zoom 1.0).
 */
export function* reset_camera(
  camera: CameraLike,
  options: CameraMotionOptions = {},
): ThreadGenerator {
  const duration = options.duration ?? 1.0;
  const timing = options.timing ?? easeInOutCubic;

  yield* camera.reset(duration, timing);
}
