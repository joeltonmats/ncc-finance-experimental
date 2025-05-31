import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import NewTransaction from "./newTransaction";

const meta: Meta<typeof NewTransaction> = {
  title: "Dashboard/NewTransaction",
  component: NewTransaction,
};

export default meta;

type Story = StoryObj<typeof NewTransaction>;

const TransactionWrapper = () => {
  const [balance, setBalance] = useState({
    id: "cmb8eq2yu000avngkg26r093g",
    userId: "cmb8eq2yt0008vngkgjrfbp9m",
    accountType: "checking",
    amount: 7756.26,
    currency: "BRL",
  });
  return <NewTransaction balance={balance} setBalance={setBalance} />;
};

export const Default: Story = {
  render: () => <TransactionWrapper />,
};
