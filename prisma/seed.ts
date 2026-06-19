import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const items = [
  {
    title: "Bicicleta de Equilibrio de Madeira",
    description: "Bicicleta sem pedal para os primeiros passeios da pequena.",
    priceCents: 19900,
    imageUrl: "https://placehold.co/600x450/F9A8D4/7C2D12?text=Bicicleta",
    storeUrl: "https://www.amazon.com.br/",
  },
  {
    title: "Blocos de Montar (100 pecas)",
    description: "Pecas coloridas e grandes, faceis de encaixar.",
    priceCents: 8900,
    imageUrl: "https://placehold.co/600x450/6CC8FF/0B3D91?text=Blocos",
    storeUrl: "https://www.amazon.com.br/",
  },
  {
    title: "Conjunto de Livros de Banho",
    description: "Livrinhos plastificados para a hora do banho.",
    priceCents: 4500,
    imageUrl: "https://placehold.co/600x450/FFD84D/5A4A00?text=Livros",
    storeUrl: "https://www.amazon.com.br/",
  },
  {
    title: "Quebra-cabeca de Encaixe em Madeira",
    description: "Encaixes de madeira com bichinhos.",
    priceCents: 3900,
    imageUrl: "https://placehold.co/600x450/8BE86B/1B4D1B?text=Quebra-cabeca",
    storeUrl: "https://www.amazon.com.br/",
  },
  {
    title: "Urso de Pelucia Fofinho",
    description: "Pelucia macia e segura, tamanho para abracar.",
    priceCents: 6900,
    imageUrl: "https://placehold.co/600x450/C08BFF/3D1B66?text=Ursinho",
    storeUrl: "https://www.amazon.com.br/",
  },
  {
    title: "Mesinha e Cadeirinha Infantil",
    description: "Conjunto de mesa e cadeira para desenhar e brincar.",
    priceCents: 24900,
    imageUrl: "https://placehold.co/600x450/FF9D4D/5A2A00?text=Mesinha",
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
