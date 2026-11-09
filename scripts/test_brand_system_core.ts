import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  BRAND_REGISTRY,
  getBrand,
  getAllBrands,
  isKnownBrand,
  isValidHexColor,
} from '../src/brand';
import { NICHE_REGISTRY, getNiche, getAllNiches, isKnownNiche } from '../src/niche';
import {
  ThemeEngine,
  getContrastRatio,
  isLightColor,
  getAccessibleTextColor,
} from '../src/theme';
import {
  validateMotionStudioConfig,
  parseMotionStudioConfig,
  ConfigValidationError,
} from '../src/contract';
import {
  TEMPLATE_REGISTRY,
  getTemplate,
  getAllTemplates,
  isKnownTemplate,
} from '../src/templates/registry';
import { TemplateResolver } from '../src/templates/resolver';
import { validateTemplateRequest } from '../src/templates/validation';
import { exportFlutterContract } from '../src/templates/renderers/flutter';
import {
  SAMPLE_FITMARKETING_QUICK_TIPS,
  SAMPLE_DENTMARKETING_MYTHS_FACTS,
  SAMPLE_BEAUTYMARKETING_BENEFITS,
  SAMPLE_COACHMARKETING_STEPS,
  SAMPLE_FISIOMARKETING_SERVICE,
} from '../src/templates/examples';

