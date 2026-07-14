import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clearAll } from "@/lib/cache";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ name: string }> };

export async function PATCH(req: NextRequest, ctx: Params) {
  const { name } = await ctx.params;
  const decoded = decodeURIComponent(name);
  const body = (await req.json().catch(() => ({}))) as {
    showInMenu?: unknown;
    visible?: unknown;
    order?: unknown;
    emoji?: unknown;
  };

  const data: Record<string, unknown> = {};
  if (typeof body.showInMenu === "boolean") data.showInMenu = body.showInMenu;
  if (typeof body.visible === "boolean") data.visible = body.visible;
  if (Number.isFinite(body.order)) data.order = Number(body.order);
  if (typeof body.emoji === "string") data.emoji = body.emoji.trim() || null;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "no-fields" }, { status: 400 });
  }

  try {
    const updated = await prisma.category.update({
      where: { name: decoded },
      data,
    });
    clearAll();
    revalidatePath("/");
    return NextResponse.json({ category: updated });
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === "P2025") {
      return NextResponse.json({ error: "not-found" }, { status: 404 });
    }
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}