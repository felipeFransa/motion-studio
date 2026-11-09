import {makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {getBrand, type BrandId} from '../brand';
import {getNiche} from '../niche';
import {ThemeEngine} from '../theme';
import {parseMotionStudioConfig} from '../contract';
import {
  createStatSpotlight,
  type StatSpotlightData,
} from '../templates/stat_spotlight';

export default makeScene2D(function* (view) {
  // Shared identical content data for all three brands
  const sharedContentData: StatSpotlightData = {
    titleText: 'CRESCIMENTO ACELERADO',
    highlightWord: 'ACELERADO',
    statValue: 84,
    statSuffix: '%',
    statTitle: 'Aumento médio de retenção',
    statDescription: 'Conteúdos estratégicos em movimento transformam visitantes em clientes fiéis.',
  };

  // The 3 demonstration brands requested
  const demoBrands: readonly BrandId[] = [
    'fitmarketing',
    'dentmarketing',
    'beautymarketing',
  ];

  // Dynamically instantiate each brand segment from the Brand Registry
  const segments = demoBrands.map((brandId) => {
    // 1. JSON Contract validation & resolution
    const config = parseMotionStudioConfig<StatSpotlightData>({
      schemaVersion: '1.0.0',
      appId: brandId,
      contentType: 'video',
      templateId: 'stat_spotlight',
      contentData: sharedContentData,
    });

    // 2. Separate Brand, Niche and Theme resolution
    const brand = getBrand(config.appId);
    const niche = getNiche(config.nicheId ?? brand.niche);
    const theme = ThemeEngine.resolve(brand, 'editorial_premium');

    // 3. Render template using resolved theme
    const spotlight = createStatSpotlight({
      brand,
      niche,
      theme,
      config,
    });

    view.add(spotlight.root);
    return spotlight;
  });

  // Sequentially play each brand showcase
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    yield* segment.play();
    yield* waitFor(1.5);
    yield* segment.exit();
    yield* waitFor(0.1);
  }
});
