"use client";

import { useEffect, useState } from "react";
import {
  getPublicWorks,
  type InspirationWork,
} from "../lib/inspiration";
import { InspirationGalleryGrid } from "./inspiration-work-card";

export function InspirationGallery() {
  const [works, setWorks] = useState<InspirationWork[]>([]);

  useEffect(() => {
    function sync() {
      setWorks(getPublicWorks());
    }
    sync();
    window.addEventListener("ai-gift-inspiration-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ai-gift-inspiration-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <div>
      <div className="max-w-2xl">
        <h1 className="font-[family-name:var(--font-unbounded)] text-4xl font-semibold sm:text-5xl">
          Галерея вдохновения
        </h1>
        <p className="mt-3 text-lg font-bold text-[var(--muted)]">
          Только публичные работы пользователей. Увидели идею — закажите такую
          же.
        </p>
      </div>

      <div className="mt-10">
        <InspirationGalleryGrid works={works} />
      </div>
    </div>
  );
}
