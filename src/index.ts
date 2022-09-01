import { NeomanEnvironment } from './environment';

export { NeomanGenerator } from './types';

export const createEnvironment = (context?: Record<string, unknown>) => {
  const env = new NeomanEnvironment(context || {});
  return env;
};

export { NeomanEnvironment };
