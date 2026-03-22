import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// Lazy initialization function
const getPrisma = () => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  
  const client = new PrismaClient({
    log: ["error"],
  });
  
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }
  
  return client;
};

// Export a proxy as 'prisma' so that standard imports like 
// import { prisma } from "@/lib/prisma" are safe at build time.
// The PrismaClient will only be instantiated when a property is accessed.
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrisma();
    return Reflect.get(client, prop, receiver);
  },
});
