import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync
} from "node:fs";
import {
  cp,
  mkdir,
  readFile,
  readdir,
  stat,
  writeFile
} from "node:fs/promises";
import { dirname, isAbsolute, join, resolve } from "node:path";

import EJS from "ejs";

import type { NeomanGenerator } from "./types.ts";
import { deepMerge } from "./utils.ts";

export class NeomanEnvironment<
  Generators extends {
    [key: string]: NeomanGenerator<Record<string, unknown>>;
  },
  Context extends { [key: string]: any }
> {
  private readonly context: Context;
  public generators: Generators;

  constructor(generators: Generators, context: Context) {
    this.context = context;
    this.generators = generators;
  }

  register<
    GeneratorName extends string,
    GeneratorCtx extends Record<string, unknown>
  >(
    namespace: GeneratorName,
    generator: NeomanGenerator<GeneratorCtx>
  ): NeomanEnvironment<
    Generators & {
      [key in GeneratorName]: NeomanGenerator<GeneratorCtx>;
    },
    Context
  > {
    if (this.generators[namespace]) {
      throw new Error(`Generator ${String(namespace)} already exists`);
    }

    this.generators = {
      ...this.generators,
      [namespace]: generator
    };

    return this;
  }

  async run<Namespace extends keyof Generators>(
    namespace: Namespace,
    ctx?: Record<string, any>
  ) {
    const generator = this.generators[namespace];
    if (!generator) {
      return Promise.reject(
        new Error(`Generator ${String(namespace)} not registered`)
      );
    }

    const generatorCtx = deepMerge(this.context, ctx || {});

    const sourceRoot = resolve(generator.sourceRoot);
    const destinationRoot = resolve(generator.destinationRoot);

    const destinationStat = await stat(destinationRoot).catch(() => null);
    if (!destinationStat) {
      await mkdir(destinationRoot, { recursive: true });
    }

    await generator.run({
      options: generatorCtx,
      copy: async (filePath: string, destinationPath: string) =>
        copy({
          filePath,
          destinationPath,
          destinationRoot,
          sourceRoot
        }),
      copyTpl: async (
        filePath: string,
        destinationPath: string,
        ctx: Record<string, unknown>
      ) =>
        copyTpl({
          filePath,
          destinationPath,
          ctx: deepMerge(generatorCtx, ctx),
          destinationRoot,
          sourceRoot
        }),
      copySync: (filePath: string, destinationPath: string) =>
        copySync({
          filePath,
          destinationPath,
          destinationRoot,
          sourceRoot
        }),
      copyTplSync: (
        filePath: string,
        destinationPath: string,
        ctx: Record<string, unknown>
      ) =>
        copyTplSync({
          filePath,
          destinationPath,
          ctx: deepMerge(generatorCtx, ctx),
          destinationRoot,
          sourceRoot
        }),
      destinationPath: (...path: string[]) => {
        let destinationPath = join(...path);
        if (!isAbsolute(destinationPath)) {
          destinationPath = join(destinationRoot, destinationPath);
        }
        return destinationPath;
      },
      templatePath: (...path: string[]) => {
        let sourcePath = join(...path);
        if (!isAbsolute(sourcePath)) {
          sourcePath = join(sourceRoot, sourcePath);
        }
        console.log(sourcePath);

        return sourcePath;
      },
      ejs: EJS
    });
  }
}

async function copy({
  filePath,
  destinationPath,
  destinationRoot,
  sourceRoot
}: {
  filePath: string;
  destinationPath: string;
  destinationRoot: string;
  sourceRoot: string;
}): Promise<void> {
  const fileStat = await stat(filePath).catch(() => null);

  if (fileStat?.isDirectory()) {
    const files = await readdir(filePath);
    await Promise.all(
      files.map(async (file) =>
        copy({
          filePath: join(filePath, file),
          destinationPath: join(destinationPath, file),
          destinationRoot,
          sourceRoot
        })
      )
    );
    return;
  }

  const dirStat = await stat(dirname(destinationPath)).catch(() => null);
  if (!dirStat) {
    await mkdir(dirname(destinationPath), { recursive: true });
  }

  await cp(
    resolve(sourceRoot, filePath),
    resolve(destinationRoot, destinationPath)
  );
}

function copySync({
  filePath,
  destinationPath,
  destinationRoot,
  sourceRoot
}: {
  filePath: string;
  destinationPath: string;
  destinationRoot: string;
  sourceRoot: string;
}): void {
  const fileStat = statSync(filePath);

  if (fileStat?.isDirectory()) {
    const files = readdirSync(filePath);
    files.forEach((file) =>
      copySync({
        filePath: join(filePath, file),
        destinationPath: join(destinationPath, file),
        destinationRoot,
        sourceRoot
      })
    );
    return;
  }

  if (!existsSync(dirname(destinationPath))) {
    mkdirSync(dirname(destinationPath), { recursive: true });
  }

  cpSync(
    resolve(sourceRoot, filePath),
    resolve(destinationRoot, destinationPath)
  );
}

async function copyTpl({
  filePath,
  destinationPath,
  ctx,
  destinationRoot,
  sourceRoot
}: {
  filePath: string;
  destinationPath: string;
  ctx: Record<string, unknown>;
  destinationRoot: string;
  sourceRoot: string;
}): Promise<void> {
  const fileStat = await stat(filePath).catch(() => null);

  if (fileStat?.isDirectory()) {
    const files = await readdir(filePath);
    await Promise.all(
      files.map(async (file) =>
        copyTpl({
          filePath: join(filePath, file),
          destinationPath: join(destinationPath, file),
          destinationRoot,
          sourceRoot,
          ctx
        })
      )
    );
    return;
  }

  const dirStat = await stat(dirname(destinationPath)).catch(() => null);
  if (!dirStat) {
    await mkdir(dirname(destinationPath), { recursive: true });
  }

  const content = await readFile(resolve(sourceRoot, filePath), "utf-8");

  await writeFile(
    resolve(destinationRoot, destinationPath),
    await EJS.render(content, ctx, {
      async: true
    })
  );
}

function copyTplSync({
  filePath,
  destinationPath,
  ctx,
  destinationRoot,
  sourceRoot
}: {
  filePath: string;
  destinationPath: string;
  ctx: Record<string, unknown>;
  destinationRoot: string;
  sourceRoot: string;
}): void {
  const fileStat = statSync(filePath);

  if (fileStat?.isDirectory()) {
    const files = readdirSync(filePath);
    files.forEach((file) =>
      copyTplSync({
        filePath: join(filePath, file),
        destinationPath: join(destinationPath, file),
        destinationRoot,
        sourceRoot,
        ctx
      })
    );
    return;
  }

  if (!existsSync(dirname(destinationPath))) {
    mkdirSync(dirname(destinationPath), { recursive: true });
  }

  const content = readFileSync(resolve(sourceRoot, filePath), "utf-8");

  writeFileSync(
    resolve(destinationRoot, destinationPath),
    EJS.render(content, ctx)
  );
}
