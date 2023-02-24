import { walk } from "https://deno.land/std@0.178.0/fs/walk.ts";
import { dirname, join } from "https://deno.land/std@0.178.0/path/mod.ts";

const projectRoot = Deno.cwd();
const nodeRoot = join(projectRoot, "src");
const denoRoot = join(projectRoot, "deno");

for await (const entry of walk(nodeRoot, {
  exts: [".ts"]
})) {
  if (entry.isFile) {
    const filePath = entry.path.slice(nodeRoot.length);

    const nodePath = join(nodeRoot, filePath);
    const denoPath = join(denoRoot, filePath);

    const content = await Deno.readTextFile(nodePath);

    const denoSource = content.replace(
      /^(?:import|export)([\s\S]*?)from\s*['"]([^'"]*)['"];\s*({[\s\S]*?})?\s*$/gm,
      (line, target: string) => {
        if (target === "ejs") {
          return 'import EJS from "https://esm.sh/ejs@3.1.8";';
        }

        const targetNodePath = join(dirname(nodePath), target);

        try {
          if (Deno.statSync(`${targetNodePath}.ts`).isFile) {
            return line.replace(target, `${target}.ts`);
          }
        } catch (e) {
          if (!(e instanceof Deno.errors.NotFound)) {
            throw e;
          }
        }

        

        if (target.includes("fs") || target.includes("node:fs")) {

          return line.replace(
            target,
            "https://deno.land/std@0.178.0/fs/mod.ts"
          );
        }

        if (target.includes("path") || target.includes("node:path")) {
          return line.replace(
            target,
            "https://deno.land/std@0.178.0/path/mod.ts"
          );
        }
        return line;
      }
    );

    await Deno.mkdir(dirname(denoPath), { recursive: true });

    await Deno.writeTextFile(denoPath, denoSource);
  }
}

function getDenoFSEquivelent(fn: string) {
  switch (fn) {
    case "cp":
      return "copy";
    case "cpSync":
      return "copySync";
    case "mkdir":
      return "mkdirSync";
    case "mkdirSync":
      return "mkdirSync";

    default:
      throw new Error("Unknown function");
  }
}
