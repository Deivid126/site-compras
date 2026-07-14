"use client";

import { useState } from "react";
import { categoryEmoji } from "@/lib/categories";

export type AdminCategory = {
  id: string;
  name: string;
  emoji: string | null;
  showInMenu: boolean;
  visible: boolean;
  order: number;
  itemCount: number;
};

type Update = {
  showInMenu?: boolean;
  visible?: boolean;
  order?: number;
  emoji?: string | null;
};

export default function CategoryManager({
  categories,
}: {
  categories: AdminCategory[];
}) {
  const [rows, setRows] = useState<AdminCategory[]>(categories);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function patch(name: string, patch: Update) {
    setSaving(name);
    setError(null);
    try {
      const res = await fetch(
        `/api/admin/categories/${encodeURIComponent(name)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        },
      );
      if (!res.ok) {
        setError("Não foi possível salvar. Tente novamente.");
        return false;
      }
      setRows((prev) =>
        prev.map((r) => (r.name === name ? { ...r, ...patch } : r)),
      );
      return true;
    } catch {
      setError("Erro de conexão ao salvar.");
      return false;
    } finally {
      setSaving(null);
    }
  }

  return (
    <>
      {error && <p className="adm-error-banner">{error}</p>}

      <p className="adm-count">
        {rows.length} {rows.length === 1 ? "categoria" : "categorias"}
      </p>

      <div className="adm-table-scroll">
        <table className="adm-table adm-cat-table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th className="col-num">Itens</th>
              <th className="col-toggle">No menu</th>
              <th className="col-toggle">Visível p/ visitantes</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="col-title">
                  <span className="adm-cat-emoji">
                    {c.emoji ?? categoryEmoji(c.name)}
                  </span>
                  {c.name}
                </td>
                <td className="col-num">{c.itemCount}</td>
                <td className="col-toggle">
                  <Toggle
                    checked={c.showInMenu}
                    disabled={saving === c.name}
                    onChange={(v) => patch(c.name, { showInMenu: v })}
                    label={`Mostrar ${c.name} no menu`}
                  />
                </td>
                <td className="col-toggle">
                  <Toggle
                    checked={c.visible}
                    disabled={saving === c.name}
                    onChange={(v) => patch(c.name, { visible: v })}
                    label={`Exibir itens de ${c.name} para visitantes`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="adm-cards-mobile">
        {rows.map((c) => (
          <div key={c.id} className="adm-card-m">
            <div className="adm-card-m-top">
              <div className="adm-card-m-info">
                <strong className="adm-card-m-title">
                  <span className="adm-cat-emoji">
                    {c.emoji ?? categoryEmoji(c.name)}
                  </span>
                  {c.name}
                </strong>
                <span className="adm-card-m-meta">
                  {c.itemCount} {c.itemCount === 1 ? "item" : "itens"}
                </span>
              </div>
            </div>
            <div className="adm-card-m-toggles">
              <label className="adm-toggle-row">
                <span>No menu</span>
                <Toggle
                  checked={c.showInMenu}
                  disabled={saving === c.name}
                  onChange={(v) => patch(c.name, { showInMenu: v })}
                  label={`Mostrar ${c.name} no menu`}
                />
              </label>
              <label className="adm-toggle-row">
                <span>Visível p/ visitantes</span>
                <Toggle
                  checked={c.visible}
                  disabled={saving === c.name}
                  onChange={(v) => patch(c.name, { visible: v })}
                  label={`Exibir itens de ${c.name} para visitantes`}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <div className="adm-empty">
          <span className="adm-empty-icon">🏷️</span>
          <p>Nenhuma categoria cadastrada ainda.</p>
        </div>
      )}

      <p className="adm-help-text">
        Desligar <strong>No menu</strong> remove a categoria da barra de
        navegação, mas os itens continuam visíveis. Desligar{" "}
        <strong>Visível p/ visitantes</strong> esconde os itens da categoria no
        site público.
      </p>
    </>
  );
}

function Toggle({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`adm-switch ${checked ? "adm-switch-on" : ""}`}
    >
      <span className="adm-switch-knob" />
    </button>
  );
}