import { ExecaChildProcess, Options as SpawnOptions } from "execa";

export type Namespace = string;
export type NeomanGeneratorFn<T extends Record<string, unknown>> = (
  options: T
) => NeomanGenerator;
export interface NeomanGenerator {
  destinationRoot: string;
  sourceRoot: string;
  writing(opts: WritingOptions): Promise<void> | void;
}

export interface WritingOptions {
  copy(
    templatePath: string,
    destinationPath: string,
    ctx?: Record<string, unknown>
  ): void;
  templatePath(path: string): string;
  destinationPath(path: string): string;
  spawn(
    command: string,
    args: string[],
    opts?: SpawnOptions
  ): ExecaChildProcess<string>;
  installDependencies(pkgManager: PkgManager, deps: string[]): void;
}

export type PkgManager = "npm" | "yarn" | "pnpm";
