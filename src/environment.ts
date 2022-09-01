import EJS from 'ejs';
import { Options as SpawnOptions, execa } from 'execa';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path, { isAbsolute } from 'node:path';

import { Namespace, NeomanContext, NeomanGenerator } from './types';
import { deepMerge } from './utils';

export class NeomanEnvironment {
  public readonly store = new Map<Namespace, (options: NeomanContext) => NeomanGenerator>();
  private readonly context: NeomanContext;

  constructor(context: NeomanContext) {
    this.context = context;
  }

  register(namespace: Namespace, generator: (options: NeomanContext) => NeomanGenerator) {
    if (this.store.has(namespace)) return;
    this.store.set(namespace, generator);
  }

  run(namespace: string, options?: NeomanContext) {
    const generatorFn = this.store.get(namespace);
    if (!generatorFn) throw new Error(`Generator ${namespace} not found`);

    const ctx = deepMerge(this.context, options || {});
    const generator = generatorFn(ctx);

    const source = path.resolve(generator.sourceRoot);
    const destination = path.resolve(generator.destinationRoot);

    if (!existsSync(destination)) {
      mkdirSync(destination, {
        recursive: true
      });
    }

    const copy = (templatePath: string, destinationPath: string, ctx?: NeomanContext) => {
      const template = readFileSync(templatePath, 'utf8');
      if (!ctx) {
        // return copyFileSync(templatePath, destinationPath);
        return writeFileSync(destinationPath, template);
      }

      const rendered = EJS.render(template, ctx);
      writeFileSync(destinationPath, rendered);
    };

    const templatePath = (...dest: string[]) => {
      let sourcePath = path.join(...dest);
      if (!isAbsolute(sourcePath)) {
        sourcePath = path.join(source, sourcePath);
      }
      return sourcePath;
    };

    const destinationPath = (...dest: string[]) => {
      let destPath = path.join(...dest);
      if (!isAbsolute(destPath)) {
        destPath = path.join(destination, destPath);
      }
      return destPath;
    };

    const _spawn = (command: string, args: string[], opts?: SpawnOptions) => {
      return execa(command, args, {
        stdio: 'inherit',
        cwd: destination,
        ...opts
      });
    };

    const installDependencies = (pkgManager: 'npm' | 'yarn' | 'pnpm', deps: string[]) => {
      let install = 'add';
      if (pkgManager === 'npm') {
        install = 'install';
      }
      _spawn(pkgManager, [install, ...deps]);
    };

    generator.writing({
      copy,
      templatePath,
      destinationPath,
      spawn: _spawn,
      installDependencies
    });
  }
}
