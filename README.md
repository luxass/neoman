# 📋 neoman

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

A small [`yeoman`](https://yeoman.io/) alternative

## 📦 Installation

```sh
npm install @luxass/neoman
```

## 📚 Usage

```ts
import { createEnvironment, NeomanGenerator } from "@luxass/neoman";

function projectGenerator(): NeomanGenerator<Record<string, unknown>> {
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

## 📄 License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@luxass/neoman?style=flat&colorA=18181B&colorB=4169E1
[npm-version-href]: https://npmjs.com/package/@luxass/neoman
[npm-downloads-src]: https://img.shields.io/npm/dm/@luxass/neoman?style=flat&colorA=18181B&colorB=4169E1
[npm-downloads-href]: https://npmjs.com/package/@luxass/neoman
