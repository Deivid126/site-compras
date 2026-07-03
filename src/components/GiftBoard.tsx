"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import type { ItemView, ConfirmResult } from "@/lib/types";
import GiftCard from "./GiftCard";
import BoughtCard from "./BoughtCard";
import ReturningModal from "./ReturningModal";

const CLICKED_KEY = "clickedItems";

function readClicked(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLICKED_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((n): n is number => typeof n === "number")
      : [];
  } catch {
    return [];
  }
}

function writeClicked(ids: number[]) {
  try {
    localStorage.setItem(CLICKED_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export default function GiftBoard({
  items,
  confirmedItemIds,
}: {
  items: ItemView[];
  confirmedItemIds: number[];
}) {
  const router = useRouter();
  const [clicked, setClicked] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState<number[]>(confirmedItemIds);
  const [modalOpen, setModalOpen] = useState(false);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const c = readClicked();
    setClicked(c);
    const pending = c.filter(
      (id) =>
        !confirmed.includes(id) &&
        items.some((i) => i.id === id && i.active),
    );
    if (pending.length) setModalOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function recordClick(id: number) {
    setClicked((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeClicked(next);
      return next;
    });
  }

  async function handleConfirm(
    itemId: number,
    buyerName: string,
  ): Promise<ConfirmResult> {
    let result: ConfirmResult;
    try {
      const res = await fetch("/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, buyerName }),
      });

      if (res.ok) {
        confetti({
          particleCount: 180,
          spread: 95,
          startVelocity: 45,
          origin: { y: 0.6 },
        });
        setConfirmed((prev) =>
          prev.includes(itemId) ? prev : [...prev, itemId],
        );
        setClicked((prev) => {
          const next = prev.filter((x) => x !== itemId);
          writeClicked(next);
          return next;
        });
        setModalOpen(false);
        result = { ok: true };
      } else if (res.status === 409) {
        result = { ok: false, error: "already-bought" };
      } else {
        result = { ok: false, error: "server" };
      }
    } catch {
      result = { ok: false, error: "server" };
    }

    router.refresh();
    return result;
  }

  function closeModal() {
    setModalOpen(false);
  }

  const activeItems = items.filter((i) => i.active);
  const boughtItems = items.filter((i) => !i.active);

  return (
    <>
      {activeItems.length > 0 ? (
        <section className="board" aria-label="Presentes disponiveis">
          <div className="grid">
            {activeItems.map((i) => (
              <GiftCard
                key={i.id}
                item={i}
                onComprar={() => recordClick(i.id)}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="board">
          <p className="empty">Toda a pista já foi! Muito obrigado a todos! 🏁💛</p>
        </section>
      )}

      {boughtItems.length > 0 && (
        <section className="bought-section" aria-label="Presentes ja escolhidos">
          <h2 className="bought-title">
            🏁 Presentes já largaram 🏁
          </h2>
          <div className="grid bought-grid">
            {boughtItems.map((i) => (
              <BoughtCard key={i.id} item={i} />
            ))}
          </div>
        </section>
      )}

      {modalOpen && (
        <ReturningModal
          items={items}
          clicked={clicked}
          confirmed={confirmed}
          onConfirm={handleConfirm}
          onClose={closeModal}
        />
      )}
    </>
  );
}
