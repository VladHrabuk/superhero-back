import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const superheros = [
    {
      nickname: 'Batman',
      realName: 'Bruce Wayne',
      originDescription:
        'After witnessing the murder of his parents, young Bruce Wayne dedicated his life to fighting crime in Gotham City. Using his intellect, wealth, and relentless determination, he became the masked vigilante known as Batman.',
      superpowers:
        'Peak human condition, martial arts mastery, detective skills, genius intellect, advanced technology and gadgets, stealth.',
      catchPhrase: 'I am Batman.',
    },
    {
      nickname: 'Spiderman',
      realName: 'Peter Benjamin Parker',
      originDescription:
        'Bitten by a radioactive spider, Peter Parker gained spider-like abilities. He vowed to use his powers responsibly after the tragic death of his Uncle Ben, guided by the words: "With great power comes great responsibility."',
      superpowers:
        'Wall-crawling, enhanced agility and reflexes, superhuman strength, spider-sense, web-shooting via gadgets.',
      catchPhrase: 'Your friendly neighborhood Spider-Man!',
    },
  ];

  for (const hero of superheros) {
    await prisma.superhero.upsert({
      where: { nickname: hero.nickname },
      update: {},
      create: {
        nickname: hero.nickname,
        realName: hero.realName,
        originDespription: hero.originDescription,
        superpowers: hero.superpowers,
        catchPhrase: hero.catchPhrase,
      },
    });
  }

  console.log('Seed data for superheroes added!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
