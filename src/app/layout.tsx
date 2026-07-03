import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pista de Presentes do Noah 🏎️",
  description: "Lista de presentes para o aniversário de 2 aninhos do Noah — tema Carros / Relâmpago McQueen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={fredoka.variable}>
      <body>{children}</body>
    </html>
  );
}
