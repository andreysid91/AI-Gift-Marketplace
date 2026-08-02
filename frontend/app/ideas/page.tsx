import { IdeasView } from "../../components/ideas-view";

type IdeasPageProps = {
  searchParams: Promise<{ q?: string; photo?: string }>;
};

export default async function IdeasPage({ searchParams }: IdeasPageProps) {
  const { q, photo } = await searchParams;

  return <IdeasView query={q ?? ""} hasPhoto={photo === "1"} />;
}
