"use client";

import type { ItemView } from "@/lib/types";
import { categoryEmoji, hasImage } from "@/lib/categories";

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
