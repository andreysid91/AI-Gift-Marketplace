export const PARTNER_CAPABILITIES = [
  { id: "mugs", label: "Кружки" },
  { id: "tees", label: "Футболки" },
  { id: "canvas", label: "Холсты" },
  { id: "laser", label: "Лазер" },
  { id: "print-3d", label: "3D печать" },
  { id: "embroidery", label: "Вышивка" },
  { id: "uv-print", label: "УФ печать" },
  { id: "photobooks", label: "Фотокниги" },
] as const;

export type PartnerCapabilityId = (typeof PARTNER_CAPABILITIES)[number]["id"];

export type PartnerProfile = {
  id: string;
  name: string;
  city: string;
  status: "Активный" | "Проверяется" | "Отключен";
  capabilities: PartnerCapabilityId[];
  maxProductionDays: number;
  contact: string;
  address: string;
  /** Average / starting price note */
  pricing: string;
  minOrder: string;
  description: string;
};

export const PARTNERS: PartnerProfile[] = [
  {
    id: "P-01",
    name: "PrintHouse Красноярск",
    city: "Красноярск",
    status: "Активный",
    capabilities: ["mugs", "tees", "canvas", "uv-print", "photobooks"],
    maxProductionDays: 3,
    contact: "+7 391 200-11-22 · print@printhouse.kr.ru",
    address: "г. Красноярск, ул. Дубровинского, 52",
    pricing: "от 350 ₽ · кружки от 990 ₽ · холсты от 2 490 ₽",
    minOrder: "от 1 шт",
    description: "Основной партнёр по сублимации, текстилю и фотопечати.",
  },
  {
    id: "P-02",
    name: "LaserCraft",
    city: "Красноярск",
    status: "Активный",
    capabilities: ["laser", "print-3d", "uv-print"],
    maxProductionDays: 5,
    contact: "+7 391 255-40-10 · hello@lasercraft.kr.ru",
    address: "г. Красноярск, ул. Авиаторов, 19",
    pricing: "гравировка от 1 590 ₽ · 3D от 3 990 ₽",
    minOrder: "от 1 шт",
    description: "Лазерная гравировка, акрил, дерево и объёмные сувениры.",
  },
  {
    id: "P-03",
    name: "Embroidery Lab",
    city: "Красноярск",
    status: "Проверяется",
    capabilities: ["embroidery", "tees"],
    maxProductionDays: 7,
    contact: "+7 913 700-55-01 · lab@embroidery.kr.ru",
    address: "г. Красноярск, ул. Молокова, 33",
    pricing: "вышивка от 1 890 ₽ · текстиль от 1 690 ₽",
    minOrder: "от 5 шт",
    description: "Машинная вышивка логотипов и именных надписей на текстиле.",
  },
  {
    id: "P-04",
    name: "PhotoLab Express",
    city: "Красноярск",
    status: "Активный",
    capabilities: ["photobooks", "canvas", "uv-print"],
    maxProductionDays: 4,
    contact: "+7 391 277-18-90 · order@photolab.kr.ru",
    address: "г. Красноярск, пр. Мира, 91",
    pricing: "фотокниги от 3 490 ₽ · холсты от 2 490 ₽",
    minOrder: "от 1 шт",
    description: "Быстрая фотопечать, фотокниги и галерейные холсты.",
  },
  {
    id: "P-05",
    name: "Textile Pro",
    city: "Красноярск",
    status: "Активный",
    capabilities: ["tees", "embroidery", "mugs"],
    maxProductionDays: 10,
    contact: "+7 391 212-00-77 · b2b@textilepro.kr.ru",
    address: "г. Красноярск, ул. Заводская, 5",
    pricing: "тиражи от 1 200 ₽/шт · welcome-box по запросу",
    minOrder: "от 10 шт",
    description: "Корпоративные тиражи: футболки, вышивка и наборы.",
  },
  {
    id: "P-06",
    name: "UV Studio North",
    city: "Красноярск",
    status: "Активный",
    capabilities: ["uv-print", "mugs", "laser"],
    maxProductionDays: 2,
    contact: "+7 999 450-12-12 · north@uvstudio.ru",
    address: "г. Красноярск, ул. Маерчака, 18",
    pricing: "УФ-печать от 450 ₽ · срочные заказы +30%",
    minOrder: "от 1 шт",
    description: "Срочная УФ-печать на сувенирах и твёрдых поверхностях.",
  },
];

export function capabilityLabel(id: PartnerCapabilityId): string {
  return (
    PARTNER_CAPABILITIES.find((item) => item.id === id)?.label ?? id
  );
}

export function formatMaxProductionDays(days: number): string {
  if (days === 1) return "до 1 дня";
  if (days >= 2 && days <= 4) return `до ${days} дней`;
  return `до ${days} дней`;
}

export function getPartnerById(id: string): PartnerProfile | undefined {
  return PARTNERS.find((partner) => partner.id === id);
}

export function getActivePartners(): PartnerProfile[] {
  return PARTNERS.filter((partner) => partner.status === "Активный");
}
