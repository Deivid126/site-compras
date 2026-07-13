import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

const CATEGORIES = ["Calçados", "Brinquedos", "Roupas"];

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.item.findUnique({
    where: { id },
    include: { purchases: true },
  });

  if (!item || item.deleted) {
    notFound();
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Editar presente</h1>
          <p className="admin-sub">{item.title}</p>
        </div>
        <Link href="/admin" className="btn-secondary">
          Voltar
        </Link>
      </header>

      {item.purchases[0] && (
        <div className="admin-buyer-info">
          <strong>Comprado por:</strong> {item.purchases[0].buyerName}
        </div>
      )}

      <form
        action={`/api/admin/items/${item.id}`}
        method="POST"
        className="admin-form admin-form-wide"
      >
        <input type="hidden" name="_method" value="PATCH" />

        <label htmlFor="title" className="field-label">
          Titulo *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className="input"
          defaultValue={item.title}
          required
        />

        <label htmlFor="description" className="field-label">
          Descricao
        </label>
        <textarea
          id="description"
          name="description"
          className="input"
          rows={3}
          defaultValue={item.description ?? ""}
        />

        <label htmlFor="category" className="field-label">
          Categoria
        </label>
        <select
          id="category"
          name="category"
          className="input"
          defaultValue={item.category ?? ""}
        >
          <option value="">Sem categoria</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label htmlFor="priceCents" className="field-label">
          Preco (centavos)
        </label>
        <input
          id="priceCents"
          name="priceCents"
          type="number"
          className="input"
          defaultValue={item.priceCents}
          min="0"
        />

        <label htmlFor="size" className="field-label">
          Tamanho
        </label>
        <input
          id="size"
          name="size"
          type="text"
          className="input"
          defaultValue={item.size}
        />

        <label htmlFor="storeUrl" className="field-label">
          URL da loja *
        </label>
        <input
          id="storeUrl"
          name="storeUrl"
          type="url"
          className="input"
          defaultValue={item.storeUrl}
          required
        />

        <label className="field-label admin-checkbox">
          <input
            type="checkbox"
            name="active"
            defaultChecked={item.active}
          />
          Disponivel (ativo)
        </label>

        <button type="submit" className="btn-primary">
          Salvar alteracoes
        </button>
      </form>

      <div className="admin-image-section">
        <h2 className="admin-section-title">Imagem</h2>
        {item.imageUrl ? (
          <div className="admin-current-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.title} />
          </div>
        ) : (
          <p className="admin-no-img">Sem imagem cadastrada.</p>
        )}

        <form
          action={`/api/admin/items/${item.id}/image`}
          method="POST"
          encType="multipart/form-data"
          className="admin-form"
        >
          <label htmlFor="image" className="field-label">
            Nova imagem
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            required
          />
          <button type="submit" className="btn-primary">
            Enviar imagem
          </button>
        </form>
      </div>

      <div className="admin-danger-zone">
        <h2 className="admin-section-title">Zona de perigo</h2>
        <form
          action={`/api/admin/items/${item.id}`}
          method="POST"
          style={{ display: "inline" }}
        >
          <input type="hidden" name="_method" value="DELETE" />
          <button type="submit" className="btn-danger">
            Deletar presente
          </button>
        </form>
      </div>
    </main>
  );
}
