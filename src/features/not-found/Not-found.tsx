"use client";
import HomeHeader from "@/features/home/components/HomeHeader";
import HomeFooter from "@/features/home/components/HomeFooter";
import ErrorSection from "./components/ErrorSection";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-100 font-sans text-neutral-900">
      <HomeHeader />
      <main className="from-brand-primary/90 flex-grow bg-gradient-to-b to-white/80 pt-16">
        <ErrorSection />
      </main>

      <HomeFooter />
    </div>
  );
}
