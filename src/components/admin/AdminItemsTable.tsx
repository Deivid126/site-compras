"use client";

import { useMemo, useState } from "react";
import { formatBRL } from "@/lib/format";
import DeleteButton from "./DeleteButton";

export type AdminItem = {
  id: string;
  title: string;
  category: string | null;
  priceCents: number;
  size: string;
  imageUrl: string;
  active: boolean;
  buyerName: string | null;
};

export default function AdminItemsTable({
  items,
  deleteBase,
  editBase,
}: {
  items: AdminItem[];
  deleteBase: string;
  editBase: string;
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("all");
  const [status, setStatus] = useState("all");

  const categories = useMemo(
    () =>
      [...new Set(items.map((i) => i.category).filter(Boolean))] as string[],
    [items],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (q && !i.title.toLowerCase().includes(q) && !(i.buyerName ?? "").toLowerCase().includes(q))
        return false;
      if (cat !== "all" && (i.category ?? "Outros") !== cat) return false;
      if (status === "available" && !i.active) return false;
      if (status === "bought" && i.active) return false;
      return true;
    });
  }, [items, query, cat, status]);

  return (
    <>
      <div className="adm-toolbar">
        <div className="adm-search">
          <svg className="adm-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Buscar por título ou comprador…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="adm-search-input"
          />
        </div>

        <div className="adm-filters">
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="adm-select"
            aria-label="Filtrar por categoria"
          >
            <option value="all">Todas categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
            <option value="Outros">Outros</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="adm-select"
            aria-label="Filtrar por status"
          >
            <option value="all">Todos status</option>
            <option value="available">Disponíveis</option>
            <option value="bought">Comprados</option>
          </select>
        </div>
      </div>

      <p className="adm-count">
        {filtered.length} {filtered.length === 1 ? "item" : "itens"}
      </p>

      {/* Desktop table */}
      <div className="adm-table-scroll">
        <table className="adm-table">
          <thead>
            <tr>
              <th className="col-thumb"></th>
              <th>Item</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Tam.</th>
              <th>Status</th>
              <th>Comprador</th>
              <th className="col-actions">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td className="col-thumb">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt="" className="adm-thumb-img" />
                  ) : (
                    <span className="adm-thumb-ph">🎁</span>
                  )}
                </td>
                <td className="col-title">{item.title}</td>
                <td className="col-muted">{item.category ?? "Outros"}</td>
                <td className="col-price">
                  {item.priceCents > 0 ? formatBRL(item.priceCents) : "—"}
                </td>
                <td className="col-muted">{item.size || "—"}</td>
                <td>
                  <span className={`adm-pill ${item.active ? "adm-pill-ok" : "adm-pill-warn"}`}>
                    {item.active ? "Disponível" : "Comprado"}
                  </span>
                </td>
                <td className="col-muted">{item.buyerName ?? "—"}</td>
                <td className="col-actions">
                  <div className="adm-row-actions">
                    <a href={`${editBase}/${item.id}`} className="adm-btn adm-btn-ghost">
                      Editar
                    </a>
                    <DeleteButton
                      action={`${deleteBase}/${item.id}`}
                      itemId={item.id}
                      itemTitle={item.title}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="adm-cards-mobile">
        {filtered.map((item) => (
          <div key={item.id} className="adm-card-m">
            <div className="adm-card-m-top">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.imageUrl} alt="" className="adm-thumb-img" />
              ) : (
                <span className="adm-thumb-ph">🎁</span>
              )}
              <div className="adm-card-m-info">
                <strong className="adm-card-m-title">{item.title}</strong>
                <span className="adm-card-m-meta">
                  {item.category ?? "Outros"}
                  {item.size ? ` · Tam ${item.size}` : ""}
                </span>
                <span className="adm-card-m-price">
                  {item.priceCents > 0 ? formatBRL(item.priceCents) : "Sem preço"}
                </span>
              </div>
              <span className={`adm-pill ${item.active ? "adm-pill-ok" : "adm-pill-warn"}`}>
                {item.active ? "Disp." : "Comprado"}
              </span>
            </div>
            {item.buyerName && (
              <p className="adm-card-m-buyer">Comprado por <strong>{item.buyerName}</strong></p>
            )}
            <div className="adm-card-m-actions">
              <a href={`${editBase}/${item.id}`} className="adm-btn adm-btn-ghost">
                Editar
              </a>
              <DeleteButton
                action={`${deleteBase}/${item.id}`}
                itemId={item.id}
                itemTitle={item.title}
              />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="adm-empty">
          <span className="adm-empty-icon">🏁</span>
          <p>Nenhum item encontrado.</p>
        </div>
      )}
    </>
  );
}