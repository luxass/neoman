import { NeomanEnvironment } from './environment';
import { NeomanContext } from './types';

export * from './generator';

export const createEnvironment = (context: NeomanContext) => {
  const env = new NeomanEnvironment(context);

  return env;
};

export { NeomanEnvironment };
