import {makeScene2D} from '@motion-canvas/2d';
import {TemplateResolver} from '../templates/resolver';
import {renderStoryboardToMotionCanvas} from '../templates/renderers/motion-canvas';
import {SAMPLE_DENTMARKETING_MYTHS_FACTS} from '../templates/examples';

export default makeScene2D(function* (view) {
  // 1. Resolve structured JSON via Template Engine
  const resolved = TemplateResolver.resolve(SAMPLE_DENTMARKETING_MYTHS_FACTS);

  // 2. Render storyboard using Motion Canvas renderer
  const storyboard = renderStoryboardToMotionCanvas(
    resolved.storyboardIR,
    resolved.theme,
    view,
  );

  // 3. Play generated animation sequence
  yield* storyboard.play();
});
