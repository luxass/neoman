import type { ExecaChildProcess } from "execa";
import { execa, execaSync } from "execa";

export async function spawn(command: string, args: string[], opts?: any) {
  return execa(command, args, {
    stdio: "inherit",
    cwd: destination,
    ...opts
  });
}

export function spawnSync(
  command: string,
  args: string[],
  opts?: any
): ExecaChildProcess<string> {
  return execaSync(command, args, {
    stdio: "inherit",
    cwd: destination,
    ...opts
  });
}
