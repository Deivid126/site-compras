export type ItemView = {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  priceCents: number;
  imageUrl: string;
  storeUrl: string;
  active: boolean;
  buyerName: string | null;
  isMine: boolean;
};

export const UNCATEGORIZED = "Outros";

export type ConfirmResult =
  | { ok: true }
  | { ok: false; error: "already-bought" | "server" | "invalid" };
