import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim()
    ? process.env.NEXT_PUBLIC_SITE_URL.trim()
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Pista de Presentes do Noah 🏎️",
    template: "%s | Pista de Presentes do Noah",
  },
  description:
    "Lista de presentes para o aniversário de 2 aninhos do Noah — tema Carros / Relâmpago McQueen.",
  applicationName: "Pista de Presentes do Noah",
  authors: [{ name: "Família Noah" }],
  keywords: [
    "lista de presentes",
    "aniversário infantil",
    "presentes",
    "Noah",
    "carros",
    "McQueen",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Pista de Presentes do Noah",
    title: "Pista de Presentes do Noah 🏎️",
    description:
      "Escolha um presentinho para o nosso pequeno piloto. Obrigado pela volta de largada! 🏁",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pista de Presentes do Noah 🏎️",
    description:
      "Escolha um presentinho para o nosso pequeno piloto. Obrigado pela volta de largada! 🏁",
  },
  robots: {
    index: true,
    follow: true,
  },
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
