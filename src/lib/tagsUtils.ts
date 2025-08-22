/**
 * Utilitário para parsing seguro de tags
 * Garante que tags sejam sempre retornadas como array de strings
 */

export function parseTagsSafely(tags: string | string[] | null | undefined): string[] {
  if (!tags) {
    return [];
  }

  try {
    if (typeof tags === 'string') {
      const parsed = JSON.parse(tags);
      return Array.isArray(parsed) ? parsed.filter(tag => typeof tag === 'string') : [];
    } else if (Array.isArray(tags)) {
      return tags.filter(tag => typeof tag === 'string');
    }
  } catch (error) {
    console.error('Erro ao fazer parse das tags:', error);
  }

  return [];
}

/**
 * Converte array de tags para string JSON
 */
export function stringifyTags(tags: string[]): string {
  if (!Array.isArray(tags)) {
    return '[]';
  }
  
  const validTags = tags.filter(tag => typeof tag === 'string' && tag.trim().length > 0);
  return JSON.stringify(validTags);
}

/**
 * Valida se uma tag é válida
 */
export function isValidTag(tag: any): tag is string {
  return typeof tag === 'string' && tag.trim().length > 0 && tag.length <= 50;
}
