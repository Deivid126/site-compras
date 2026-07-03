import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const items = [
  {
    title: "Bicicleta de Equilibrio de Madeira",
    description: "Bicicleta sem pedal para os primeiros passeios do pequeno piloto.",
    priceCents: 19900,
    imageUrl: "https://placehold.co/600x450/E2231A/FFFFFF?text=Bicicleta",
    storeUrl: "https://www.amazon.com.br/",
  },
  {
    title: "Blocos de Montar (100 pecas)",
    description: "Pecas coloridas e grandes, faceis de encaixar.",
    priceCents: 8900,
    imageUrl: "https://placehold.co/600x450/FFD84D/1A1A1A?text=Blocos",
    storeUrl: "https://www.amazon.com.br/",
  },
  {
    title: "Conjunto de Livros de Banho",
    description: "Livrinhos plastificados para a hora do banho.",
    priceCents: 4500,
    imageUrl: "https://placehold.co/600x450/1A1A1A/FFD84D?text=Livros",
    storeUrl: "https://www.amazon.com.br/",
  },
  {
    title: "Quebra-cabeca de Encaixe em Madeira",
    description: "Encaixes de madeira com bichinhos.",
    priceCents: 3900,
    imageUrl: "https://placehold.co/600x450/FF6A00/FFFFFF?text=Quebra-cabeca",
    storeUrl: "https://www.amazon.com.br/",
  },
  {
    title: "Urso de Pelucia Fofinho",
    description: "Pelucia macia e segura, tamanho para abracar.",
    priceCents: 6900,
    imageUrl: "https://placehold.co/600x450/B01812/FFD84D?text=Ursinho",
    storeUrl: "https://www.amazon.com.br/",
  },
  {
    title: "Mesinha e Cadeirinha Infantil",
    description: "Conjunto de mesa e cadeira para desenhar e brincar.",
    priceCents: 24900,
    imageUrl: "https://placehold.co/600x450/2A2A2A/FFD84D?text=Mesinha",
    storeUrl: "https://www.amazon.com.br/",
  },
];

async function main() {
  const count = await prisma.item.count();
  if (count === 0) {
    await prisma.item.createMany({ data: items });
    console.log(`Seed: ${items.length} presentes inseridos.`);
  } else {
    console.log(`Seed: banco ja possui ${count} itens, pulando.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
