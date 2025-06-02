"use client";
import WelcomeCard from "@/components/WelcomeCard/WelcomeCard";
import NewTransaction from "../newTransaction/newTransaction";
import React, { useState } from "react";
import { Balance } from "@/types/balance";
import TransactionList from "@/components/Transactions/TransactionList/TransactionList";

interface TabletLayoutProps {
  userName: string;
  balance: Balance;
}

export default function TabletLayout({ userName, balance }: TabletLayoutProps) {
  const [userBalance, setBalance] = useState(balance);

  return (
    <div className="min-h-screen font-sans">
      {/* Top navigation */}
      <nav className="flex justify-around py-2 text-sm font-medium text-[--color-neutral-900]">
        <span className="text-brand-primary underline">Início</span>
      </nav>

      {/* Content */}
      <main className="grid grid-cols-2 gap-4 p-4">
        <section className="col-span-2 flex flex-col gap-4">
          <div className="bg-brand-primary rounded-md p-4 text-white shadow-md">
            <WelcomeCard
              name={userName}
              date={new Date()}
              balance={userBalance.amount}
            />
          </div>

          {/* Card for making transactions */}
          <NewTransaction balance={userBalance} setBalance={setBalance} />
        </section>

        <aside className="col-span-2 rounded-md bg-white p-4 shadow-md">
          <div className="col-span-2 flex justify-center">
            <div className="w-1/2 rounded-md bg-white p-4">
              <TransactionList balance={userBalance} />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
