import { readdir, rmdir } from "node:fs/promises";
import { join } from "node:path";

import { afterAll, expect, test } from "vitest";

import { createEnvironment } from "../src";
import { CopyGenerator } from "./generators/copy-gen";
import { SpawnGenerator } from "./generators/spawn-gen";

async function readDir(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    dirents.map(async (dirent) => {
      const resolved = join(dir, dirent.name);
      return dirent.isDirectory() ? await readDir(resolved) : resolved;
    })
  );
  return files.flat();
}

afterAll(async () => {
  await rmdir("./tests/fixtures/spawn-fixture", { recursive: true });
  await rmdir("./tests/fixtures/copy-fixture", { recursive: true });
});

test("should register a generator", () => {
  const env = createEnvironment({
    generators: {
      "neoman:myfirstgen": {
        sourceRoot: "templates",
        destinationRoot: "output",
        run: async () => {}
      }
    }
  });

  expect(Object.keys(env.generators)).toHaveLength(1);
});

test("throw error if namespace already exists", () => {
  const env = createEnvironment({
    generators: {
      "neoman:myfirstgen": CopyGenerator()
    }
  });

  expect(Object.keys(env.generators)).toHaveLength(1);

  expect(() => env.register("neoman:myfirstgen", CopyGenerator())).toThrowError(
    "Generator neoman:myfirstgen already exists"
  );
});

test("throw error if generator is not registered", async () => {
  const env = createEnvironment();

  expect(Object.keys(env.generators)).toHaveLength(0);

  await expect(env.run("neoman:myfirstgen")).rejects.toThrowError(
    "Generator neoman:myfirstgen not registered"
  );
});

test("run copy generator", async () => {
  const env = createEnvironment({
    generators: {
      "neoman:copy": CopyGenerator()
    },
    context: {
      global: "global"
    }
  });
  expect(Object.keys(env.generators)).toHaveLength(1);

  await env.run("neoman:copy");

  const destination = env.generators["neoman:copy"].destinationRoot;

  const files = await readDir(destination);

  expect(files).toHaveLength(4);
  expect(files).toEqual([
    join(destination, "README.md"),
    join(destination, "file1.txt"),
    join(destination, "files", "file1.txt"),
    join(destination, "files", "file2.txt")
  ]);
});

test("run spawn generator", async () => {
  const env = createEnvironment({
    generators: {
      "neoman:spawn": SpawnGenerator()
    },
    context: {
      global: "global"
    }
  });

  expect(Object.keys(env.generators)).toHaveLength(1);

  await env.run("neoman:spawn");

  const destination = env.generators["neoman:spawn"].destinationRoot;

  const files = await readDir(destination);

  expect(files).toHaveLength(1);
  expect(files).toEqual([join(destination, "package.json")]);
});
