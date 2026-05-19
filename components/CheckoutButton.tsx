"use client";

import { trackCheckoutClick } from "./TrackingScripts";

interface CheckoutButtonProps {
  kit: "1" | "2" | "3";
  url: string;
  className?: string;
  children: React.ReactNode;
}

export function CheckoutButton({ kit, url, className, children }: CheckoutButtonProps) {
  const handleClick = () => {
    trackCheckoutClick(kit);
    setTimeout(() => {
      window.location.href = url;
    }, 150);
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
