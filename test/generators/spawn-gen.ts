import type { NeomanGenerator } from "../../src";

export function SpawnGenerator(): NeomanGenerator {
  return {
    sourceRoot: "./tests/fixtures",
    destinationRoot: "./tests/fixtures/spawn-fixture",
    run: async (ctx) => {
      await ctx.spawn("npm", [
        "init",
        "-y",
      ]);
    },
  };
}
