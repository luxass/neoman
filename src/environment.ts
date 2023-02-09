import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import path, { isAbsolute } from "node:path";

import EJS from "ejs";
import { execa } from "execa";
import type { Options as SpawnOptions } from "execa";

import type { Namespace, NeomanGeneratorFn } from "./types";
import { deepMerge } from "./utils";

export class NeomanEnvironment {
  public readonly store = new Map<Namespace, NeomanGeneratorFn<any>>();
  private readonly context: Record<string, unknown>;

  constructor(context: Record<string, unknown>) {
    this.context = context;
  }

  register<T extends Record<string, unknown>>(
    namespace: Namespace,
    generator: NeomanGeneratorFn<T>
  ) {
    if (this.store.has(namespace)) return;
    this.store.set(namespace, generator);
  }

  run(namespace: string, options?: Record<string, unknown>) {
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

    const copy = (
      templatePath: string,
      destinationPath: string,
      ctx?: Record<string, unknown>
    ) => {
      // TODO: this will need a rewrite.
      if (statSync(templatePath).isDirectory()) {
        const files = readdirSync(templatePath);
        files.forEach((file) => {
          copy(
            path.join(templatePath, file),
            path.join(destinationPath, file),
            ctx
          );
        });
        return;
      }
      let template = readFileSync(path.resolve(source, templatePath), "utf8");
      const pathDirname = path.dirname(destinationPath);
      if (!existsSync(pathDirname)) {
        mkdirSync(pathDirname, { recursive: true });
      }
      if (ctx) {
        template = EJS.render(template, ctx);
      }
      writeFileSync(destinationPath, template);
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
        stdio: "inherit",
        cwd: destination,
        ...opts
      });
    };

    const installDependencies = (
      pkgManager: "npm" | "yarn" | "pnpm",
      deps: string[]
    ) => {
      let install = "add";
      if (pkgManager === "npm") {
        install = "install";
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
