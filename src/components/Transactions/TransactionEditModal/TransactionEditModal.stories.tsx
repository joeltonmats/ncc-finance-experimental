import type { Meta, StoryObj } from "@storybook/react";
import TransactionEditModal from "./TransactionEditModal";
import { useState, useEffect } from "react";

const meta: Meta<typeof TransactionEditModal> = {
  title: "Transaction/TransactionEditModal",
  component: TransactionEditModal,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof TransactionEditModal>;

function TransactionEditModalWrapper() {
  const [isOpen] = useState(true);
  const [mockedTransactionLoaded, setMockedTransactionLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setMockedTransactionLoaded(true), 300);
  }, []);

  if (!mockedTransactionLoaded) {
    return <div>Carregando...</div>;
  }

  return (
    <TransactionEditModal
      balanceId="1"
      transactionId="123"
      isOpen={isOpen}
      onClose={() => {}}
      disabled
    />
  );
}

export const Default: Story = {
  render: () => <TransactionEditModalWrapper />,
};
