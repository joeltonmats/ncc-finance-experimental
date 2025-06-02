export enum TransactionTypeEnum {
  transfer = "transfer",
  deposit = "deposit",
  withdrawal = "withdrawal",
}

export const TransactionTypeLabels: Record<TransactionTypeEnum, string> = {
  transfer: "Transferência",
  deposit: "Depósito",
  withdrawal: "Saque",
};

export interface Transaction {
  id: string;
  balanceId: string;
  type: TransactionTypeEnum;
  amount: number;
  timestamp: Date;
  description: string;
}
