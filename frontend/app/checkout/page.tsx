import { CheckoutForm } from "../../components/checkout-form";

type CheckoutPageProps = {
  searchParams: Promise<{ id?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { id } = await searchParams;
  return <CheckoutForm productId={id} />;
}
