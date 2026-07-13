"use client";

import { useState } from "react";

export default function DeleteButton({
  label = "Deletar",
  action,
  itemId,
  itemTitle,
}: {
  label?: string;
  action: string;
  itemId: string;
  itemTitle: string;
}) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        className="adm-btn adm-btn-ghost adm-btn-danger-ghost"
        onClick={() => setConfirming(true)}
      >
        {label}
      </button>
    );
  }

  return (
    <span className="adm-confirm-inline">
      <form action={action} method="POST" style={{ display: "inline" }}>
        <input type="hidden" name="_method" value="DELETE" />
        <button type="submit" className="adm-btn adm-btn-danger">
          Confirmar
        </button>
      </form>
      <button
        type="button"
        className="adm-btn adm-btn-ghost"
        onClick={() => setConfirming(false)}
      >
        Cancelar
      </button>
    </span>
  );
}