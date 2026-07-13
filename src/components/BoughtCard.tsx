import type { ItemView } from "@/lib/types";
import { categoryEmoji, hasImage } from "@/lib/categories";

export default function BoughtCard({ item }: { item: ItemView }) {
  return (
    <article className="card card-bought">
      <div className="card-img-wrap">
        {hasImage(item) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.title} loading="lazy" />
        ) : (
          <div className="card-img-placeholder" aria-hidden="true">
            <span>{categoryEmoji(item.category)}</span>
          </div>
        )}
        <span className="badge">Comprado! 🏁</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        {item.size && (
          <p className="card-size">
            <span className="size-chip card-size-chip">Tam: {item.size}</span>
          </p>
        )}
        {item.buyerName && (
          <p className="thanks">
            Obrigado, <strong>{item.buyerName}</strong>! 💛
          </p>
        )}
      </div>
    </article>
  );
}
