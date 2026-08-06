import type { Metadata } from "next";
import { PartnerPortalOrders } from "../../../components/partner-portal-orders";

export const metadata: Metadata = {
  title: "Мои заказы — Partner Portal",
  description: "Производственные заказы партнёра Gift.",
};

export default function PartnerOrdersPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#fff4ec_0%,#ffe8da_55%,#fff1e8_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 lg:py-10">
        <PartnerPortalOrders />
      </div>
    </main>
  );
}
