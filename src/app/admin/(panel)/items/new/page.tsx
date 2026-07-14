export const dynamic = "force-dynamic";

import Link from "next/link";
import PriceInput from "@/components/PriceInput";

const CATEGORIES = ["Calçados", "Brinquedos", "Roupas"];

export default function NewItemPage() {
  return (
    <div className="adm-content">
      <nav className="adm-breadcrumb">
        <Link href="/admin">Itens</Link>
        <span className="adm-crumb-sep">/</span>
        <span className="adm-crumb-current">Novo</span>
      </nav>

      <h1 className="adm-page-title">Novo presente</h1>
      <p className="adm-page-sub">Cadastre um item na lista</p>

      <form action="/api/admin/items" method="POST" className="adm-form-grid">
        <div className="adm-section">
          <h2 className="adm-section-h">Dados do produto</h2>

          <div className="adm-form-row">
            <div className="adm-field">
              <label htmlFor="title" className="adm-field-label">
                Título *
              </label>
              <input id="title" name="title" type="text" className="adm-input" required />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-field">
              <label htmlFor="description" className="adm-field-label">
                Descrição
              </label>
              <textarea id="description" name="description" className="adm-input" rows={3} />
            </div>
          </div>

          <div className="adm-form-row-2">
            <div className="adm-field">
              <label htmlFor="category" className="adm-field-label">
                Categoria
              </label>
              <select id="category" name="category" className="adm-input">
                <option value="">Sem categoria</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="adm-field">
              <label htmlFor="size" className="adm-field-label">
                Tamanho
              </label>
              <input id="size" name="size" type="text" className="adm-input" placeholder="Ex: 25, M, 2 anos" />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-field">
              <label className="adm-field-label">Preço (R$)</label>
              <PriceInput initialCents={0} />
            </div>
          </div>
        </div>

        <div className="adm-section">
          <h2 className="adm-section-h">Links</h2>

          <div className="adm-form-row">
            <div className="adm-field">
              <label htmlFor="storeUrl" className="adm-field-label">
                URL da loja *
              </label>
              <input id="storeUrl" name="storeUrl" type="url" className="adm-input" required
                placeholder="https://…" />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-field">
              <label htmlFor="imageUrl" className="adm-field-label">
                URL da imagem (opcional)
              </label>
              <input id="imageUrl" name="imageUrl" type="url" className="adm-input"
                placeholder="https://… (deixe vazio p/ subir depois)" />
            </div>
          </div>
        </div>

        <div className="adm-form-actions">
          <Link href="/admin" className="adm-btn adm-btn-ghost">Cancelar</Link>
          <button type="submit" className="adm-btn adm-btn-primary">Criar presente</button>
        </div>
      </form>
    </div>
  );
}