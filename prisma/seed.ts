import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("demo123", 10);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@lms.com" },
    update: {},
    create: {
      email: "demo@lms.com",
      name: "Demo Student",
      passwordHash,
    },
  });

  const courses = [
    {
      id: 101,
      title: "Full Stack Web Development",
      description: "Build production apps with React, Next.js, APIs, and databases.",
    },
    {
      id: 102,
      title: "UI/UX Design Masterclass",
      description: "Learn professional design principles, wireframing, and high-fidelity prototyping.",
    },
    {
      id: 103,
      title: "Python for Data Science",
      description: "Master Python libraries like Pandas, NumPy, and Matplotlib for data analysis.",
    },
    {
      id: 104,
      title: "Mobile App Development with Flutter",
      description: "Create beautiful cross-platform apps for iOS and Android using Flutter & Dart.",
    },
    {
      id: 105,
      title: "Cybersecurity Fundamentals",
      description: "Protect systems and networks from digital attacks. Learn hacking techniques & defense.",
    },
    {
      id: 106,
      title: "Digital Marketing Strategy",
      description: "Grow any business with SEO, SEM, social media, and content marketing techniques.",
    },
    {
      id: 107,
      title: "AI & Machine Learning",
      description: "Deep dive into neural networks, deep learning, and practical AI applications.",
    },
    {
      id: 108,
      title: "Cloud Architecture with AWS",
      description: "Design and deploy scalable, reliable, and secure applications on Amazon Web Services.",
    },
  ];

  for (const course of courses) {
    await prisma.subject.upsert({
      where: { id: course.id },
      update: {
        title: course.title,
        description: course.description,
        isPublished: true,
      },
      create: {
        id: course.id,
        title: course.title,
        description: course.description,
        isPublished: true,
        sections: {
          create: [
            {
              title: "Introduction",
              orderIndex: 0,
              videos: {
                create: [
                  {
                    title: "Course Overview",
                    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    orderIndex: 0,
                    durationSeconds: 300,
                  },
                ],
              },
            },
          ],
        },
      },
    });
  }

  // Ensure demo user is enrolled in the first course
  await prisma.enrollment.upsert({
    where: {
      userId_subjectId: {
        userId: demoUser.id,
        subjectId: 101,
      },
    },
    update: {},
    create: {
      userId: demoUser.id,
      subjectId: 101,
    },
  });

  console.log("Seeding finished with 8 courses.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
