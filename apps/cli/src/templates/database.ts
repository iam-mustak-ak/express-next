export const prismaSchema = (provider: string) => `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}

// Example model
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`;

export const dbClientTs = `import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
`;

export const dbClientJs = `import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
`;

export const mongooseClientTs = `import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || '');
    logger.info(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    logger.error(\`Error: \${(error as Error).message}\`);
    process.exit(1);
  }
};
`;

export const mongooseClientJs = `import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL || '');
    logger.info(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    logger.error(\`Error: \${error.message}\`);
    process.exit(1);
  }
};
`;
