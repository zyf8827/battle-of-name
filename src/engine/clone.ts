export function deepCloneKeepFns<T>(value: T): T {
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => deepCloneKeepFns(item)) as T;
  }
  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
      if (typeof raw === 'function') {
        result[key] = raw;
      } else {
        result[key] = deepCloneKeepFns(raw);
      }
    }
    return result as T;
  }
  return value;
}
