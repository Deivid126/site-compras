import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import GiftBoard from "@/components/GiftBoard";
import CategoryHeader, { type CategoryRef } from "@/components/CategoryHeader";
import SizeBanner from "@/components/SizeBanner";
import ScrollTopButton from "@/components/ScrollTopButton";
import { categoryId } from "@/lib/format";
import type { ItemView } from "@/lib/types";
import { UNCATEGORIZED } from "@/lib/types";

export const dynamic = "force-dynamic";

export type CategoryGroup = {
  name: string;
  items: ItemView[];
};

export default async function Home() {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("vid")?.value ?? "";

  const items = await prisma.item.findMany({ include: { purchases: true } });
  const purchases = await prisma.purchase.findMany({
    where: { visitorId },
    select: { itemId: true },
  });
  const confirmedItemIds = purchases.map((p) => p.itemId);

  items.sort(
    (a, b) => Number(b.active) - Number(a.active) || a.id - b.id,
  );

  const view: ItemView[] = items.map((i) => ({
    id: i.id,
    title: i.title,
    description: i.description,
    category: i.category,
    priceCents: i.priceCents,
    imageUrl: i.imageUrl,
    storeUrl: i.storeUrl,
    active: i.active,
    buyerName: i.purchases[0]?.buyerName ?? null,
    isMine: i.purchases.some((p) => p.visitorId === visitorId),
  }));

  const boughtCount = view.filter((i) => !i.active).length;

  const groups: CategoryGroup[] = (() => {
    const map = new Map<string, ItemView[]>();
    for (const item of view) {
      const name = item.category?.trim() ? item.category.trim() : UNCATEGORIZED;
      const arr = map.get(name) ?? [];
      arr.push(item);
      map.set(name, arr);
    }
    const out = [...map.entries()].map(([name, items]) => ({ name, items }));
    out.sort((a, b) => (a.name === UNCATEGORIZED ? 1 : b.name === UNCATEGORIZED ? -1 : a.name.localeCompare(b.name, "pt-BR")));
    return out;
  })();

  const headerCategories: CategoryRef[] = groups.map((g) => ({
    name: g.name,
    id: categoryId(g.name),
  }));

  return (
    <main>
      <CategoryHeader categories={headerCategories} />
      <div className="decor" aria-hidden="true">
        <span style={{ left: "6%", top: "12%" }}>🏎️</span>
        <span style={{ left: "84%", top: "8%" }}>🏁</span>
        <span style={{ left: "18%", top: "70%" }}>🚦</span>
        <span style={{ left: "72%", top: "64%" }}>⚡</span>
        <span style={{ left: "48%", top: "20%" }}>🛞</span>
        <span style={{ left: "92%", top: "40%" }}>🏆</span>
        <span style={{ left: "3%", top: "45%" }}>🚗</span>
      </div>

      <div className="checkered" aria-hidden="true" />

      <header className="hero">
        <p className="hero-kicker">Festa de 2 aninhos do Noah 🏎️</p>
        <h1 className="hero-title">Pista de Presentes do Noah</h1>
        <p className="hero-sub">
          Escolha um presentinho para o nosso pequeno piloto. Obrigado pela
          volta de largada! 🏁
        </p>
        {boughtCount > 0 && (
          <p className="hero-badge">
            {boughtCount} {boughtCount === 1 ? "presente já foi escolhido" : "presentes já foram escolhidos"} 🏁
          </p>
        )}
      </header>

      <SizeBanner />

      <GiftBoard groups={groups} confirmedItemIds={confirmedItemIds} />

      <footer className="footer">
        <p>Feito com 💛 para o Noah virar 2 em grande estilo. 🏎️🏁</p>
      </footer>

      <ScrollTopButton />
    </main>
  );
}
