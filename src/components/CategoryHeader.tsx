"use client";

import { useEffect, useState } from "react";

export type CategoryRef = {
  name: string;
  id: string;
};

export default function CategoryHeader({
  categories,
}: {
  categories: CategoryRef[];
}) {
  const [activeId, setActiveId] = useState<string | null>(
    categories[0]?.id ?? null,
  );

  useEffect(() => {
    if (categories.length === 0) return;
    if (typeof IntersectionObserver === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const targets = categories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    if (targets.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestId) setActiveId(bestId);
      },
      {
        rootMargin: "-96px 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const t of targets) observer.observe(t);

    const nav = document.getElementById("catbar-nav");
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#cat-"]') as HTMLAnchorElement | null;
      if (!link) return;
      e.preventDefault();
      const id = link.getAttribute("href")!.slice(1);
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
        setActiveId(id);
      }
    }
    nav?.addEventListener("click", handleClick);

    return () => {
      observer.disconnect();
      nav?.removeEventListener("click", handleClick);
    };
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <header className="catbar">
      <nav className="catbar-nav" id="catbar-nav" aria-label="Categorias">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="catbar-link"
            aria-current={activeId === c.id ? "page" : undefined}
          >
            {c.name}
          </a>
        ))}
      </nav>
      <span className="catbar-brand">Noah 🏎️</span>
    </header>
  );
}