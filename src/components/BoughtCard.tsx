import type { ItemView } from "@/lib/types";
import { formatBRL } from "@/lib/format";

export default function BoughtCard({ item }: { item: ItemView }) {
  return (
    <article className="card card-bought" aria-disabled="true">
      <div className="card-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.title} loading="lazy" />
        <span className="badge">Comprado! 🎉</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <div className="card-price">{formatBRL(item.priceCents)}</div>
        {item.buyerName && (
          <p className="thanks">
            Obrigado, <strong>{item.buyerName}</strong>! 💛
          </p>
        )}
      </div>
    </article>
  );
}
