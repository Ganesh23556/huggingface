import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // 1. Java Basics Course
  const javaBasics = await prisma.subject.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Java Basics",
      description: "Master the fundamentals of Java programming from scratch.",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
      isPublished: true,
      sections: {
        create: [
          {
            title: "Introduction to Java",
            orderIndex: 0,
            videos: {
              create: [
                {
                  title: "Java Full Course for Beginners",
                  youtubeUrl: "https://www.youtube.com/watch?v=A74TOX803D0",
                  orderIndex: 0,
                  durationSeconds: 7200,
                },
              ],
            },
          },
          {
            title: "Object Oriented Programming",
            orderIndex: 1,
            videos: {
              create: [
                {
                  title: "Java OOPs Explained",
                  youtubeUrl: "https://www.youtube.com/watch?v=Z6D68vEdfXU",
                  orderIndex: 0,
                  durationSeconds: 3600,
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 2. Python Fundamentals Course
  const pythonFundamentals = await prisma.subject.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: "Python Fundamentals",
      description: "Learn Python from zero to hero and start your data science journey.",
      thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop",
      isPublished: true,
      sections: {
        create: [
          {
            title: "Python Basics",
            orderIndex: 0,
            videos: {
              create: [
                {
                  title: "Python for Beginners",
                  youtubeUrl: "https://www.youtube.com/watch?v=rfscVS0vtbw",
                  orderIndex: 0,
                  durationSeconds: 3600 * 6,
                },
              ],
            },
          },
          {
            title: "Data Structures",
            orderIndex: 1,
            videos: {
              create: [
                {
                  title: "Python Lists, Tuples, Dictionaries",
                  youtubeUrl: "https://www.youtube.com/watch?v=wj9fP18M6j8",
                  orderIndex: 0,
                  durationSeconds: 1200,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
