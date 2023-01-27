import type { NeomanGenerator } from "../../src";

export default function HelloGenerator(ctx?: {}): NeomanGenerator {
  return {
    sourceRoot: "./tests/shared",
    destinationRoot: "./tests/shared/out",
    writing: ({ copy, templatePath, destinationPath }) => {
      copy(templatePath("README.md"), destinationPath("README.md"), ctx);
      copy(templatePath("_gitignore"), destinationPath(".gitignore"));
    }
  };
}
