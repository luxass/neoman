# Neoman

> A small yeoman generator alternative

<p align="center">
  <a href="https://www.npmjs.com/package/@luxass/neoman"><img src="https://img.shields.io/npm/v/@luxass/neoman?style=for-the-badge&color=3FA7D6&label="></a>
<p>

## Installation

```bash
npm install @luxass/neoman
```

## Setup

```ts
import { NeomanGenerator, createEnvironment } from "@luxass/neoman";

function projectGenerator(): NeomanGenerator<{}> {
  return {
    sourceRoot: "./template",
    destinationRoot: "./out",
    run: async (ctx) => {

      // Get the context from the environment
      const name = ctx.options.name;

      // Copy a file
      await ctx.copy(templatePath(".eslintrc"), destinationPath(".eslintrc"));

      // Copy a directory
      await ctx.copy(templatePath("src"), destinationPath("src"));

      // Copy a template
      await ctx.copyTpl(
        templatePath("package.json"),
        destinationPath("package.json"),
        {
          name: ctx.name
        }
      );
    }
  };
}

const env = createEnvironment({
  generators: {
    // You can register generators here
    "neoman-namespace": projectGenerator
  },
  context: {
    name: "Tim"
  }
}).register("neoman-namespace:2", projectGenerator);


// This will now give your intellisense.
env.run("neoman-namespace:2");
```
