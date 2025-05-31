import { prisma } from "@/lib/prisma";

export async function addBalance(
  balanceId: string,
  amount: number
): Promise<number> {
  if (amount < 0) throw new Error("Amount must be positive");
  await prisma.balance.updateMany({
    where: { id: balanceId ?? " " },
    data: { amount: { increment: amount } },
  });
  const balance = await getBalanceById(balanceId);
  if (!balance) throw new Error("Balance not found");
  return balance.amount;
}

export async function subtractBalance(
  balanceId: string,
  amount: number
): Promise<number> {
  if (amount < 0) throw new Error("Amount must be positive");

  // **TODO**: Verificar na regra de negócio se haverá tratativa
  // de saldo negativo "Cheque especial"
  // ou se não podera haver saldo negativo
  //
  // *Obtem Saldo Atual*
  // const current = await getAmountBalance(balanceId);
  // warning (verificar metodo de warning)
  // if (amount > current) emitWarning("Insufficient balance");
  // erro
  // if (amount > current) throw new Error("Insufficient balance");

  await prisma.balance.updateMany({
    where: { id: balanceId ?? " " },
    data: { amount: { decrement: amount } },
  });
  const balance = await getBalanceById(balanceId);
  if (!balance) throw new Error("Balance not found");
  return balance.amount;
}

export async function getAmountBalance(balanceId?: string): Promise<number> {
  try {
    const result = await prisma.balance.aggregate({
      _sum: { amount: true },
      where: { id: balanceId ?? " " },
    });
    return result._sum.amount ?? 0;
  } catch {
    throw new Error("Database error while summing balance");
  }
}

export async function getAmountBalanceByUserID(
  userId?: string
): Promise<number> {
  try {
    const result = await prisma.balance.aggregate({
      _sum: { amount: true },
      where: { userId: userId ?? " " },
    });
    return result._sum.amount ?? 0;
  } catch {
    throw new Error("Database error while summing balance");
  }
}

export async function getBalanceByUserId(userId?: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required to fetch balance");
    }

    const retorno = await prisma.balance.findFirst({
      where: { userId: userId ?? " " },
    });
    if (!retorno) {
      throw new Error("Balance not found for the provided user ID");
    }

    // Return the balance object
    return retorno;
  } catch (error) {
    console.error("Error fetching balance by user ID:", error);
    throw new Error("Balance not found or database error");
  }
}
export async function getAllBalances() {
  try {
    return await prisma.balance.findMany();
  } catch {
    throw new Error("Database error while fetching balances");
  }
}

export async function getBalanceById(balanceId?: string) {
  return prisma.balance.findUnique({
    where: { id: balanceId ?? " " },
  });
}

export type NewBalance = {
  userId: string;
  accountType: string;
  amount: number;
  currency: string;
};

export async function createBalanceForUserId(userId: string) {
  try {
    if (!userId) {
      throw new Error("User ID is required to create a balance");
    }

    const newBalance = await getNewBalanceForUserId(userId);
    const balance = await prisma.balance.create({
      data: newBalance,
    });
    return balance;
  } catch {
    return { error: "Erro ao Criar Balanço" };
  }
}

async function getNewBalanceForUserId(input: string) {
  return {
    userId: input,
    accountType: "checking",
    amount: 0, // Initial amount set to 0
    currency: "BRL", // Default currency set to Brazilian Real
  };
}
