import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

console.log('====================================================');
console.log('🧪 MOTION STUDIO — TEST SUITE: BRAND REGISTRY & THEMES');
console.log('====================================================\n');

// Import compiled or source modules using dynamic import or Node's ESM loader
// Since project uses TypeScript with ESM modules, we can import directly with Node 26!
const { BRAND_REGISTRY, getBrand, getAllBrands, isKnownBrand, isValidHexColor } = await import('../src/brand/index.ts');
const { NICHE_REGISTRY, getNiche, getAllNiches, isKnownNiche } = await import('../src/niche/index.ts');
const { ThemeEngine, getContrastRatio, isLightColor, getAccessibleTextColor } = await import('../src/theme/index.ts');
const { validateMotionStudioConfig, parseMotionStudioConfig, ConfigValidationError } = await import('../src/contract/index.ts');
const { parseKineticTitleOptions } = await import('../src/components/kinetic-title/KineticTitle.tsx');
const { parseStatCardOptions } = await import('../src/components/stat-card/StatCard.tsx');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// -------------------------------------------------------------
// 1. Recuperação das 10 marcas e validação das 10 cores
// -------------------------------------------------------------
console.log('📋 Test Group 1: Brand Registry & Exact Colors');

const EXPECTED_BRANDS = [
  { id: 'fitmarketing', name: 'FitMarketing', niche: 'fitness', color: '#FF4D00' },
  { id: 'dentmarketing', name: 'DentMarketing', niche: 'odontologia', color: '#0EA5E9' },
  { id: 'beautymarketing', name: 'BeautyMarketing', niche: 'beleza', color: '#EC4899' },
  { id: 'vetmarketing', name: 'VetMarketing', niche: 'veterinaria', color: '#22C55E' },
  { id: 'chefmarketing', name: 'ChefMarketing', niche: 'gastronomia', color: '#EF4444' },
  { id: 'coachmarketing', name: 'CoachMarketing', niche: 'coaching', color: '#8B5CF6' },
  { id: 'fisiomarketing', name: 'FisioMarketing', niche: 'fisioterapia', color: '#3B82F6' },
  { id: 'quiromarketing', name: 'QuiroMarketing', niche: 'quiropraxia', color: '#059669' },
  { id: 'nutrimarketing', name: 'NutriMarketing', niche: 'nutricao', color: '#84CC16' },
  { id: 'psicomarketing', name: 'PsicoMarketing', niche: 'psicologia', color: '#A78BFA' },
];

test('Should retrieve exactly 10 brands from Brand Registry', () => {
  const allBrands = getAllBrands();
  assert.equal(allBrands.length, 10, 'Must have exactly 10 brands');
  assert.equal(Object.keys(BRAND_REGISTRY).length, 10);
});

for (const expected of EXPECTED_BRANDS) {
  test(`Brand "${expected.id}" must match name, niche and exact primary color ${expected.color}`, () => {
    assert.ok(isKnownBrand(expected.id), `${expected.id} must be recognized`);
    const brand = getBrand(expected.id);
    assert.equal(brand.id, expected.id);
    assert.equal(brand.name, expected.name);
    assert.equal(brand.niche, expected.niche);
    assert.equal(brand.primaryColor.toUpperCase(), expected.color.toUpperCase());
    assert.ok(brand.complementaryColors.primary, 'Must have primary color in complementaryColors');
    assert.ok(brand.typographyStyle.headingFont, 'Must have headingFont');
    assert.ok(brand.animationStyle.defaultEasing, 'Must have defaultEasing');
    assert.ok(brand.contentCategories.length >= 3, 'Must have content categories');
    assert.ok(brand.allowedTemplates.length >= 3, 'Must have allowed templates');
    assert.ok(brand.editorialTone.voice, 'Must have editorial voice');
  });
}

// -------------------------------------------------------------
// 2. Validação de Hexadecimal e Rejeição de Inválidos
// -------------------------------------------------------------
console.log('\n🎨 Test Group 2: Hex Color Validation');

test('Should accept valid 3-digit and 6-digit hex color strings', () => {
  assert.equal(isValidHexColor('#FF4D00'), true);
  assert.equal(isValidHexColor('#0EA5E9'), true);
  assert.equal(isValidHexColor('#FFF'), true);
  assert.equal(isValidHexColor('#123456'), true);
});

test('Should reject invalid hex color strings', () => {
  assert.equal(isValidHexColor(''), false);
  assert.equal(isValidHexColor('FF4D00'), false); // Missing hash
  assert.equal(isValidHexColor('#GGGGGG'), false); // Non-hex
  assert.equal(isValidHexColor('#12345'), false); // 5 digits
  assert.equal(isValidHexColor('#1234567'), false); // 7 digits
  assert.equal(isValidHexColor(null), false);
  assert.equal(isValidHexColor(undefined), false);
});

// -------------------------------------------------------------
// 3. Rejeição de appId desconhecido
// -------------------------------------------------------------
console.log('\n🚫 Test Group 3: Unknown appId Rejection');

test('getBrand should throw for unknown appId', () => {
  assert.throws(
    () => getBrand('unknown_brand_xyz'),
    /BrandRegistry: Unknown appId "unknown_brand_xyz"/
  );
});

test('validateMotionStudioConfig should fail with unknown appId', () => {
  const result = validateMotionStudioConfig({
    schemaVersion: '1.0.0',
    appId: 'nonexistent_app',
    contentType: 'video',
    templateId: 'stat_spotlight',
    contentData: { test: true },
  });
  assert.equal(result.success, false);
  assert.ok(result.errors.some((e) => e.includes('Unknown or missing "appId"')));
});

