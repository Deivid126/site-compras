import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminItemsTable, { type AdminItem } from "@/components/admin/AdminItemsTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const items = await prisma.item.findMany({
    where: { deleted: false },
    include: { purchases: true },
    orderBy: [{ active: "desc" }, { title: "asc" }],
  });

  const rows: AdminItem[] = items.map((i) => ({
    id: i.id,
    title: i.title,
    category: i.category,
    priceCents: i.priceCents,
    size: i.size,
    imageUrl: i.imageUrl,
    active: i.active,
    buyerName: i.purchases[0]?.buyerName ?? null,
  }));

  const total = rows.length;
  const available = rows.filter((r) => r.active).length;
  const bought = rows.filter((r) => !r.active).length;

  return (
    <div className="adm-content">
      <div className="adm-head-row">
        <div>
          <h1 className="adm-page-title">Presentes</h1>
          <p className="adm-page-sub">Gerencie os itens da lista</p>
        </div>
        <Link href="/admin/items/new" className="adm-btn adm-btn-primary">
          + Novo presente
        </Link>
      </div>

      <div className="adm-stats">
        <div className="adm-stat">
          <span className="adm-stat-num">{total}</span>
          <span className="adm-stat-label">Total</span>
        </div>
        <div className="adm-stat adm-stat-ok">
          <span className="adm-stat-num">{available}</span>
          <span className="adm-stat-label">Disponíveis</span>
        </div>
        <div className="adm-stat adm-stat-warn">
          <span className="adm-stat-num">{bought}</span>
          <span className="adm-stat-label">Comprados</span>
        </div>
      </div>

      <AdminItemsTable
        items={rows}
        editBase="/admin/items"
        deleteBase="/api/admin/items"
      />
    </div>
  );
}