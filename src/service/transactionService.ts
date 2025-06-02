import { prisma } from "@/lib/prisma";
import { ERROR_CONSTANTS } from "@/constants";
import { Transaction, TransactionTypeEnum } from "@/types";
import { addBalance, subtractBalance } from "./balanceService";

export async function getAllTransactions() {
  const transactions = await prisma.transaction.findMany({
    orderBy: { timestamp: "desc" },
  });

  return transactions;
}
export async function getTransactionById(
  balanceId?: string,
  transactionId?: string
): Promise<Transaction | null> {
  return prisma.transaction.findFirst({
    where: {
      id: transactionId ?? "DEFAULT_TRANSACTION_ID",
      balanceId: balanceId ?? "DEFAULT_BALANCE_ID",
    },
  }) as Promise<Transaction | null>;
}

export async function deleteTransactionById(
  balanceId?: string,
  transactionId?: string
) {
  try {
    return await prisma.transaction.delete({
      where: {
        id: transactionId ?? "DEFAULT_TRANSACTION_ID",
        balanceId: balanceId ?? "DEFAULT_BALANCE_ID",
      },
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return { error: "Failed to delete transaction" };
  }
}

export async function processDeleteTransaction(
  balanceId: string,
  transactionId: string
) {
  const transaction = await getTransactionById(balanceId, transactionId);
  if (!transaction) {
    return { error: "Transaction not found" };
  }

  try {
    if (transaction.type === TransactionTypeEnum.deposit) {
      subtractBalance(balanceId, transaction.amount);
    } else if (
      transaction.type === TransactionTypeEnum.withdrawal ||
      transaction.type === TransactionTypeEnum.transfer
    ) {
      addBalance(balanceId, transaction.amount);
    }

    return await deleteTransactionById(balanceId, transactionId);
  } catch (error) {
    console.error("Error processing delete transaction:", error);
    return { error: "Failed to process delete transaction" };
  }
}

export async function updateTransactionById(
  balanceId: string,
  transactionId: string,
  transactionData: Partial<{
    type: string;
    amount: number;
    description: string;
  }>
) {
  try {
    return await prisma.transaction.update({
      where: {
        id: transactionId,
        balanceId: balanceId,
      },
      data: transactionData,
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { error: "Failed to update transaction" };
  }
}

export type NewTransactionRequest = {
  balanceId: string;
  transactionType: string;
  amount: number;
  description: string;
};

export async function createTransaction(
  transactionInput: NewTransactionRequest
) {
  try {
    const transactionToInput = await getTransactionInput(transactionInput);
    const transaction = await prisma.transaction.create({
      data: transactionToInput,
    });
    return transaction;
  } catch {
    return { error: ERROR_CONSTANTS.createTransaction };
  }
}

async function getTransactionInput(input: NewTransactionRequest) {
  return {
    balanceId: input.balanceId,
    type: input.transactionType,
    amount: input.amount,
    timestamp: new Date(),
    description: `${input.transactionType} no valor de ${input.amount}`,
  };
}

export async function getTransactionsByBalanceId(balanceId?: string) {
  try {
    return await prisma.transaction.findMany({
      where: { balanceId: balanceId ?? " " },
    });
  } catch {
    throw new Error("Balance not found or database error");
  }
}

export async function processTransactionUpdate(
  balanceId: string,
  transaction: Transaction,
  updateForm: { type: string; amount: number; description: string }
) {
  if (transaction.type === updateForm.type) {
    if (transaction.type === TransactionTypeEnum.deposit) {
      console.log("processTransactionUpdate - deposit");
      return await processDepositUpdate(balanceId, transaction, updateForm);
    } else if (
      transaction.type === TransactionTypeEnum.withdrawal ||
      transaction.type === TransactionTypeEnum.transfer
    ) {
      console.log("processTransactionUpdate - withdrawal or transfer");
      return await processWithdrawalTransferUpdate(
        balanceId,
        transaction,
        updateForm
      );
    }
  } else if (
    (transaction.type === TransactionTypeEnum.withdrawal &&
      updateForm.type === TransactionTypeEnum.transfer) ||
    (transaction.type === TransactionTypeEnum.transfer &&
      updateForm.type === TransactionTypeEnum.withdrawal)
  ) {
    console.log(
      "processTransactionUpdate - withdrawal to transfer or vice versa"
    );
    return await processWithdrawalTransferUpdate(
      balanceId,
      transaction,
      updateForm
    );
  } else if (
    updateForm.type === TransactionTypeEnum.deposit &&
    transaction.type !== TransactionTypeEnum.deposit
  ) {
    console.log("processTransactionUpdate - change to deposit");
    return await processChangeTransactionToDepositUpdate(
      balanceId,
      transaction,
      updateForm
    );
  } else if (
    updateForm.type === TransactionTypeEnum.withdrawal ||
    (updateForm.type === TransactionTypeEnum.transfer &&
      transaction.type === TransactionTypeEnum.deposit)
  ) {
    console.log("processTransactionUpdate - change to withdrawal or transfer");
    return await processChangeTransactionToWithdrawlOrTransfer(
      balanceId,
      transaction,
      updateForm
    );
  }
}

async function processDepositUpdate(
  balanceId: string,
  transaction: Transaction,
  updateForm: { type: string; amount: number; description: string }
) {
  const balanceIdToUpdate = balanceId;
  const originalAmount = transaction.amount;
  const newAmount = updateForm.amount;

  try {
    subtractBalance(balanceIdToUpdate, originalAmount);
    addBalance(balanceIdToUpdate, newAmount);

    return await updateTransactionById(
      balanceIdToUpdate,
      transaction.id,
      updateForm
    );
  } catch (error) {
    console.error("Erro ao processar atualização de depósito:", error);

    throw error;
  }
}

async function processWithdrawalTransferUpdate(
  balanceId: string,
  transaction: Transaction,
  updateForm: { type: string; amount: number; description: string }
) {
  const balanceIdToUpdate = balanceId;
  const originalAmount = transaction.amount;
  const newAmount = updateForm.amount;

  addBalance(balanceIdToUpdate, originalAmount);
  subtractBalance(balanceIdToUpdate, newAmount);

  return await updateTransactionById(
    balanceIdToUpdate,
    transaction.id,
    updateForm
  );
}

async function processChangeTransactionToDepositUpdate(
  balanceId: string,
  transaction: Transaction,
  updateForm: { type: string; amount: number; description: string }
) {
  const balanceIdToUpdate = balanceId;
  const originalAmount = transaction.amount;
  const newAmount = updateForm.amount;
  addBalance(balanceIdToUpdate, originalAmount);
  addBalance(balanceIdToUpdate, newAmount);

  return await updateTransactionById(
    balanceIdToUpdate,
    transaction.id,
    updateForm
  );
}
async function processChangeTransactionToWithdrawlOrTransfer(
  balanceId: string,
  transaction: Transaction,
  updateForm: { type: string; amount: number; description: string }
) {
  const balanceIdToUpdate = balanceId;
  const originalAmount = transaction.amount;
  const newAmount = updateForm.amount;
  subtractBalance(balanceIdToUpdate, originalAmount);
  subtractBalance(balanceIdToUpdate, newAmount);

  return await updateTransactionById(
    balanceIdToUpdate,
    transaction.id,
    updateForm
  );
}
