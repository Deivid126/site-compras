import { Prisma } from "@prisma/client";

type ItemWithPurchases = Prisma.ItemGetPayload<{
  include: { purchases: true };
}>;

type Entry<T> = { value: T; expiresAt: number };

type CacheShape = {
  items?: Entry<ItemWithPurchases[]>;
  visitors: Map<string, Entry<string[]>>;
};

const TTL_MS = 60_000;

const globalForCache = globalThis as unknown as {
  __giftCache?: CacheShape;
};

const cache: CacheShape =
  globalForCache.__giftCache ?? { visitors: new Map() };

if (process.env.NODE_ENV !== "production") {
  globalForCache.__giftCache = cache;
}

function alive<T>(e: Entry<T> | undefined): e is Entry<T> {
  return !!e && e.expiresAt > Date.now();
}

export function getItems(): ItemWithPurchases[] | undefined {
  return alive(cache.items) ? cache.items!.value : undefined;
}

export function setItems(items: ItemWithPurchases[]): void {
  cache.items = { value: items, expiresAt: Date.now() + TTL_MS };
}

export function getVisitorPurchases(
  vid: string,
): string[] | undefined {
  const e = cache.visitors.get(vid);
  return alive(e) ? e.value : undefined;
}

export function setVisitorPurchases(vid: string, ids: string[]): void {
  cache.visitors.set(vid, {
    value: ids,
    expiresAt: Date.now() + TTL_MS,
  });
}

export function clearAll(): void {
  cache.items = undefined;
  cache.visitors.clear();
}
