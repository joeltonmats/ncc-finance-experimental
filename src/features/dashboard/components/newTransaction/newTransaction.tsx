import React, { Fragment, useState } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { NumericFormat, NumberFormatValues } from "react-number-format";

import { TransactionTypeEnum, TransactionTypeLabels } from "@/types";
import { translateTransactionType } from "@/helpers";
import toast from "react-hot-toast";
import "./newTransaction.css"; // Import the CSS file for styling
import { Balance } from "@/types/balance";

interface NewTransactionProps {
  balance: Balance;
  setBalance: React.Dispatch<React.SetStateAction<Balance>>;
}

const transactionOptions = [
  { value: TransactionTypeEnum.deposit, label: TransactionTypeLabels.deposit },
  {
    value: TransactionTypeEnum.withdrawal,
    label: TransactionTypeLabels.withdrawal,
  },
  {
    value: TransactionTypeEnum.transfer,
    label: TransactionTypeLabels.transfer,
  },
];

export default function NewTransaction({
  balance,
  setBalance,
}: NewTransactionProps) {
  const [userBalance] = useState(balance);
  const [transactionType, setTransactionType] = useState<{
    value: TransactionTypeEnum;
    label: string;
  } | null>(null);
  const [valor, setValor] = useState("");
  const [loading, setLoading] = useState(false);

  const handleValueChange = (values: NumberFormatValues) => {
    setValor(values.value);
  };

  const handleSubmit = async () => {
    const valueNumber = parseFloat(valor);
    if (!transactionType || !valueNumber) {
      toast.error("Selecione o tipo de transação e um valor válido.");
      return;
    }

    try {
      setLoading(true);
      await fetch(`/api/back/transactions/${userBalance.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionType: transactionType.value,
          amount: valueNumber,
          description: `${transactionType.label} no valor de R$ ${valueNumber.toFixed(2)}`,
        }),
      });

      const balanceUrl =
        transactionType.value === TransactionTypeEnum.deposit
          ? "add"
          : transactionType.value === TransactionTypeEnum.withdrawal ||
              transactionType.value === TransactionTypeEnum.transfer
            ? "subtract"
            : "";

      if (balanceUrl) {
        console.log("newTransaction body:", { amount: valueNumber });
        await fetch(`/api/back/balance/${userBalance.id}/${balanceUrl}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: valueNumber }),
        });
      }

      const response = await fetch(`/api/back/balance/${userBalance.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const updatedBalance = await response.json();
      setBalance(updatedBalance ?? balance);

      toast.success(
        `Sucesso! ${translateTransactionType(transactionType.value)} de R$ ${valueNumber.toLocaleString(
          "pt-BR",
          {
            minimumFractionDigits: 2,
          }
        )}`
      );

      setTransactionType(null);
      setValor("");
    } catch (error) {
      console.error("Erro ao criar transação:", error);
      toast.error("Erro ao criar transação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tw-card-background card-decor rounded-md p-4 shadow-md">
      <div className="flex flex-col items-center justify-center sm:block sm:pt-10">
        <h2 className="title-card mb-4">Nova transação</h2>
        <div className="form-wrapper flex flex-col items-center gap-4 sm:items-stretch">
          <Listbox value={transactionType} onChange={setTransactionType}>
            <div className="relative mt-1">
              <ListboxButton className="border-brand-secondary focus:border-brand-primary focus:ring-brand-primary relative w-[18.75rem] cursor-pointer rounded-md border bg-white py-2 pr-10 pl-2 text-left shadow-sm focus:ring-1 focus:outline-none sm:text-sm">
                <span className="block truncate">
                  {transactionType ? (
                    transactionType.label
                  ) : (
                    <span className="text-neutral-400">
                      Selecione o tipo de transação
                    </span>
                  )}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="text-brand-secondary h-5 w-5"
                    aria-hidden="true"
                  />
                </span>
              </ListboxButton>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <ListboxOptions className="border-brand-secondary ring-opacity-5 absolute z-10 mt-1 max-h-60 w-[22.375rem] overflow-auto rounded-md border bg-white py-1 text-sm shadow-lg ring-1 ring-black focus:outline-none">
                  {transactionOptions.map((option, index) => (
                    <ListboxOption
                      key={index}
                      className={({ focus }) =>
                        `cursor-pointer px-4 py-2 select-none ${
                          focus
                            ? "bg-surface-muted text-brand-primary"
                            : "text-neutral-900"
                        }`
                      }
                      value={option}
                    >
                      {({ selected }) => (
                        <span
                          className={`block ${selected ? "font-semibold" : "font-normal"}`}
                        >
                          {option.label}
                        </span>
                      )}
                    </ListboxOption>
                  ))}
                </ListboxOptions>
              </Transition>
            </div>
          </Listbox>

          <label htmlFor="transactionValue" className="subtitle-card">
            Valor
          </label>
          <NumericFormat
            id="transactionValue"
            value={valor}
            onValueChange={handleValueChange}
            thousandSeparator="."
            decimalSeparator=","
            prefix="R$ "
            placeholder="R$ 0,00"
            className="border-brand-secondary focus:border-brand-primary focus:ring-brand-primary w-[18.75rem] rounded-md border bg-white p-2 shadow-sm focus:ring-1 sm:text-sm"
            allowNegative={false}
            decimalScale={2}
            fixedDecimalScale
            autoComplete="off"
            inputMode="decimal"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-brand-primary hover:bg-brand-primary-dark w-40 rounded-md py-2 text-center font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Processando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}
