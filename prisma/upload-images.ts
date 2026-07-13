import { readdir, readFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { put } from "@vercel/blob";
import { prisma } from "../src/lib/prisma";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGES_DIR = join(__dirname, "images");

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

function parseId(name: string): string | null {
  const ext = extname(name);
  const stem = name.slice(0, -ext.length || undefined);
  return stem || null;
}

async function main() {
  const force = process.argv.includes("--force");

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "[upload-images] BLOB_READ_WRITE_TOKEN ausente. Gere um token no dashboard da Vercel (Storage -> Blob) e exporte antes de rodar.",
    );
    process.exit(1);
  }

  let files: string[];
  try {
    files = await readdir(IMAGES_DIR);
  } catch {
    console.error(
      `[upload-images] Pasta "${IMAGES_DIR}" nao encontrada. Crie-a e coloque as imagens como <item-id>.<ext> (ex.: <guid>.jpg, <guid>.png).`,
    );
    process.exit(1);
  }

  const imageFiles = files.filter((f) => {
    const ext = extname(f).toLowerCase();
    return ext in MIME;
  });

  if (imageFiles.length === 0) {
    console.error(
      `[upload-images] Nenhuma imagem suportada em "${IMAGES_DIR}". Aceita: ${Object.keys(MIME).join(", ")}`,
    );
    process.exit(1);
  }

  const items = await prisma.item.findMany({
    select: { id: true, imageUrl: true },
  });
  const byId = new Map(items.map((i) => [i.id, i]));

  let uploaded = 0;
  let skipped = 0;

  for (const name of imageFiles.sort((a, b) => a.localeCompare(b, "en", { numeric: true }))) {
    const id = parseId(name);
    if (id === null) {
      console.warn(`  ! "${name}" ignorado: nome nao possui id valido`);
      continue;
    }
    const item = byId.get(id);
    if (!item) {
      console.warn(`  ! "${name}" ignorado: nao existe Item.id=${id}`);
      continue;
    }

    if (item.imageUrl && !force) {
      console.log(`  - #${id} pulado (ja tem imageUrl; use --force para sobrescrever)`);
      skipped++;
      continue;
    }

    const ext = extname(name).toLowerCase();
    const contentType = MIME[ext];
    const pathname = `items/${id}${ext}`;

    const buf = await readFile(join(IMAGES_DIR, name));
    const body = new Blob([buf], { type: contentType });

    try {
      const { url } = await put(pathname, body, {
        access: "public",
        addRandomSuffix: false,
        contentType,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      await prisma.item.update({
        where: { id },
        data: { imageUrl: url },
      });
      console.log(`  + #${id} -> ${url}`);
      uploaded++;
    } catch (e) {
      console.error(`  x #${id} falhou:`, e instanceof Error ? e.message : e);
    }
  }

  console.log(
    `\n[upload-images] concluido: ${uploaded} enviado(s), ${skipped} pulado(s).`,
  );

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("[upload-images] erro fatal:", e);
  await prisma.$disconnect();
  process.exit(1);
});
