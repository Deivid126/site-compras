export type SizeEntry = {
  label: string;
  emoji: string;
  note?: string;
  values: (number | string)[];
};

export const SIZES: Record<string, SizeEntry> = {
  calcados: {
    label: "Calçado",
    emoji: "📏",
    note: "Tamanho do pezinho do Noah",
    values: [25, 26, 27],
  },
  roupas: {
    label: "Roupa",
    emoji: "👕",
    note: "Tamanho de roupa do Noah",
    values: [
      // TODO: inserir a lógica do número da roupa.
      // Sugestão: para 2 anos, geralmente "2 anos" (12-18m para bebês).
      // Ex. para habilitar: values: ["2 anos", "18-24m"]
    ],
  },
};

export function hasSizes(category: string | null): boolean {
  if (!category) return false;
  const key = category.toLowerCase().trim();
  const entry = SIZES[key];
  return Boolean(entry && entry.values.length > 0);
}

export function sizesFor(category: string | null): SizeEntry | null {
  if (!category) return null;
  const key = category.toLowerCase().trim();
  return SIZES[key] ?? null;
}