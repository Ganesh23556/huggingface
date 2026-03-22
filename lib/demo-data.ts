type DemoUser = {
  id: number;
  email: string;
  name: string;
  password: string;
};

const globalDemo = globalThis as unknown as {
  demoUsers?: DemoUser[];
};

if (!globalDemo.demoUsers) {
  globalDemo.demoUsers = [
    {
      id: 1,
      email: "demo@lms.com",
      name: "Demo Student",
      password: "demo123",
    },
  ];
}

export function getDemoUsers() {
  return globalDemo.demoUsers!;
}

export function findDemoUserByEmail(email: string) {
  return getDemoUsers().find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function createDemoUser(input: { email: string; name: string; password: string }) {
  const users = getDemoUsers();
  if (findDemoUserByEmail(input.email)) {
    return null;
  }

  const newUser: DemoUser = {
    id: users.length + 1,
    email: input.email,
    name: input.name,
    password: input.password,
  };
  users.push(newUser);
  return newUser;
}

export const demoSubjects = [
  {
    id: 101,
    title: "Full Stack Web Development",
    description: "Build production apps with React, Next.js, APIs, and databases.",
    thumbnail: null,
    isPublished: true,
  },
  {
    id: 102,
    title: "Data Structures and Algorithms",
    description: "Master core problem-solving patterns for coding interviews.",
    thumbnail: null,
    isPublished: true,
  },
  {
    id: 103,
    title: "Cloud and DevOps Foundations",
    description: "Learn CI/CD, Docker, and cloud deployment best practices.",
    thumbnail: null,
    isPublished: true,
  },
];