// -------------------------------------------------------------
// 4. Rejeição de contentType inválido
// -------------------------------------------------------------
console.log('\n📄 Test Group 4: ContentType Contract Validation');

test('validateMotionStudioConfig should accept valid contentTypes: video, feed_post, carousel, story', () => {
  const types = ['video', 'feed_post', 'carousel', 'story'];
  for (const t of types) {
    const res = validateMotionStudioConfig({
      schemaVersion: '1.0.0',
      appId: 'fitmarketing',
      contentType: t,
      templateId: 'stat_spotlight',
      contentData: { test: true },
    });
    assert.equal(res.success, true, `contentType "${t}" must be valid`);
  }
});

test('validateMotionStudioConfig should reject invalid contentTypes like "reel" or "banner"', () => {
  const res = validateMotionStudioConfig({
    schemaVersion: '1.0.0',
    appId: 'fitmarketing',
    contentType: 'reel',
    templateId: 'stat_spotlight',
    contentData: { test: true },
  });
  assert.equal(res.success, false);
  assert.ok(res.errors.some((e) => e.includes('Invalid or missing "contentType"')));
});

// -------------------------------------------------------------
// 5. Theme Engine, Contraste e Legibilidade
// -------------------------------------------------------------
console.log('\n🌓 Test Group 5: Theme Engine & Contrast Legibility');

test('ThemeEngine should resolve themes for all 10 brands without error', () => {
  const presets = ['editorial_premium', 'dark_modern', 'clean_light', 'high_contrast'];
  for (const brand of getAllBrands()) {
    for (const preset of presets) {
      const theme = ThemeEngine.resolve(brand, preset);
      assert.equal(theme.brandId, brand.id);
      assert.ok(theme.palette.primary);
      assert.ok(theme.palette.background);
      assert.ok(theme.palette.textPrimary);
      assert.ok(theme.palette.textOnPrimary);
    }
  }
});

test('Should compute accessible text on light and dark surfaces', () => {
  // Pure white background -> dark text
  assert.equal(getAccessibleTextColor('#FFFFFF'), '#111827');
  // Pure black background -> light text
  assert.equal(getAccessibleTextColor('#000000'), '#FFFFFF');
  // Dark navy background -> light text
  assert.equal(getAccessibleTextColor('#070D1B'), '#FFFFFF');
});

test('Light brand primary colors (NutriMarketing #84CC16, PsicoMarketing #A78BFA) must maintain contrast', () => {
  const nutri = getBrand('nutrimarketing');
  const nutriTheme = ThemeEngine.resolve(nutri, 'editorial_premium');
  // Nutrimarketing is high luminance lime green, so text on primary must be dark!
  assert.equal(isLightColor(nutri.primaryColor), true);
  assert.equal(nutriTheme.palette.textOnPrimary, '#141414');

  const psico = getBrand('psicomarketing');
  const psicoTheme = ThemeEngine.resolve(psico, 'editorial_premium');
  assert.equal(isLightColor(psico.primaryColor), true);
  assert.equal(psicoTheme.palette.textOnPrimary, '#141414');
});

// -------------------------------------------------------------
// 6. Compatibilidade com Componentes Existentes
// -------------------------------------------------------------
console.log('\n🧩 Test Group 6: Existing Component Compatibility');

test('Theme adaptors must produce fully valid options for KineticTitle and StatCard', () => {
  const brand = getBrand('fitmarketing');
  const theme = ThemeEngine.resolve(brand, 'editorial_premium');

  // Test KineticTitle
  const ktOpts = theme.forKineticTitle({
    text: 'TRANSFORMAÇÃO TOTAL',
    highlightWords: ['TRANSFORMAÇÃO'],
  });
  const parsedKt = parseKineticTitleOptions(ktOpts);
  assert.equal(parsedKt.component, 'kinetic_title');
  assert.equal(parsedKt.text, 'TRANSFORMAÇÃO TOTAL');
  assert.equal(parsedKt.highlightColor.toUpperCase(), '#FF4D00');

  // Test StatCard
  const scOpts = theme.forStatCard({
    value: 95,
    title: 'Satisfação comprovada',
    suffix: '%',
  });
  const parsedSc = parseStatCardOptions(scOpts);
  assert.equal(parsedSc.component, 'stat_card');
  assert.equal(parsedSc.value, 95);
  assert.equal(parsedSc.accentColor.toUpperCase(), '#FF4D00');
});

// -------------------------------------------------------------
// 7. Ausência de alterações indesejadas em cenas anteriores
// -------------------------------------------------------------
console.log('\n🛡️ Test Group 7: Previous Scenes Integrity');

test('Previous scenes must exist and be intact', () => {
  const falcaoCode = readFileSync('src/scenes/falcao_monitoramento.tsx', 'utf-8');
  assert.ok(falcaoCode.includes('FALCÃO MONITORAMENTO'), 'Falcão code intact');
  assert.ok(falcaoCode.includes('FELIPE FRANÇA'), 'Falcão code intact');
  assert.ok(!falcaoCode.includes('Coop Ronda'), 'Falcão code must never contain Coop Ronda');

  const showcaseCode = readFileSync('src/scenes/showcase.tsx', 'utf-8');
  assert.ok(showcaseCode.includes('KineticTitle'), 'Showcase scene intact');
  assert.ok(showcaseCode.includes('StatCard'), 'Showcase scene intact');
});

console.log('\n====================================================');
console.log(`📊 RESULTS: ${passedTests} / ${totalTests} tests passed.`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
