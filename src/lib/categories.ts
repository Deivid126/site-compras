const CATEGORY_EMOJI: Record<string, string> = {
  brinquedos: "🧸",
  calcados: "👟",
  livros: "📚",
  roupas: "👕",
  quarto: "🛏️",
  higiene: "🧼",
  alimentacao: "🥄",
};

export function categoryEmoji(name: string | null): string {
  const key = (name ?? "").toLowerCase().trim();
  for (const [k, v] of Object.entries(CATEGORY_EMOJI)) {
    if (key.includes(k)) return v;
  }
  return "🎁";
}

export function hasImage(item: { imageUrl: string }): boolean {
  return Boolean(item.imageUrl && item.imageUrl.trim());
}