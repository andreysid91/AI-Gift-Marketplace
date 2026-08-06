"use client";

import { useRouter } from "next/navigation";
import { orderSameCheckoutHref, saveOrderSame } from "../lib/order-same";

type OrderSameButtonProps = {
  giftId: string;
  query?: string;
  className?: string;
  children?: React.ReactNode;
};

export function OrderSameButton({
  giftId,
  query,
  className,
  children = "Заказать такой же",
}: OrderSameButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        saveOrderSame(giftId, query);
        router.push(orderSameCheckoutHref(giftId));
      }}
    >
      {children}
    </button>
  );
}
