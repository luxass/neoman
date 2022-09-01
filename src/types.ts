import { ExecaChildProcess, Options as SpawnOptions } from 'execa';

export type Namespace = string;
export interface NeomanContext {
  [key: string]: any;
}
export interface NeomanGenerator {
  destinationRoot: string;
  sourceRoot: string;
  writing(opts: WritingOptions): Promise<void> | void;
}

export interface WritingOptions {
  copy(templatePath: string, destinationPath: string, ctx?: NeomanContext): void;
  templatePath(path: string): string;
  destinationPath(path: string): string;
  spawn(command: string, args: string[], opts?: SpawnOptions): ExecaChildProcess<string>;
  installDependencies(pkgManager: PkgManager, deps: string[]): void;
}

export type PkgManager = 'npm' | 'yarn' | 'pnpm';
