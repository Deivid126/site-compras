import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const items = await prisma.item.findMany({
    where: { deleted: false },
    include: { purchases: true },
    orderBy: [{ active: "desc" }, { title: "asc" }],
  });

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Painel Admin</h1>
          <p className="admin-sub">Pista de Presentes do Noah</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin/items/new" className="btn-primary">
            Novo presente
          </Link>
          <form action="/api/admin/logout" method="POST" style={{ display: "inline" }}>
            <button type="submit" className="btn-secondary">
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Titulo</th>
              <th>Categoria</th>
              <th>Preco</th>
              <th>Tamanho</th>
              <th>Status</th>
              <th>Comprador</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="admin-thumb">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.title} />
                  ) : (
                    <span className="admin-thumb-placeholder">🎁</span>
                  )}
                </td>
                <td>{item.title}</td>
                <td>{item.category ?? "Outros"}</td>
                <td>{item.priceCents > 0 ? formatBRL(item.priceCents) : "—"}</td>
                <td>{item.size || "—"}</td>
                <td>
                  {item.active ? (
                    <span className="admin-badge admin-badge-active">
                      Disponivel
                    </span>
                  ) : (
                    <span className="admin-badge admin-badge-bought">
                      Comprado
                    </span>
                  )}
                </td>
                <td>{item.purchases[0]?.buyerName ?? "—"}</td>
                <td className="admin-actions">
                  <a
                    href={`/admin/items/${item.id}`}
                    className="admin-link"
                  >
                    Editar
                  </a>
                  <form
                    action={`/api/admin/items/${item.id}`}
                    method="POST"
                    style={{ display: "inline" }}
                  >
                    <input type="hidden" name="_method" value="DELETE" />
                    <button
                      type="submit"
                      className="admin-link admin-link-danger"
                    >
                      Deletar
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && (
        <p className="admin-empty">Nenhum presente cadastrado.</p>
      )}
    </main>
  );
}
