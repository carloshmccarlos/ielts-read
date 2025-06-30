import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });

// @ts-ignore
export const prisma = new PrismaClient({ adapter });
