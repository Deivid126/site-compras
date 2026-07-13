import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { clearAll } from "@/lib/cache";

const MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const form = await req.formData();
  const file = form.get("image");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "no-file" }, { status: 400 });
  }

  const contentType = file.type;
  if (!MIME[contentType]) {
    return NextResponse.json({ error: "unsupported-type" }, { status: 400 });
  }

  const ext = MIME[contentType];
  const pathname = `items/${id}${ext}`;

  try {
    const { url } = await put(pathname, file, {
      access: "public",
      addRandomSuffix: false,
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    await prisma.item.update({
      where: { id },
      data: { imageUrl: url },
    });
    clearAll();
    return NextResponse.redirect(new URL(`/admin/items/${id}`, req.url));
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "server" },
      { status: 500 },
    );
  }
}
