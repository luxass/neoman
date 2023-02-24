import { walk } from "https://deno.land/std@0.175.0/fs/walk.ts";
import { dirname, join } from "https://deno.land/std@0.175.0/path/mod.ts";

const projectRoot = Deno.cwd();
const nodeRoot = join(projectRoot, "src");
const denoRoot = join(projectRoot, "deno");

for await (const entry of walk(nodeRoot, {
  exts: [".ts"]
})) {
  if (entry.isFile) {
    console.log(entry.path);

    const filePath = entry.path.slice(nodeRoot.length);

    const nodePath = join(nodeRoot, filePath);
    const denoPath = join(denoRoot, filePath);

    const content = await Deno.readTextFile(nodePath);

    const denoSource = content.replace(
      /^(?:import|export)[\s\S]*?from\s*['"]([^'"]*)['"];$/gm,
      (line, target) => {
        console.log(line);
        return line;
      }
    );

    await Deno.mkdir(dirname(denoPath), { recursive: true });

    await Deno.writeTextFile(denoPath, denoSource);
  }
}
