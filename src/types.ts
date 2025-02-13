import type EJS from "ejs";
import type { Options as ExecaSpawnOptions, Result } from "execa";

export interface NeomanGenerator<T extends Record<string, unknown> = Record<string, unknown>> {
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

  spawn: <TSpawnOptions extends SpawnOptions>(
    command: string,
    args: string[],
    opts?: TSpawnOptions
  ) => Promise<Result<TSpawnOptions>>;

  ejs: typeof EJS;
}

export interface SpawnOptions extends ExecaSpawnOptions {
  cwd?: string;
  stdio?: ExecaSpawnOptions["stdio"];
}
