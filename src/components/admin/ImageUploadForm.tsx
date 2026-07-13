"use client";

import { useRef, useState } from "react";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_SIZE = 5 * 1024 * 1024;

export default function ImageUploadForm({
  action,
  deleteAction,
  hasImage,
}: {
  action: string;
  deleteAction: string;
  hasImage: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "removing" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  function pickFile(f: File | null) {
    setErrorMsg("");
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      setErrorMsg("Formato não suportado. Use JPG, PNG, WebP, GIF ou AVIF.");
      setStatus("error");
      return;
    }
    if (f.size > MAX_SIZE) {
      setErrorMsg("Arquivo muito grande (máx 5MB).");
      setStatus("error");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStatus("idle");
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    pickFile(e.target.files?.[0] ?? null);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0] ?? null);
  }

  function handleClear() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setStatus("idle");
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(action, { method: "POST", body: fd });
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

  async function handleRemove() {
    setStatus("removing");
    setErrorMsg("");
    try {
      const res = await fetch(deleteAction, { method: "DELETE" });
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

  const busy = status === "uploading" || status === "removing";

  return (
    <div className="adm-upload">
      {/* Drop zone */}
      {!file && (
        <div
          className={`adm-dropzone ${dragOver ? "adm-dropzone-active" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <svg className="adm-dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="adm-dropzone-text">
            <strong>Clique ou arraste</strong> uma imagem aqui
          </p>
          <p className="adm-dropzone-sub">JPG, PNG, WebP, GIF ou AVIF — máx 5MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            onChange={handleInputChange}
            className="adm-file-hidden"
          />
        </div>
      )}

      {/* Preview + actions */}
      {file && (
        <div className="adm-upload-preview">
          <img src={preview ?? ""} alt="Pré-visualização" className="adm-upload-thumb" />
          <div className="adm-upload-info">
            <span className="adm-upload-name">{file.name}</span>
            <span className="adm-upload-size">
              {(file.size / 1024).toFixed(0)} KB
            </span>
          </div>
          <div className="adm-upload-actions">
            <button
              type="button"
              className="adm-btn adm-btn-primary"
              disabled={busy}
              onClick={handleUpload}
            >
              {status === "uploading" ? "Enviando…" : "Enviar"}
            </button>
            <button
              type="button"
              className="adm-btn adm-btn-ghost"
              disabled={busy}
              onClick={handleClear}
            >
              Trocar
            </button>
          </div>
        </div>
      )}

      {/* Remove existing image */}
      {hasImage && !file && (
        <button
          type="button"
          className="adm-btn adm-btn-danger-ghost"
          disabled={busy}
          onClick={handleRemove}
        >
          {status === "removing" ? "Removendo…" : "🗑 Remover imagem atual"}
        </button>
      )}

      {status === "error" && errorMsg && (
        <p className="adm-upload-error">{errorMsg}</p>
      )}
    </div>
  );
}