import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { clearAll } from "@/lib/cache";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("vid")?.value;
  if (!visitorId) {
    return NextResponse.json({ error: "no-visitor" }, { status: 400 });
  }

  let body: { itemId?: unknown; buyerName?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad-json" }, { status: 400 });
  }

  const itemId = Number(body?.itemId);
  const buyerName = String(body?.buyerName ?? "").trim();

  if (!Number.isInteger(itemId) || itemId <= 0 || !buyerName) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      select: { active: true },
    });
    if (!item || !item.active) {
      return NextResponse.json({ error: "already-bought" }, { status: 409 });
    }

    await prisma.purchase.create({
      data: { itemId, visitorId, buyerName },
    });
    await prisma.item.update({
      where: { id: itemId },
      data: { active: false },
    });

    clearAll();

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code;
    if (code === "P2002") {
      return NextResponse.json({ error: "already-bought" }, { status: 409 });
    }
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
