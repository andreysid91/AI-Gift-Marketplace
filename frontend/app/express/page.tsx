import type { Metadata } from "next";
import { ExpressGiftFlow } from "../../components/express-gift-flow";

export const metadata: Metadata = {
  title: "Экспресс подарок — AI Gift",
  description: "Нужно срочно? Подберём подарок за 1 минуту.",
};

export default function ExpressPage() {
  return <ExpressGiftFlow />;
}
