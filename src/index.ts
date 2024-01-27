import { NeomanEnvironment } from "./environment";
import type { NeomanGenerator } from "./types";

export type { NeomanGenerator };

export interface EnvironmentOptions<
  T extends {
    [key: string]: NeomanGenerator<Record<string, unknown>>;
  },
  C extends {
    [key: string]: any;
  },
> {
  generators?: T;
  context?: C;
}

export function createEnvironment<
  T extends {
    [key: string]: NeomanGenerator<Record<string, unknown>>;
  },
  K extends {
    [key: string]: any;
  },
>(options?: EnvironmentOptions<T, K>) {
  return new NeomanEnvironment<T, K>(
    options?.generators ?? ({} as T),
    options?.context ?? ({} as K),
  );
}
