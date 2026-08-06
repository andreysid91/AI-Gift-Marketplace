import { GiftPickerView } from "../../components/gift-picker-view";

type IdeasPageProps = {
  searchParams: Promise<{
    q?: string;
    photo?: string;
    set?: string;
    recipient?: string;
  }>;
};

export default async function IdeasPage({ searchParams }: IdeasPageProps) {
  const { q, photo, set, recipient } = await searchParams;

  return (
    <GiftPickerView
      query={q ?? ""}
      hasPhoto={photo === "1"}
      setId={set}
      recipientId={recipient}
    />
  );
}
