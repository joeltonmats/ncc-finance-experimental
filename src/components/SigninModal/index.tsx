"use client";

import { ROUTE_CONSTANTS } from "@/constants";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import validator from "validator";
import AuthModalWrapper from "../AuthModalWrapper";
import AuthModalHeader from "../AuthModalHeader";
import FormField from "../FormField";
import { signIn } from "next-auth/react";

export default function SigninModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setEmailError(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && pathname === ROUTE_CONSTANTS.dashboard) {
      onClose();
    }
  }, [isOpen, pathname, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validator.isEmail(email)) {
      setEmailError(true);
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: ROUTE_CONSTANTS.dashboard,
    });

    if (res?.ok) {
      router.push(ROUTE_CONSTANTS.dashboard);
    } else {
      toast.error("Nome/email incorretos");
    }
  };

  return (
    <AuthModalWrapper isOpen={isOpen} onClose={onClose}>
      <AuthModalHeader
        illustration="/assets/illustrations/signin.svg"
        alt="Ilustração de login"
        title="Login"
      />
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <FormField
          label="Email"
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(val) => {
            setEmail(val);
            setEmailError(false);
          }}
          hasError={emailError}
          errorMessage="Dado incorreto. Revise e digite novamente."
        />

        <div>
          <FormField
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={setPassword}
          />
          <a
            href="#"
            className="text-brand-primary mt-1 inline-block text-xs hover:underline"
          >
            Esqueci a senha!
          </a>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!email || !password}
            className="bg-button-primary hover:bg-button-primary-hover flex w-40 items-center justify-center rounded-md py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Acessar
          </button>
        </div>
      </form>
    </AuthModalWrapper>
  );
}
