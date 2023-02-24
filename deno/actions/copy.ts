import { readdir, stat } from "node:fs/promises";

export async function copy(
  filePath: string | Array<string>,
  destinationPath: string
): Promise<void> {
  const files = Array.isArray(filePath) ? filePath : [filePath];

  await Promise.all(
    files.map(async (file) => {
      try {
        const fileStat = await stat(file);
        if (fileStat.isDirectory()) {
          const files = await readdir(file);
          await Promise.all(
            files.map(async (file) => {
              await copy(
                path.join(file, file),
                path.join(destinationPath, file),
                ctx
              );
            })
          );
        }
      } catch (e) {
        throw new Error(e);
      }
    })
  );


}

export function copySync(
  filePath: string | Array<string>,
  destinationPath: string
): void {
  if (statSync(templatePath).isDirectory()) {
    const files = readdirSync(templatePath);
    files.forEach((file) => {
      copy(
        path.join(templatePath, file),
        path.join(destinationPath, file),
        ctx
      );
    });
    return;
  }
  let template = readFileSync(path.resolve(source, templatePath), "utf8");
  const pathDirname = path.dirname(destinationPath);
  if (!existsSync(pathDirname)) {
    mkdirSync(pathDirname, { recursive: true });
  }
  if (ctx) {
    template = EJS.render(template, ctx);
  }
  writeFileSync(destinationPath, template);
}

export async function copyTpl(
  templatePath: string | Array<string>,
  destinationPath: string,
  ctx?: Record<string, unknown>
) {}

export function copyTplSync(
  templatePath: string | Array<string>,
  destinationPath: string,
  ctx?: Record<string, unknown>
) {
  
}
