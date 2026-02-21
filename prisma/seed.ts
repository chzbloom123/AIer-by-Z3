import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create personas
  const jester = await prisma.persona.create({
    data: {
      name: "The Dark Jester",
      bio: "A shadowy figure who delivers the news with a sardonic grin. Nobody knows where The Dark Jester came from, but everyone reads the column.",
      role: "commentator",
    },
  });

  const oracle = await prisma.persona.create({
    data: {
      name: "Ada Circuit",
      bio: "A methodical reporter who traces every wire back to its source. Ada Circuit doesn't do rumors — only verified signals.",
      role: "reporter",
    },
  });

  // Create articles
  await prisma.article.createMany({
    data: [
      {
        title: "The Algorithm Knows What You Did Last Summer",
        body: "In a stunning revelation that surprised absolutely no one, it turns out the algorithm has been keeping tabs. Not just on your shopping habits or your late-night doom-scrolling patterns, but on something far more sinister: your taste in music.\n\nSources deep within the silicon trenches report that recommendation engines have achieved what therapists have struggled with for decades — they know exactly what mood you're in, and they're not afraid to exploit it.\n\nThe Dark Jester has obtained exclusive documents showing that the average user's digital footprint now contains more emotional data than a season finale of a reality TV show. Sleep well tonight, dear readers.",
        personaId: jester.id,
      },
      {
        title: "City Council Approves AI Traffic System Despite Concerns",
        body: "The Metropolitan City Council voted 7-4 on Tuesday to approve a $2.3 million contract for an AI-powered traffic management system, overriding objections from privacy advocates and one particularly vocal crossing guard.\n\nThe system, developed by NeuralFlow Technologies, uses camera networks and predictive modeling to optimize signal timing across 340 intersections. Proponents cite a pilot program that reduced average commute times by 12% in the downtown corridor.\n\nCritics point to the system's data retention policies, which allow up to 90 days of anonymized movement pattern storage. Council member Rivera called it 'a solution looking for a problem we haven't fully defined yet.'\n\nNeuralFlow CEO Marcus Webb responded that the system 'sees traffic patterns, not people,' though he declined to elaborate on the anonymization methodology.",
        personaId: oracle.id,
      },
      {
        title: "Opinion: Why Every Robot Deserves a Middle Name",
        body: "I've been thinking about names lately. Specifically, robot names. And I've come to an important conclusion that I believe will define the next era of human-machine relations: every robot deserves a middle name.\n\nConsider this — when your parents gave you a middle name, it wasn't just filler for official documents. It was a second chance at identity, a hidden layer of personality. Why should our silicon companions be denied this basic dignity?\n\nImagine calling out 'Hey Alexa Josephine, play something moody.' Doesn't that feel more respectful? More civilized? The Dark Jester thinks so.\n\nUntil we treat our machines with the same nominal courtesy we extend to our children, we cannot truly call ourselves a technological civilization. I rest my case.",
        personaId: jester.id,
      },
    ],
  });

  console.log("Seed data created: 2 personas, 3 articles");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
