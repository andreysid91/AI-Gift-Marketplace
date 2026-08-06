import {
  PARTNER_CAPABILITIES,
  capabilityLabel,
  formatMaxProductionDays,
  type PartnerCapabilityId,
  type PartnerProfile,
} from "../lib/partners";

type PartnerCardProps = {
  partner: PartnerProfile;
};

const STATUS_TONE: Record<PartnerProfile["status"], string> = {
  Активный: "bg-[var(--mint-soft)] text-[var(--mint)]",
  Проверяется: "bg-[var(--secondary-soft)] text-[#c56a12]",
  Отключен: "bg-[#efe6d8] text-[#6b5344]",
};

function CapabilityGrid({ active }: { active: PartnerCapabilityId[] }) {
  const activeSet = new Set(active);

  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        Что умеет делать
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PARTNER_CAPABILITIES.map((item) => {
          const on = activeSet.has(item.id);
          return (
            <li
              key={item.id}
              className={`rounded-[14px] px-3 py-2.5 text-center text-sm font-extrabold ${
                on
                  ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "bg-[var(--surface-warm)] text-[var(--muted)] opacity-45"
              }`}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[28px] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-[var(--muted)]">
            {partner.id} · {partner.city}
          </p>
          <h2 className="mt-2 font-[family-name:var(--font-unbounded)] text-2xl font-semibold sm:text-3xl">
            {partner.name}
          </h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-extrabold ${STATUS_TONE[partner.status]}`}
        >
          {partner.status}
        </span>
      </div>

      <p className="mt-3 text-base font-bold text-[var(--muted)]">
        {partner.description}
      </p>

      <div className="mt-5">
        <CapabilityGrid active={partner.capabilities} />
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label="Максимальный срок изготовления"
          value={formatMaxProductionDays(partner.maxProductionDays)}
        />
        <Field label="Минимальный заказ" value={partner.minOrder} />
        <Field label="Стоимость" value={partner.pricing} />
        <Field label="Контакт" value={partner.contact} />
      </div>

      <div className="mt-4">
        <Field label="Адрес" value={partner.address} />
      </div>

      <p className="mt-5 text-sm font-bold text-[var(--muted)]">
        Специализация:{" "}
        {partner.capabilities.map(capabilityLabel).join(" · ")}
      </p>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-extrabold uppercase tracking-wide text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-1 text-base font-extrabold leading-snug text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}
