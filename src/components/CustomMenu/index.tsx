import { Menu } from "@headlessui/react";
import { useEffect } from "react";

export default function CustomMenu({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const removeScrollLock = () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.paddingRight = "";
    };

    const observer = new MutationObserver(() => {
      removeScrollLock();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Menu as="div" className="relative inline-block text-left">
      {children}
    </Menu>
  );
}
