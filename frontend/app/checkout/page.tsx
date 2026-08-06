import { CheckoutForm } from "../../components/checkout-form";

type CheckoutPageProps = {
  searchParams: Promise<{
    id?: string;
    from?: string;
    q?: string;
    recipient?: string;
  }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { id, from, q, recipient } = await searchParams;
  return (
    <CheckoutForm
      productId={id}
      fromGift={from === "gift"}
      giftQuery={q}
      recipientId={recipient}
    />
  );
}
