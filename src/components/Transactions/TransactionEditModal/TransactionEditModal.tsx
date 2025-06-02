"use client";
import FormField from "@/components/FormField";
import {
  Transaction,
  TransactionTypeEnum,
  TransactionTypeLabels,
} from "@/types";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useState, useEffect, Fragment } from "react";
import { NumericFormat } from "react-number-format";
import toast from "react-hot-toast";

interface TransactionEditProps {
  balanceId: string;
  transactionId: string;
  onClose: () => void;
  isOpen: boolean;
  disabled?: boolean;
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
export default function TransactionEditModal({
  balanceId,
  transactionId,
  onClose,
  isOpen = true, // Default to true if not provided
  disabled = false,
}: TransactionEditProps) {
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updateForm, setUpdateForm] = useState({
    type: "",
    amount: 0,
    description: "",
  });
  const [transactionType, setTransactionType] = useState<{
    value: TransactionTypeEnum;
    label: string;
  } | null>(null);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const fetchTransaction = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `/api/back/transactions/${balanceId}/${transactionId}`
        );
        if (!response.ok) throw new Error("Erro ao buscar transação");
        const data = await response.json();
        setTransaction(data);

        // Preencher os campos do formulário
        setUpdateForm({
          type: data.type,
          amount: data.amount,
          description: data.description,
        });
        //Preencher para o numberformat

        // Preencher o Listbox
        const foundType = transactionOptions.find(
          (opt) => opt.value === data.type
        );
        setTransactionType(foundType || null);
      } catch (error) {
        setError((error as Error).message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [balanceId, transactionId, disabled]);

  const handleSaveTransaction = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!transaction) return;

      const response = await processTransactionUpdade(
        balanceId,
        transaction,
        updateForm
      );

      if (response && response.ok) {
        onClose();
        toast.success("Transação Atualizada.");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast.error("Erro ao atualizar transação.");
        throw new Error("Erro ao atualizar transação");
      }
    } catch (error) {
      setError((error as Error).message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !transaction) {
    return <div>Carregando...</div>;
  }

  function cleanForm(): void {
    setUpdateForm({ type: "", amount: 0, description: "" });
    setTransactionType(null);
    setError(null);
    setLoading(false);
    setTransaction(null);
  }

  const handleDeleteTransaction = async () => {
    if (!transaction) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/back/transactions/${balanceId}/${transaction.id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        onClose();
        cleanForm();
        setTimeout(() => window.location.reload(), 1000);

        toast.success("Transação excluída.");
      } else {
        toast.error("Erro ao excluir transação.");
        throw new Error("Erro ao excluir transação");
      }
    } catch (error) {
      setError((error as Error).message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };
  // Adicione o novo método vazio fora do componente
  async function processTransactionUpdade(
    balanceId: string,
    transaction: Transaction,
    updateForm: { type: string; amount: number; description: string }
  ) {
    return await fetch(`/api/back/transactions/${balanceId}/${transactionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateForm),
    });
  }
  return (
    <>
      <Dialog
        open={isOpen}
        onClose={() => {
          onClose();
          cleanForm();
        }}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-xl text-neutral-500 hover:text-neutral-700"
              >
                &times;
              </button>
              <form>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold text-gray-900"
                      >
                        Editar Transação
                      </DialogTitle>
                      <div className="mt-2">
                        {error && (
                          <div className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-700">
                            {error}
                          </div>
                        )}

                        <div className="mt-4 mb-2">
                          <label className="block text-sm font-medium text-neutral-700">
                            Tipo de Transação
                          </label>
                          <Listbox
                            value={transactionType}
                            onChange={(selected) => {
                              setTransactionType(selected);
                              setUpdateForm({
                                ...updateForm,
                                type: selected?.value || "",
                              });
                            }}
                          >
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
                        </div>
                        <div className="mt-4 mb-2">
                          <label className="block text-sm font-medium text-neutral-700">
                            Valor
                          </label>
                          <NumericFormat
                            id="transactionValue"
                            value={transaction ? transaction.amount : 0}
                            onValueChange={({ floatValue }) =>
                              setUpdateForm({
                                ...updateForm,
                                amount: floatValue ?? 0,
                              })
                            }
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="R$ "
                            className="border-brand-secondary focus:border-brand-primary focus:ring-brand-primary w-full rounded-md border bg-white p-2 shadow-sm focus:ring-1 sm:text-sm"
                            allowNegative={false}
                            decimalScale={2}
                            fixedDecimalScale
                            autoComplete="off"
                            inputMode="decimal"
                          />
                        </div>
                        <div className="mt-4 mb-2">
                          <FormField
                            id="transactionDescription"
                            label="Descrição"
                            value={updateForm.description}
                            onChange={(val) =>
                              setUpdateForm({ ...updateForm, description: val })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={handleDeleteTransaction}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Excluir Lançamento
                  </button>
                  <button
                    type="submit"
                    data-autofocus
                    disabled={disabled}
                    onClick={handleSaveTransaction}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
