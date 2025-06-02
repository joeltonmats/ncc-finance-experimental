"use client";
import React, { useState, useEffect } from "react";
import { Balance } from "@/types/balance";
import { translateTransactionType } from "@/helpers";
import { TransactionTypeEnum } from "@/types";
import TransactionEditModal from "../TransactionEditModal/TransactionEditModal";

interface TransactionListProps {
  balance: Balance;
  disableSelection?: boolean;
}
interface Transaction {
  id: string;
  month: string;
  type: string;
  typeLabel: string;
  amount: string;
  date: string;
  timestamp?: Date;
}
interface RawTransaction {
  id: string;
  balanceId: string;
  type: string;
  amount: number;
  timestamp: Date;
  description: string | null;
}

export default function TransactionList({
  balance,
  disableSelection,
}: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      setIsLoading(true);
      try {
        if (!balance || !balance.id) return;

        const response = await fetch(`/api/back/transactions/${balance.id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Erro ao buscar transações.");

        const data: RawTransaction[] = await response.json();

        const formattedData: Transaction[] = data
          .map((tx) => ({
            id: tx.id,
            month: new Date(tx.timestamp).toLocaleString("pt-BR", {
              month: "long",
            }),
            type: tx.type,
            typeLabel: translateTransactionType(tx.type),
            amount: tx.amount.toFixed(2),
            date: new Date(tx.timestamp).toLocaleDateString("pt-BR"),
            timestamp: tx.timestamp,
          }))
          // Sort by most recent date (descending)
          .sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

        setTransactions(formattedData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    if (balance?.id) {
      fetchTransactions();
    }
  }, [balance, balance?.id]);

  const [openModal, setOpenModal] = useState(false);

  const handleTxClick = (txId: string) => {
    console.log("Selected Transaction ID:", selectedTxId);
    setSelectedTxId(txId);
    setOpenModal(true);
  };

  const onClose = () => {
    setSelectedTxId(null);
    setOpenModal(false);
  };

  return (
    <>
      <h2 className="text-lg font-semibold">Extrato</h2>

      <div className="text-sm text-neutral-900">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="relative mb-4 flex animate-pulse items-center"
            >
              <div className="flex flex-1 flex-col space-y-2">
                <div className="h-3 w-24 rounded bg-neutral-200" />
                <div className="h-3 w-32 rounded bg-neutral-300" />
                <div className="h-3 w-20 rounded bg-neutral-300" />
                <hr className="border-brand-secondary mt-2 w-full border-t" />
              </div>
              <div className="ml-4 h-3 w-14 rounded bg-neutral-300" />
            </div>
          ))
        ) : transactions.length === 0 ? (
          <p className="text-sm text-neutral-500">
            Nenhuma transação encontrada.
          </p>
        ) : (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className="relative mb-2 flex cursor-pointer items-center rounded hover:bg-neutral-100"
              onClick={() => {
                if (!disableSelection) {
                  handleTxClick(tx.id);
                }
              }}
            >
              <div className="flex flex-1 flex-col">
                <div className="text-brand-secondary text-xs font-medium">
                  {tx.month}
                </div>
                <div className="text-brand-primary text-sm font-medium">
                  {tx.typeLabel}
                </div>
                <div
                  className={`text-sm font-medium xl:max-w-[8rem] ${
                    tx.type === TransactionTypeEnum.transfer ||
                    tx.type === TransactionTypeEnum.withdrawal
                      ? "text-orange-800"
                      : ""
                  }`}
                >
                  {(() => {
                    const amountNumber = Number(tx.amount);
                    const formatted = amountNumber.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    });
                    return tx.type === TransactionTypeEnum.transfer ||
                      tx.type === TransactionTypeEnum.withdrawal
                      ? `-${formatted}`
                      : formatted;
                  })()}
                </div>
                <hr className="border-brand-secondary mt-2 w-full border-t" />
              </div>

              <time
                className="ml-4 flex h-full items-center self-center text-xs text-gray-500"
                dateTime={tx.date}
                style={{ minWidth: 70, textAlign: "right" }}
              >
                {tx.date}
              </time>
            </div>
          ))
        )}
        {/* Modal para editar transação */}
        {selectedTxId && (
          <>
            <TransactionEditModal
              balanceId={balance.id}
              transactionId={selectedTxId}
              onClose={onClose}
              isOpen={openModal}
            />
          </>
        )}
      </div>
    </>
  );
}
