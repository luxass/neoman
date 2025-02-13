import type { NeomanGenerator } from "../../src";

export function CopyGenerator(): NeomanGenerator<{
  cheffs: {
    kiss: string;
  };
}> {
  return {
    sourceRoot: "./test/fixtures",
    destinationRoot: "./test/fixtures/copy-fixture",
    run: async (ctx) => {
      await ctx.copy(
        ctx.templatePath("file1.txt"),
        ctx.destinationPath("file1.txt"),
      );

      await ctx.copy(ctx.templatePath("extra"), ctx.destinationPath("files"));

      await ctx.copyTpl(
        ctx.templatePath("README.md"),
        ctx.destinationPath("README.md"),
        {
          name: "Neoman",
        },
      );
    },
  };
}
