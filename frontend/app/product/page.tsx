import { redirect } from "next/navigation";

type ProductPageProps = {
  searchParams: Promise<{ id?: string }>;
};

/** Legacy /product → Gift Page */
export default async function ProductPage({ searchParams }: ProductPageProps) {
  const { id } = await searchParams;
  const qs = id ? `?id=${encodeURIComponent(id)}` : "";
  redirect(`/gift${qs}`);
}
