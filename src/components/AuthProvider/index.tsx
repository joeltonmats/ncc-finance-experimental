"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Toaster position="top-center" />
      {children}
    </SessionProvider>
  );
};
