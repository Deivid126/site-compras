"use client";

import { useState } from "react";
import type { ItemView, ConfirmResult } from "@/lib/types";
import { categoryEmoji, hasImage } from "@/lib/categories";

export default function ReturningModal({
  items,
  clicked,
  confirmed,
  onConfirm,
  onClose,
}: {
  items: ItemView[];
  clicked: string[];
  confirmed: string[];
  onConfirm: (itemId: string, buyerName: string) => Promise<ConfirmResult>;
  onClose: () => void;
}) {
  const pending = clicked
    .filter((id) => !confirmed.includes(id))
    .map((id) => items.find((i) => i.id === id))
    .filter((i): i is ItemView => Boolean(i));

  const activePending = pending.filter((i) => i.active);
  const gonePending = pending.filter((i) => !i.active);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "conflict" | "error"
  >("idle");

  const selected = activePending.find((i) => i.id === selectedId) ?? null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedId || !name.trim()) return;
    setStatus("submitting");
    const res = await onConfirm(selectedId, name.trim());
    if (res.ok) return; // o pai fecha o modal e dispara confetti
    if (res.error === "already-bought") setStatus("conflict");
    else setStatus("error");
  }

  function backToList() {
    setSelectedId(null);
    setStatus("idle");
  }

  const nothingToAsk = activePending.length === 0 && gonePending.length === 0;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal">
        {nothingToAsk && (
          <>
            <h2 id="modal-title">Que bom te ver de novo! 🏎️</h2>
            <p>Tudo certo por aqui. Obrigado pela volta! 🏁</p>
            <button className="btn-primary" onClick={onClose}>
              Fechar
            </button>
          </>
        )}

        {!nothingToAsk && !selected && (
          <>
            <h2 id="modal-title">Você voltou! 🏁</h2>
            <p>
              Voce se interessou por alguns presentinhos. Comprou algum deles?
            </p>

            <div className="modal-list">
              {activePending.map((i) => (
                <button
                  key={i.id}
                  className="modal-item"
                  onClick={() => setSelectedId(i.id)}
                  type="button"
                >
                  {hasImage(i) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.imageUrl} alt={i.title} />
                  ) : (
                    <span className="modal-item-emoji" aria-hidden="true">
                      {categoryEmoji(i.category)}
                    </span>
                  )}
                  <div className="modal-item-info">
                    <strong>{i.title}</strong>
                  </div>
                  <span className="modal-item-cta">Sim, comprei!</span>
                </button>
              ))}

              {gonePending.map((i) => (
                <div key={i.id} className="modal-item gone">
                  {hasImage(i) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.imageUrl} alt={i.title} />
                  ) : (
                    <span className="modal-item-emoji" aria-hidden="true">
                      {categoryEmoji(i.category)}
                    </span>
                  )}
                  <div className="modal-item-info">
                    <strong>{i.title}</strong>
                    <span>Ja foi comprado por outra pessoa 😊</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn-secondary"
              onClick={onClose}
              type="button"
            >
              Ainda nao comprei
            </button>
          </>
        )}

        {!nothingToAsk && selected && (
          <form onSubmit={submit}>
            <h2>Oba! 🏎️</h2>
            <p>
              Voce comprou <strong>{selected.title}</strong>.
            </p>

            <label htmlFor="buyer-name" className="field-label">
              Como voce se chama?
            </label>
            <input
              id="buyer-name"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
              autoFocus
              required
              maxLength={80}
              autoComplete="name"
            />

            {status === "conflict" && (
              <p className="msg msg-conflict">
                Ah, alguém acabou comprando esse presente agora! Obrigado mesmo
                assim 🏁
              </p>
            )}
            {status === "error" && (
              <p className="msg msg-error">
                Algo deu errado ao salvar. Tente de novo.
              </p>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={backToList}
              >
                Voltar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={status === "submitting" || !name.trim()}
              >
                {status === "submitting" ? "Salvando..." : "Confirmar compra"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
