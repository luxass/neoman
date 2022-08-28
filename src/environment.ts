import { join, normalize, resolve } from 'path';

import { NeomanGenerator } from './generator';
import { Namespace, NeomanContext } from './types';

export class NeomanEnvironment {
  private readonly store = new Map<Namespace, NeomanGenerator>();
  private readonly context: NeomanContext = {};

  constructor(context: NeomanContext) {
    this.context = context;
  }

  register(namespace: Namespace, generator: new () => NeomanGenerator) {
    if (this.store.has(namespace)) return;
    const Generator = generator;

    const gen = new Generator();

    this.store.set(namespace, gen);
  }

  run(namespace: string, options: any) {
    if (!this.store.has(namespace)) {
      throw new Error(`Generator ${namespace} not found`);
    }

    console.log(`Running generator ${namespace}`);
    
  }
}
