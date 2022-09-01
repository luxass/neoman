# Neoman

> A very small yeoman alternative - built for [Zotera](https://github.com/zotera/zotera)


## Installation
```bash
npm install @luxass/neoman
```

## Setup
```typescript
import { createEnvironment, NeomanGenerator } from '@luxass/neoman';

const neomanEnv = createEnvironment({
  // Adding a global name variable.
  name: 'Neoman'
});

function neomanGenerator(ctx: any): NeomanGenerator {
  return {
    sourceRoot: './tests/shared',
    destinationRoot: './tests/shared/out',
    writing: ({ copy, templatePath, destinationPath, installDependencies }) => {
      copy(templatePath('_package.json'), destinationPath('package.json'), ctx);
      installDependencies('pnpm', ['typescript']);
    }
  };
}

// Register the generator
neomanEnv.register('neoman-namespace', neomanGenerator);

neomanEnv.run('neoman-namespace'); // without additional context
neomanEnv.run('neoman-namespace', { version: 'v1.0.0' }); // with additional context

```