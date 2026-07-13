import { SIZES } from "@/lib/sizes";

const CATEGORY_LABEL: Record<string, string> = {
  calcados: "Calçados",
  roupas: "Roupas",
};

const items = (Object.entries(SIZES) as [string, (typeof SIZES)[string]][]).map(
  ([key, entry]) => ({
    key,
    entry,
    categoryLabel: CATEGORY_LABEL[key] ?? entry.label,
  }),
);

export default function SizeBanner() {
  return (
    <aside className="size-banner" aria-label="Tamanhos do Noah">
      <div className="size-banner-head">
        <span className="size-banner-title">📏 Tamanhos do Noah</span>
        <span className="size-banner-sub">Para acertar no presente 🎯</span>
      </div>
      <div className="size-banner-grid">
        {items.map(({ key, entry, categoryLabel }) => (
          <div
            className={
              "size-row" +
              (entry.values.length === 0 ? " size-row-empty" : "")
            }
            key={key}
          >
            <span className="size-row-label">
              <span className="size-row-emoji" aria-hidden="true">
                {entry.emoji}
              </span>
              {categoryLabel}
            </span>
            <span className="size-row-values">
              {entry.values.length === 0 ? (
                <span className="size-chip size-chip-tbd">em breve</span>
              ) : (
                entry.values.map((v) => (
                  <span className="size-chip" key={String(v)}>
                    {String(v)}
                  </span>
                ))
              )}
            </span>
            {entry.note && <span className="size-row-note">{entry.note}</span>}
          </div>
        ))}
      </div>
    </aside>
  );
}