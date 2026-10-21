import { PrismaClient } from "@prisma/client";

// Instância singleton do PrismaClient para reaproveitamento de pool de conexões
export const prisma = new PrismaClient();
