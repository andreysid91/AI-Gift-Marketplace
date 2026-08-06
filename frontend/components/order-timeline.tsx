import {
  CUSTOMER_TIMELINE,
  customerDoneCount,
} from "../lib/customer-timeline";

type OrderTimelineProps = {
  /** Internal pipeline status */
  status?: string | null;
  /** Override completed step count (default from status, or 1 = Получен) */
  doneCount?: number;
  className?: string;
};

export function OrderTimeline({
  status,
  doneCount: doneCountProp,
  className = "",
}: OrderTimelineProps) {
  const doneCount =
    doneCountProp ?? (status ? customerDoneCount(status) : 1);
  const allDone = doneCount >= CUSTOMER_TIMELINE.length;
  const currentIndex = allDone ? -1 : doneCount;

  return (
    <ol className={`space-y-0 ${className}`}>
      {CUSTOMER_TIMELINE.map((label, index) => {
        const complete = index < doneCount;
        const current = index === currentIndex;
        const isLast = index === CUSTOMER_TIMELINE.length - 1;

        return (
          <li key={label} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast ? (
              <span
                aria-hidden
                className={`absolute left-[15px] top-8 h-[calc(100%-12px)] w-0.5 ${
                  index < doneCount ? "bg-[var(--mint)]" : "bg-[var(--line)]"
                }`}
              />
            ) : null}

            <span
              className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                complete
                  ? "bg-[var(--mint)] text-white"
                  : current
                    ? "border-2 border-[var(--accent)] bg-white text-[var(--accent)]"
                    : "border-2 border-[var(--line)] bg-white text-[var(--muted)]"
              }`}
              aria-current={current ? "step" : undefined}
            >
              {complete ? "✔" : "○"}
            </span>

            <div className="min-w-0 pt-0.5">
              <p
                className={`font-[family-name:var(--font-unbounded)] text-lg font-semibold sm:text-xl ${
                  complete || current
                    ? "text-[var(--foreground)]"
                    : "text-[var(--muted)]"
                }`}
              >
                {label}
              </p>
              {complete && index === 0 && doneCount === 1 ? (
                <p className="mt-0.5 text-sm font-bold text-[var(--mint)]">
                  Заказ принят
                </p>
              ) : current ? (
                <p className="mt-0.5 text-sm font-bold text-[var(--accent)]">
                  Следующий шаг
                </p>
              ) : allDone && isLast ? (
                <p className="mt-0.5 text-sm font-bold text-[var(--mint)]">
                  Готово
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
