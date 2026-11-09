export type NicheId =
  | 'fitness'
  | 'odontologia'
  | 'beleza'
  | 'veterinaria'
  | 'gastronomia'
  | 'coaching'
  | 'fisioterapia'
  | 'quiropraxia'
  | 'nutricao'
  | 'psicologia';

export interface NicheConfig {
  readonly id: NicheId;
  readonly name: string;
  readonly description: string;
  readonly coreTopics: readonly string[];
  readonly vocabulary: readonly string[];
  readonly contentRestrictions?: readonly string[];
  readonly suggestedTemplates: readonly string[];
}
