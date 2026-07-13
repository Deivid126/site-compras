"use client";

import { useState } from "react";

export default function ImageUploadForm({ action }: { action: string }) {
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("image") as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (!file) return;

    setStatus("uploading");
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("image", file);

      const res = await fetch(action, {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        window.location.reload();
        return;
      }

      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error || `Erro ${res.status}`);
      setStatus("error");
    } catch {
      setErrorMsg("Falha na conexão.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="adm-inline-form">
      <input
        id="image"
        name="image"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        required
        className="adm-file-input"
      />
      <button
        type="submit"
        className="adm-btn adm-btn-primary"
        disabled={status === "uploading"}
      >
        {status === "uploading" ? "Enviando…" : "Enviar imagem"}
      </button>
      {status === "error" && errorMsg && (
        <span className="adm-upload-error">{errorMsg}</span>
      )}
    </form>
  );
}