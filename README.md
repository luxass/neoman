# Neoman

> A very small yeoman alternative

## Installation

```bash
npm install @luxass/neoman
```

## Setup

```typescript
import { NeomanGenerator, createEnvironment } from "@luxass/neoman";

const neomanEnv = createEnvironment({
  // Adding a global name variable.
  name: "Neoman"
});

function projectGenerator(ctx: any): NeomanGenerator {
  return {
    sourceRoot: "./tests/shared",
    destinationRoot: "./tests/shared/out",
    writing: ({ copy, templatePath, destinationPath, installDependencies }) => {
      copy(templatePath("_package.json"), destinationPath("package.json"), ctx);
      installDependencies("pnpm", ["typescript"]);
    }
  };
}

// Register the generator
neomanEnv.register("neoman-namespace", projectGenerator);

neomanEnv.run("neoman-namespace"); // without additional context
neomanEnv.run("neoman-namespace", { version: "v1.0.0" }); // with additional context
```
