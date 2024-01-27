function isObject(item: unknown): boolean {
  return item !== null && typeof item === "object" && !Array.isArray(item);
}

export function deepMerge<T extends Record<string, unknown> = Record<string, unknown>, S extends Record<string, unknown> = T>(
  target: T,
  ...sources: S[]
): DeepMerge<T, S> {
  if (!sources.length) return target as any;
  const source = sources.shift();
  if (!source) {
    return target as any;
  }

  if (isObject(target) && isObject(source)) {
    (Object.keys(source) as (keyof T & keyof S)[]).forEach((key) => {
      if (isObject(source[key])) {
        if (!target[key]) {
          target[key] = {} as any;
        }
        deepMerge(target[key] as any, source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return deepMerge(target, ...sources);
}

export type MergeInsertions<T> = T extends Record<string, unknown>
  ? { [K in keyof T]: MergeInsertions<T[K]> }
  : T;

export type DeepMerge<F, S> = MergeInsertions<{
  [K in keyof F | keyof S]: K extends keyof S & keyof F
    ? DeepMerge<F[K], S[K]>
    : K extends keyof S
      ? S[K]
      : K extends keyof F
        ? F[K]
        : never;
}>;
