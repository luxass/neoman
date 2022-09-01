import { beforeAll, describe, expect, it } from 'vitest';

import { NeomanEnvironment, createEnvironment } from '../src';
import HelloGenerator from './generators/hello';
import WorldGenerator from './generators/world';

enum Namespaces {
  Hello = 'neoman:hello',
  World = 'neoman:world'
}

let neomanEnv: NeomanEnvironment;

beforeAll(() => {
  neomanEnv = createEnvironment({
    global: 'epic'
  });
});

describe('index', () => {
  it('setup generators', () => {
    neomanEnv.register(Namespaces.Hello, HelloGenerator);
    neomanEnv.register(Namespaces.World, WorldGenerator);
    expect(neomanEnv.store.size).toBe(2);
    expect(neomanEnv.store.has(Namespaces.Hello)).toBe(true);
    expect(neomanEnv.store.has(Namespaces.World)).toBe(true);
  });

  it('run hello generator', () => {
    neomanEnv.run(Namespaces.Hello, {
      name: 'world'
    });

    // How should we test this?
    expect(true).toBe(true);
  });

  it('run world generator', () => {
    neomanEnv.run(Namespaces.World, {
      name: 'zotera-plugin',
      description: 'zotera-plugin description',
      vitest: true,
      esbuild: true,
      dep: (dep: string) => {
        return `"${dep}": "*"`;
      }
    });
    // How should we test this?
    expect(true).toBe(true);
  });
});
