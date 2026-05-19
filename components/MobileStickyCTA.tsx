"use client";

import { useEffect, useState } from "react";
import { CheckoutButton } from "./CheckoutButton";

const CHECKOUT_1 = process.env.NEXT_PUBLIC_CHECKOUT_1_UNIDADE_URL || "#checkout";

export function MobileStickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white border-t border-gray-200 px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-black text-gray-900 text-sm">Nexo Brasil GPS</div>
            <div className="text-green-600 font-bold text-sm">10x de R$19,70</div>
          </div>
          <CheckoutButton
            kit="1"
            url={CHECKOUT_1}
            className="bg-green-500 hover:bg-green-400 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-200 active:scale-95 flex-shrink-0"
          >
            Comprar — 10x de R$19,70
          </CheckoutButton>
        </div>
      </div>
    </div>
  );
}
