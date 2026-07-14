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

export type CategoryFlag = {
  name: string;
  showInMenu: boolean;
  visible: boolean;
  order: number;
  emoji: string | null;
};

export async function getCategoryFlags(): Promise<Map<string, CategoryFlag>> {
  const { prisma } = await import("@/lib/prisma");
  const rows = await prisma.category.findMany();
  return new Map(rows.map((c) => [c.name, {
    name: c.name,
    showInMenu: c.showInMenu,
    visible: c.visible,
    order: c.order,
    emoji: c.emoji,
  }]));
}