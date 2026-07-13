"use client";

import { useState } from "react";

function maskBR(value: string): string {
  let v = value.replace(/[^\d,]/g, "");
  const firstComma = v.indexOf(",");
  if (firstComma !== -1) {
    const intPart = v.slice(0, firstComma).replace(/,/g, "");
    let decPart = v.slice(firstComma + 1).replace(/,/g, "").slice(0, 2);
    v = intPart + "," + decPart;
  }
  v = v.replace(/^0+(\d)/, "$1");
  return v;
}

function normalizeOnBlur(value: string): string {
  if (!value) return "";
  let v = value;
  if (!v.includes(",")) {
    v = v + ",00";
  }
  const [reais, decRaw] = v.split(",");
  const dec = (decRaw || "").padEnd(2, "0").slice(0, 2);
  return `${reais},${dec}`;
}

function toCents(value: string): number {
  if (!value) return 0;
  const normalized = value.replace(",", ".");
  const num = parseFloat(normalized);
  return Number.isFinite(num) ? Math.round(num * 100) : 0;
}

function centsToBR(cents: number): string {
  if (cents <= 0) return "";
  const reais = Math.floor(cents / 100);
  const dec = cents % 100;
  return `${reais},${dec.toString().padStart(2, "0")}`;
}

export default function PriceInput({
  initialCents = 0,
}: {
  initialCents?: number;
}) {
  const [display, setDisplay] = useState(centsToBR(initialCents));

  return (
    <>
      <input
        type="text"
        className="input"
        value={display}
        onChange={(e) => setDisplay(maskBR(e.target.value))}
        onBlur={() => setDisplay(normalizeOnBlur(display))}
        placeholder="0,00"
        inputMode="decimal"
      />
      <input type="hidden" name="priceCents" value={toCents(display)} />
    </>
  );
}