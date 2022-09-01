import { NeomanGenerator } from '../../src';

export default function WorldGenerator(ctx: {
  name: string;
}): NeomanGenerator {
  return {
    sourceRoot: './tests/shared',
    destinationRoot: './tests/shared/out',
    writing: ({ copy, templatePath, destinationPath, installDependencies }) => {
      copy(templatePath('_package.json'), destinationPath('package.json'), ctx);
      installDependencies('pnpm', ['typescript']);
    }
  };
}
