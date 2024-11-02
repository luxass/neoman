import type { NeomanGenerator } from "./types";
import { NeomanEnvironment } from "./environment";

export type { NeomanGenerator };

export interface EnvironmentOptions<
  T extends {
    [key: string]: NeomanGenerator<Record<string, unknown>>;
  },
  C extends {
    [key: string]: unknown;
  },
> {
  generators?: T;
  context?: C;
}

export function createEnvironment<
  T extends {
    [key: string]: NeomanGenerator<any>;
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
