import { GiftCheckoutExperience } from "../../components/gift-checkout/gift-checkout-experience";

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
    <GiftCheckoutExperience
      productId={id}
      fromGift={from === "gift"}
      giftQuery={q}
      recipientId={recipient}
    />
  );
}
