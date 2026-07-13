import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PriceInput from "@/components/PriceInput";
import DeleteButton from "@/components/admin/DeleteButton";
import ImageUploadForm from "@/components/admin/ImageUploadForm";

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
    <div className="adm-content">
      <nav className="adm-breadcrumb">
        <Link href="/admin">Itens</Link>
        <span className="adm-crumb-sep">/</span>
        <span className="adm-crumb-current">{item.title}</span>
      </nav>

      <h1 className="adm-page-title">Editar presente</h1>
      <p className="adm-page-sub">{item.title}</p>

      {item.purchases[0] && (
        <div className="adm-alert adm-alert-warn">
          <strong>Comprado por:</strong> {item.purchases[0].buyerName}
        </div>
      )}

      <form action={`/api/admin/items/${item.id}`} method="POST" className="adm-form-grid">
        <input type="hidden" name="_method" value="PATCH" />

        <div className="adm-section">
          <h2 className="adm-section-h">Dados do produto</h2>

          <div className="adm-form-row">
            <div className="adm-field">
              <label htmlFor="title" className="adm-field-label">Título *</label>
              <input id="title" name="title" type="text" className="adm-input"
                defaultValue={item.title} required />
            </div>
          </div>

          <div className="adm-form-row">
            <div className="adm-field">
              <label htmlFor="description" className="adm-field-label">Descrição</label>
              <textarea id="description" name="description" className="adm-input" rows={3}
                defaultValue={item.description ?? ""} />
            </div>
          </div>

          <div className="adm-form-row-2">
            <div className="adm-field">
              <label htmlFor="category" className="adm-field-label">Categoria</label>
              <select id="category" name="category" className="adm-input"
                defaultValue={item.category ?? ""}>
                <option value="">Sem categoria</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="adm-field">
              <label htmlFor="size" className="adm-field-label">Tamanho</label>
              <input id="size" name="size" type="text" className="adm-input"
                defaultValue={item.size} placeholder="Ex: 25, M, 2 anos" />
            </div>
          </div>

          <div className="adm-form-row-2">
            <div className="adm-field">
              <label className="adm-field-label">Preço (R$)</label>
              <PriceInput initialCents={item.priceCents} />
            </div>

            <div className="adm-field">
              <label className="adm-field-label">Disponibilidade</label>
              <label className="adm-switch">
                <input type="checkbox" name="active" defaultChecked={item.active} />
                <span className="adm-switch-track">
                  <span className="adm-switch-thumb" />
                </span>
                <span className="adm-switch-label">
                  {item.active ? "Disponível" : "Indisponível"}
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="adm-section">
          <h2 className="adm-section-h">Links</h2>

          <div className="adm-form-row">
            <div className="adm-field">
              <label htmlFor="storeUrl" className="adm-field-label">URL da loja *</label>
              <input id="storeUrl" name="storeUrl" type="url" className="adm-input"
                defaultValue={item.storeUrl} required placeholder="https://…" />
            </div>
          </div>
        </div>

        <div className="adm-form-actions">
          <Link href="/admin" className="adm-btn adm-btn-ghost">Cancelar</Link>
          <button type="submit" className="adm-btn adm-btn-primary">Salvar alterações</button>
        </div>
      </form>

      <div className="adm-section adm-image-section">
        <h2 className="adm-section-h">Imagem</h2>

        {item.imageUrl ? (
          <div className="adm-current-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.title} />
          </div>
        ) : (
          <p className="adm-no-img">Nenhuma imagem cadastrada.</p>
        )}

        <ImageUploadForm
          action={`/api/admin/items/${item.id}/image`}
          deleteAction={`/api/admin/items/${item.id}/image`}
          hasImage={Boolean(item.imageUrl)}
        />
      </div>

      <div className="adm-section adm-danger-zone">
        <h2 className="adm-section-h adm-danger-h">Zona de perigo</h2>
        <p className="adm-danger-desc">
          Remover este item da pista. A ação não pode ser desfeita pela interface.
        </p>
        <DeleteButton
          action={`/api/admin/items/${item.id}`}
          itemId={item.id}
          itemTitle={item.title}
          label="Deletar presente"
        />
      </div>
    </div>
  );
}