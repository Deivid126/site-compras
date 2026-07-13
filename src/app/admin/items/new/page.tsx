export const dynamic = "force-dynamic";

import Link from "next/link";

const CATEGORIES = ["Calçados", "Brinquedos", "Roupas"];

export default function NewItemPage() {
  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Novo presente</h1>
          <p className="admin-sub">Cadastrar um novo item</p>
        </div>
        <Link href="/admin" className="btn-secondary">
          Voltar
        </Link>
      </header>

      <form action="/api/admin/items" method="POST" className="admin-form admin-form-wide">
        <label htmlFor="title" className="field-label">
          Titulo *
        </label>
        <input id="title" name="title" type="text" className="input" required />

        <label htmlFor="description" className="field-label">
          Descricao
        </label>
        <textarea
          id="description"
          name="description"
          className="input"
          rows={3}
        />

        <label htmlFor="category" className="field-label">
          Categoria
        </label>
        <select id="category" name="category" className="input">
          <option value="">Sem categoria</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="priceCents" className="field-label">
          Preco (R$) — use centavos
        </label>
        <input
          id="priceCents"
          name="priceCents"
          type="number"
          className="input"
          defaultValue="0"
          min="0"
        />

        <label htmlFor="size" className="field-label">
          Tamanho
        </label>
        <input id="size" name="size" type="text" className="input" />

        <label htmlFor="storeUrl" className="field-label">
          URL da loja *
        </label>
        <input
          id="storeUrl"
          name="storeUrl"
          type="url"
          className="input"
          required
        />

        <label htmlFor="imageUrl" className="field-label">
          URL da imagem (opcional)
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          className="input"
        />

        <button type="submit" className="btn-primary">
          Criar presente
        </button>
      </form>
    </main>
  );
}
