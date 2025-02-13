import type { NeomanGenerator } from "../../src";

export function SpawnGenerator(): NeomanGenerator {
  return {
    sourceRoot: "./test/fixtures",
    destinationRoot: "./test/fixtures/spawn-fixture",
    run: async (ctx) => {
      await ctx.spawn("npm", [
        "init",
        "-y",
      ]);
    },
  };
}
