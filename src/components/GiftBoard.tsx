"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import type { ItemView, ConfirmResult } from "@/lib/types";
import { categoryId } from "@/lib/format";
import { categoryEmoji } from "@/lib/categories";
import type { CategoryGroup } from "@/app/page";
import GiftCard from "./GiftCard";
import BoughtCard from "./BoughtCard";
import ReturningModal from "./ReturningModal";

const CLICKED_KEY = "clickedItems";

function readClicked(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CLICKED_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed)
      ? parsed.filter((n): n is string => typeof n === "string")
      : [];
  } catch {
    return [];
  }
}

function writeClicked(ids: string[]) {
  try {
    localStorage.setItem(CLICKED_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export default function GiftBoard({
  groups,
  confirmedItemIds,
}: {
  groups: CategoryGroup[];
  confirmedItemIds: string[];
}) {
  const router = useRouter();
  const [clicked, setClicked] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState<string[]>(confirmedItemIds);
  const [modalOpen, setModalOpen] = useState(false);
  const didInit = useRef(false);
  const hadFocus = useRef(false);
  const confirmedRef = useRef(confirmed);

  const allItems = groups.flatMap((g) => g.items);

  useEffect(() => {
    confirmedRef.current = confirmed;
  }, [confirmed]);

  function checkPending() {
    const c = readClicked();
    setClicked(c);
    const pending = c.filter(
      (id) =>
        !confirmedRef.current.includes(id) &&
        allItems.some((i) => i.id === id && i.active),
    );
    if (pending.length) setModalOpen(true);
  }

  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    checkPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === "hidden") {
        hadFocus.current = true;
      } else if (hadFocus.current) {
        hadFocus.current = false;
        checkPending();
      }
    }
    function onFocus() {
      if (hadFocus.current) {
        hadFocus.current = false;
        checkPending();
      }
    }
    function onBlur() {
      hadFocus.current = true;
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function recordClick(id: string) {
    setClicked((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      writeClicked(next);
      return next;
    });
  }

  async function handleConfirm(
    itemId: string,
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

  const activeGroups = groups
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => i.active),
    }))
    .filter((g) => g.items.length > 0);

  const boughtItems = allItems.filter((i) => !i.active);

  return (
    <>
      {activeGroups.length > 0 ? (
        <section className="board" aria-label="Presentes disponiveis">
          {activeGroups.map((g) => (
            <div className="category" id={categoryId(g.name)} key={g.name}>
              <h2 className="category-title">
                <span className="category-emoji">{categoryEmoji(g.name)}</span>
                {g.name}
              </h2>
              <div className="grid">
                {g.items.map((i) => (
                  <GiftCard
                    key={i.id}
                    item={i}
                    onComprar={() => recordClick(i.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="board">
          <p className="empty">Toda a lista já foi! Muito obrigado a todos! 🏁💛</p>
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
          items={allItems}
          clicked={clicked}
          confirmed={confirmed}
          onConfirm={handleConfirm}
          onClose={closeModal}
        />
      )}
    </>
  );
}