console.log('====================================================');
console.log('🧪 MOTION STUDIO — TEST SUITE: TEMPLATE ENGINE (ETAPA 2)');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name: string, fn: () => void) {
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
// 1. Registro e Carregamento dos 5 Templates
// -------------------------------------------------------------
console.log('📋 Test Group 1: Template Registry (5 Templates)');

const EXPECTED_TEMPLATES = [
  'quick_tips',
  'myths_facts',
  'benefits_list',
  'step_by_step',
  'service_presentation',
] as const;

test('Should have exactly 5 registered templates', () => {
  const templates = getAllTemplates();
  assert.equal(templates.length, 5, 'Must have 5 templates registered');
});

for (const templateId of EXPECTED_TEMPLATES) {
  test(`Template "${templateId}" must be resolvable with valid constraints`, () => {
    assert.ok(isKnownTemplate(templateId), `${templateId} must be known`);
    const tmpl = getTemplate(templateId);
    assert.equal(tmpl.templateId, templateId);
    assert.ok(tmpl.name, 'Must have name');
    assert.ok(tmpl.version, 'Must have version');
    assert.ok(tmpl.requiredFields.length > 0, 'Must have required fields');
    assert.ok(tmpl.layoutConstraints.maxTitleLength > 0, 'Must have maxTitleLength');
    assert.ok(tmpl.durationConstraints.defaultDurationSeconds > 0, 'Must have duration');
  });
}

// -------------------------------------------------------------
// 2. Compatibilidade com as 10 marcas e temas
// -------------------------------------------------------------
console.log('\n🏢 Test Group 2: Cross-Brand & Cross-Niche Compatibility');

test('All 5 templates must resolve successfully across all 10 brands', () => {
  const brands = getAllBrands();
  const sampleConfigs = [
    SAMPLE_FITMARKETING_QUICK_TIPS,
    SAMPLE_DENTMARKETING_MYTHS_FACTS,
    SAMPLE_BEAUTYMARKETING_BENEFITS,
    SAMPLE_COACHMARKETING_STEPS,
    SAMPLE_FISIOMARKETING_SERVICE,
  ];

  for (const brand of brands) {
    for (const sample of sampleConfigs) {
      const configForBrand = {
        ...sample,
        appId: brand.id,
      };
      const resolved = TemplateResolver.resolve(configForBrand);
      assert.equal(resolved.brand.id, brand.id);
      assert.ok(resolved.storyboardIR.scenes.length >= 3, 'Must generate at least 3 scenes');
      assert.equal(resolved.storyboardIR.brand.primaryColor, brand.primaryColor);
    }
  }
});

// -------------------------------------------------------------
// 3. Rejeição de Templates Desconhecidos e Dados Incompletos
// -------------------------------------------------------------
console.log('\n🚫 Test Group 3: Template Validation & Rejections');

test('Should reject unknown templateId with clear error message', () => {
  const res = validateTemplateRequest({
    schemaVersion: '1.0.0',
    appId: 'fitmarketing',
    contentType: 'video',
    templateId: 'non_existent_template',
    content: { title: 'Test' },
  });
  assert.equal(res.success, false);
  if (!res.success) {
    assert.ok(res.errors.some((e) => e.includes('Unknown or missing "templateId"')));
  }
});

test('Should reject quick_tips with missing required fields', () => {
  const res = validateTemplateRequest({
    schemaVersion: '1.0.0',
    appId: 'fitmarketing',
    contentType: 'video',
    templateId: 'quick_tips',
    content: {
      title: 'Apenas Título',
      // missing subject, tips, summary, callToAction
    },
  });
  assert.equal(res.success, false);
  if (!res.success) {
    assert.ok(res.errors.some((e) => e.includes('"subject" is required')));
    assert.ok(res.errors.some((e) => e.includes('"tips" must be an array')));
  }
});

test('Should reject titles that exceed layoutConstraints length', () => {
  const longTitle = 'Este é um título excessivamente longo que ultrapassa todos os limites estipulados para a composição vertical';
  const res = validateTemplateRequest({
    ...SAMPLE_FITMARKETING_QUICK_TIPS,
    content: {
      ...SAMPLE_FITMARKETING_QUICK_TIPS.content,
      title: longTitle,
    },
  });
  assert.equal(res.success, false);
  if (!res.success) {
    assert.ok(res.errors.some((e) => e.includes('exceeds maximum length of 70 characters')));
  }
});

test('Should reject item count outside allowed range (e.g. 0 or 1 tip)', () => {
  const res = validateTemplateRequest({
    ...SAMPLE_FITMARKETING_QUICK_TIPS,
    content: {
      ...SAMPLE_FITMARKETING_QUICK_TIPS.content,
      tips: [{ title: 'Única Dica', description: 'Muito pouco' }],
    },
  });
  assert.equal(res.success, false);
  if (!res.success) {
    assert.ok(res.errors.some((e) => e.includes('between 2 and 5 items')));
  }
});

test('Should reject incompatible contentType for template', () => {
  const res = validateTemplateRequest({
    ...SAMPLE_FITMARKETING_QUICK_TIPS,
    contentType: 'invalid_content_type' as any,
  });
  assert.equal(res.success, false);
  if (!res.success) {
    assert.ok(res.errors.some((e) => e.includes('is not supported by template')));
  }
});

// -------------------------------------------------------------
// 4. Geração de Cenas Válidas e Contrato Flutter
// -------------------------------------------------------------
console.log('\n🧩 Test Group 4: Storyboard IR & Flutter Export Contracts');

test('TemplateResolver should generate valid StoryboardIR with consistent scene timings', () => {
  const resolved = TemplateResolver.resolve(SAMPLE_FITMARKETING_QUICK_TIPS);
  const ir = resolved.storyboardIR;

  assert.equal(ir.templateId, 'quick_tips');
  assert.equal(ir.brand.id, 'fitmarketing');
  assert.ok(ir.totalDurationSeconds >= 10 && ir.totalDurationSeconds <= 20);

  const sceneTypes = ir.scenes.map((s) => s.type);
  assert.ok(sceneTypes.includes('title_reveal'), 'Must have title_reveal');
  assert.ok(sceneTypes.includes('cards_sequence'), 'Must have cards_sequence');
  assert.ok(sceneTypes.includes('closing_cta'), 'Must have closing_cta');
});

test('exportFlutterContract should produce platform-independent JSON for Flutter apps', () => {
  const resolved = TemplateResolver.resolve(SAMPLE_BEAUTYMARKETING_BENEFITS);
  const flutterContract = exportFlutterContract(resolved.storyboardIR, resolved.theme);

  assert.equal(flutterContract.targetPlatform, 'flutter');
  assert.equal(flutterContract.formatVersion, '1.0');
  assert.equal(flutterContract.appId, 'beautymarketing');
  assert.equal(flutterContract.theme.primaryHex.toUpperCase(), '#EC4899');
  assert.ok(flutterContract.slides.length >= 3);
  assert.ok(flutterContract.slides[0].suggestedDurationMs > 0);
});

// -------------------------------------------------------------
// 5. Preservação de Cenas Anteriores
// -------------------------------------------------------------
console.log('\n🛡️ Test Group 5: Previous Scenes Integrity');

test('Falcão Monitoramento and previous scenes must remain intact', () => {
  const falcaoCode = readFileSync('src/scenes/falcao_monitoramento.tsx', 'utf-8');
  assert.ok(falcaoCode.includes('FALCÃO MONITORAMENTO'), 'Falcão code intact');
  assert.ok(falcaoCode.includes('FELIPE FRANÇA'), 'Falcão code intact');
  assert.ok(!falcaoCode.includes('Coop Ronda'), 'Falcão code must never contain Coop Ronda');

  const showcaseCode = readFileSync('src/scenes/showcase.tsx', 'utf-8');
  assert.ok(showcaseCode.includes('KineticTitle'), 'Showcase scene intact');
});

console.log('\n====================================================');
console.log(`📊 RESULTS: ${passedTests} / ${totalTests} tests passed.`);
console.log('====================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
