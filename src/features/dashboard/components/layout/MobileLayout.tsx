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

export default function MobileLayout({ userName, balance }: TabletLayoutProps) {
  const [userBalance, setBalance] = useState(balance);

  return (
    <div className="min-h-screen font-sans">
      {/* Content */}
      <main className="flex flex-col gap-4 p-4">
        <div className="bg-brand-primary rounded-md p-4 text-white shadow-md">
          <WelcomeCard
            name={userName}
            date={new Date()}
            balance={userBalance.amount}
          />
        </div>

        <NewTransaction balance={userBalance} setBalance={setBalance} />

        <div className="rounded-md bg-white p-4 shadow-md">
          <TransactionList balance={userBalance} />
        </div>
      </main>
    </div>
  );
}
