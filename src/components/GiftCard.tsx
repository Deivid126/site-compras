"use client";

import type { ItemView } from "@/lib/types";
import { categoryEmoji, hasImage } from "@/lib/categories";
import { formatBRL } from "@/lib/format";

export default function GiftCard({
  item,
  onComprar,
}: {
  item: ItemView;
  onComprar: () => void;
}) {
  return (
    <article className="card">
      <div className="card-img-wrap">
        {hasImage(item) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imageUrl} alt={item.title} loading="lazy" />
        ) : (
          <div className="card-img-placeholder" aria-hidden="true">
            <span>{categoryEmoji(item.category)}</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        {item.description && (
          <p className="card-desc">{item.description}</p>
        )}
        {(item.priceCents > 0 || item.size) && (
          <div className="card-meta">
            {item.priceCents > 0 && (
              <span className="card-price">{formatBRL(item.priceCents)}</span>
            )}
            {item.size && (
              <span className="size-chip card-size-chip">Tam: {item.size}</span>
            )}
          </div>
        )}
        <a
          className="btn-primary card-cta"
          href={item.storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onComprar}
        >
          Comprar 🏎️
        </a>
      </div>
    </article>
  );
}
