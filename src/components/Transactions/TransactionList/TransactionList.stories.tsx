import type { Meta, StoryObj } from "@storybook/react";
import TransactionList from "./TransactionList";
import { Balance } from "@/types/balance";
import { TransactionTypeEnum } from "@/types";

const meta: Meta<typeof TransactionList> = {
  component: TransactionList,
  title: "Transaction/TransactionList",
};

export default meta;

type Story = StoryObj<typeof TransactionList>;

const mockedBalance: Balance = {
  id: "balance-1",
  userId: "user-123",
  accountType: "checking",
  amount: 1000,
  currency: "BRL",
};

const transactionMock = [
  {
    id: "tx-1",
    month: "maio",
    type: TransactionTypeEnum.deposit,
    typeLabel: "Depósito",
    amount: "1500.00",
    date: "01/05/2024",
    timestamp: new Date(),
  },
  {
    id: "tx-2",
    month: "maio",
    type: TransactionTypeEnum.withdrawal,
    typeLabel: "Saque",
    amount: "300.00",
    date: "03/05/2024",
    timestamp: new Date(),
  },
];

export const Default: Story = {
  args: {
    balance: mockedBalance,
  },
  render: (args) => {
    global.fetch = async (input: RequestInfo | URL): Promise<Response> => {
      const url = typeof input === "string" ? input : input.toString();

      if (url.includes(`/api/back/transactions/${mockedBalance.id}`)) {
        return {
          ok: true,
          json: async () =>
            transactionMock.map((t) => ({
              id: t.id,
              balanceId: mockedBalance.id,
              type: t.type,
              amount: parseFloat(t.amount),
              timestamp: t.timestamp,
              description: "Mocked description",
            })),
        } as Response;
      }

      return {
        ok: false,
        json: async () => ({}),
      } as Response;
    };

    return <TransactionList disableSelection {...args} />;
  },
};
