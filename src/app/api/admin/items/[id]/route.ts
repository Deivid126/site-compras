import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clearAll } from "@/lib/cache";

const CATEGORIES = ["Calçados", "Brinquedos", "Roupas"];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const form = await req.formData();
  const method = String(form.get("_method") ?? "PATCH").toUpperCase();

  if (method === "DELETE") {
    try {
      await prisma.item.update({
        where: { id },
        data: { deleted: true },
      });
      clearAll();
      return NextResponse.redirect(new URL("/admin", req.url));
    } catch {
      return NextResponse.json({ error: "not-found" }, { status: 404 });
    }
  }

  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim() || null;
  const category = String(form.get("category") ?? "").trim() || null;
  const priceCents = Math.round(Number(form.get("priceCents") ?? 0));
  const size = String(form.get("size") ?? "").trim();
  const storeUrl = String(form.get("storeUrl") ?? "").trim();
  const active = form.get("active") === "on";

  if (!title || !storeUrl) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (category && !CATEGORIES.includes(category)) {
    return NextResponse.json({ error: "invalid-category" }, { status: 400 });
  }
  if (!Number.isFinite(priceCents) || priceCents < 0) {
    return NextResponse.json({ error: "invalid-price" }, { status: 400 });
  }

  try {
    await prisma.item.update({
      where: { id },
      data: { title, description, category, priceCents, size, storeUrl, active },
    });
    clearAll();
    return NextResponse.redirect(new URL("/admin", req.url));
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === "P2002") {
      return NextResponse.json(
        { error: "storeUrl already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
