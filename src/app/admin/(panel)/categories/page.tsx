import { prisma } from "@/lib/prisma";
import CategoryManager, { type AdminCategory } from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const rows = await prisma.category.findMany({
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });

  const counts = await prisma.item.groupBy({
    by: ["category"],
    where: { deleted: false },
    _count: { _all: true },
  });
  const countMap = new Map<string, number>();
  for (const c of counts) {
    if (c.category) countMap.set(c.category, c._count._all);
  }

  const categories: AdminCategory[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    emoji: r.emoji,
    showInMenu: r.showInMenu,
    visible: r.visible,
    order: r.order,
    itemCount: countMap.get(r.name) ?? 0,
  }));

  return (
    <div className="adm-content">
      <div className="adm-head-row">
        <div>
          <h1 className="adm-page-title">Categorias</h1>
          <p className="adm-page-sub">
            Controle a exibição das categorias no menu e para os visitantes
          </p>
        </div>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}