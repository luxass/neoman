import { NeomanEnvironment } from './environment';
import { NeomanContext } from './types';

export { NeomanGenerator } from './types';

export const createEnvironment = (context: NeomanContext) => {
  const env = new NeomanEnvironment(context);

  return env;
};

export { NeomanEnvironment, NeomanContext };
