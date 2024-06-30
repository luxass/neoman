import type EJS from "ejs";
import type { ExecaReturnValue, Options as SpawnOptions } from "execa";

export interface NeomanGenerator<T extends Record<string, unknown>> {
  destinationRoot: string;
  sourceRoot: string;
  run: (opts: RunOptions<T>) => Promise<void>;
}

export interface RunOptions<T> {
  options?: T;
  copy: (filePath: string, destinationPath: string) => Promise<void>;
  copyTpl: (
    filePath: string,
    destinationPath: string,
    ctx: Record<string, unknown>
  ) => Promise<void>;

  templatePath: (...path: string[]) => string;
  destinationPath: (...path: string[]) => string;

  spawn: (
    command: string,
    args: string[],
    opts?: SpawnOptions
  ) => Promise<ExecaReturnValue<string>>;
  ejs: typeof EJS;
}
