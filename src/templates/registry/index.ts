import type {TemplateDefinition, TemplateId} from '../types';
import {QUICK_TIPS_TEMPLATE} from '../definitions/quick_tips';
import {MYTHS_FACTS_TEMPLATE} from '../definitions/myths_facts';
import {BENEFITS_LIST_TEMPLATE} from '../definitions/benefits_list';
import {STEP_BY_STEP_TEMPLATE} from '../definitions/step_by_step';
import {SERVICE_PRESENTATION_TEMPLATE} from '../definitions/service_presentation';

const registry = new Map<string, TemplateDefinition<any>>([
  ['quick_tips', QUICK_TIPS_TEMPLATE],
  ['myths_facts', MYTHS_FACTS_TEMPLATE],
  ['benefits_list', BENEFITS_LIST_TEMPLATE],
  ['step_by_step', STEP_BY_STEP_TEMPLATE],
  ['service_presentation', SERVICE_PRESENTATION_TEMPLATE],
]);

export const TEMPLATE_REGISTRY: ReadonlyMap<string, TemplateDefinition<any>> = registry;

export function registerTemplate(template: TemplateDefinition<any>): void {
  if (!template || !template.templateId) {
    throw new TypeError('TemplateRegistry: cannot register an invalid template definition.');
  }
  registry.set(template.templateId, template);
}

export function getTemplate(id: TemplateId | string): TemplateDefinition<any> {
  const template = registry.get(id);
  if (!template) {
    const valid = Array.from(registry.keys()).join(', ');
    throw new Error(`TemplateRegistry: Unknown templateId "${id}". Must be one of: ${valid}.`);
  }
  return template;
}

export function getAllTemplates(): readonly TemplateDefinition<any>[] {
  return Array.from(registry.values());
}

export function isKnownTemplate(id: string): id is TemplateId {
  return registry.has(id);
}
