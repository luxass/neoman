import type EJS from "ejs";
import type {
  ExecaReturnValue,
  ExecaSyncReturnValue,
  Options as SpawnOptions,
  SyncOptions as SpawnSyncOptions
} from "execa";

export interface NeomanGenerator<T extends Record<string, unknown>> {
  destinationRoot: string;
  sourceRoot: string;
  run(opts: RunOptions<T>): Promisify<void>;
}

export interface RunOptions<T> {
  options?: T;
  copy(filePath: string, destinationPath: string): Promise<void>;
  copyTpl(
    filePath: string,
    destinationPath: string,
    ctx: Record<string, unknown>
  ): Promise<void>;
  copySync(filePath: string, destinationPath: string): void;
  copyTplSync(
    filePath: string,
    destinationPath: string,
    ctx: Record<string, unknown>
  ): void;

  templatePath(...path: string[]): string;
  destinationPath(...path: string[]): string;

  spawn(
    command: string,
    args: string[],
    opts?: SpawnOptions
  ): Promise<ExecaReturnValue<string>>;
  spawnSync(
    command: string,
    args: string[],
    opts?: SpawnSyncOptions
  ): ExecaSyncReturnValue<string>;

  ejs: typeof EJS;
}
export type Promisify<T> = Promise<T> | T;

export type PackageManager = "npm" | "yarn" | "pnpm";
