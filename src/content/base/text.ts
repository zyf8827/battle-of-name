export type TextTemplate = string | string[];

export type TextVariables = Record<string, string | number | boolean | null | undefined>;

export function pickTextTemplate(template: TextTemplate, rngValue: number): string {
  if (typeof template === 'string') {
    return template;
  }
  if (template.length === 0) {
    return '';
  }
  const index = Math.floor(rngValue * template.length) % template.length;
  return template[index];
}

export function renderTextTemplate(
  template: TextTemplate,
  variables: TextVariables,
  rngValue: number,
): string {
  const raw = pickTextTemplate(template, rngValue);
  return raw.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => {
    const value = variables[key];
    return value === null || value === undefined ? '' : String(value);
  });
}
