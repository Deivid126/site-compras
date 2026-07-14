import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lista de Presentes do Noah",
    short_name: "Presentes Noah",
    description:
      "Lista de presentes para o aniversário de 2 aninhos do Noah.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf5",
    theme_color: "#e2231a",
    lang: "pt-BR",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}