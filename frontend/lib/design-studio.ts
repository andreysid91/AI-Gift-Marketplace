/**
 * Design generation studio — mock AI layer (no real image model required).
 * Modes: photo | description | surprise → 4 variants → apply to products.
 */

export const DESIGN_SESSION_KEY = "ai-gift-design-pick";

export type DesignMode = "photo" | "description" | "surprise";

export type DesignVariant = {
  id: string;
  title: string;
  subtitle: string;
  /** CSS gradient for mock preview */
  gradient: string;
  emoji: string;
  styleTag: string;
  /** Optional user photo as data URL (photo mode) */
  photoDataUrl?: string | null;
  /** Prompt / description used */
  prompt: string;
};

export type DesignProductId =
  | "mug"
  | "tee"
  | "canvas"
  | "puzzle"
  | "magnet"
  | "photo"
  | "calendar"
  | "postcard";

export type DesignProduct = {
  id: DesignProductId;
  title: string;
  emoji: string;
  /** Maps to product configurator id when available */
  configProductId?: string;
  href: string;
};

export const DESIGN_PRODUCTS: DesignProduct[] = [
  {
    id: "mug",
    title: "Кружка",
    emoji: "☕",
    configProductId: "mug",
    href: "/configure?product=mug",
  },
  {
    id: "tee",
    title: "Футболка",
    emoji: "👕",
    configProductId: "tee",
    href: "/configure?product=tee",
  },
  {
    id: "canvas",
    title: "Холст",
    emoji: "🖼️",
    configProductId: "canvas",
    href: "/configure?product=canvas",
  },
  {
    id: "puzzle",
    title: "Пазл",
    emoji: "🧩",
    configProductId: "puzzle",
    href: "/configure?product=puzzle",
  },
  {
    id: "magnet",
    title: "Магнит",
    emoji: "🧲",
    href: "/ideas?q=" + encodeURIComponent("Магнит с дизайном"),
  },
  {
    id: "photo",
    title: "Фотография",
    emoji: "📷",
    href: "/photo/photos",
  },
  {
    id: "calendar",
    title: "Календарь",
    emoji: "📅",
    href: "/photo/calendar",
  },
  {
    id: "postcard",
    title: "Открытка",
    emoji: "💌",
    href: "/photo/postcard",
  },
];

export type DesignPickPayload = {
  mode: DesignMode;
  prompt: string;
  variant: DesignVariant;
  productId?: DesignProductId;
  createdAt: string;
};

const STYLE_PACKS: Array<{
  title: string;
  subtitle: string;
  gradient: string;
  emoji: string;
  styleTag: string;
}> = [
  {
    title: "Яркий поп",
    subtitle: "Сочные цвета, плакатный вайб",
    gradient: "from-[#ff7a5c] via-[#ff5a3c] to-[#e84528]",
    emoji: "🎨",
    styleTag: "pop",
  },
  {
    title: "Мягкая акварель",
    subtitle: "Нежные пятна и воздух",
    gradient: "from-[#a8d8ea] via-[#f6c6ea] to-[#ffe0c8]",
    emoji: "🖌️",
    styleTag: "watercolor",
  },
  {
    title: "Неон / кибер",
    subtitle: "Контраст и свечение",
    gradient: "from-[#1a1a2e] via-[#7b2cbf] to-[#00f5d4]",
    emoji: "✨",
    styleTag: "neon",
  },
  {
    title: "Минимализм",
    subtitle: "Чистые линии, мало деталей",
    gradient: "from-[#f5f0e8] via-[#e8e0d4] to-[#d4c4b0]",
    emoji: "⬜",
    styleTag: "minimal",
  },
  {
    title: "Винтаж",
    subtitle: "Тёплый ретро-оттенок",
    gradient: "from-[#c4a574] via-[#8b6914] to-[#5c4033]",
    emoji: "📜",
    styleTag: "vintage",
  },
  {
    title: "Комикс",
    subtitle: "Контур и заливка",
    gradient: "from-[#ffe66d] via-[#ff6b6b] to-[#4ecdc4]",
    emoji: "💥",
    styleTag: "comic",
  },
];

const SURPRISE_PROMPTS = [
  "Кот в космосе",
  "Собака в очках за рулём кабриолета",
  "Горы на закате в стиле оригами",
  "Чашка кофе, из которой растёт лес",
  "Робот дарит букет ромашек",
  "Кит среди звёзд",
  "Пицца как планета с кольцами",
  "Лиса в шарфе на велосипеде",
];

function pickStyles(seed: string, count = 4) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const start = hash % STYLE_PACKS.length;
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(STYLE_PACKS[(start + i) % STYLE_PACKS.length]);
  }
  return result;
}

function newVariantId(index: number): string {
  return `DES-${Date.now().toString(36).toUpperCase()}-${index}`;
}

/** Detect simple theme emoji from description */
function themeEmoji(prompt: string): string {
  const q = prompt.toLowerCase();
  if (/кот|кошк|cat/.test(q)) return "🐱";
  if (/собак|пёс|dog/.test(q)) return "🐶";
  if (/космос|звезд|space|ракет/.test(q)) return "🚀";
  if (/морс|океан|кит|рыб/.test(q)) return "🌊";
  if (/люб|сердц|romantic/.test(q)) return "❤️";
  if (/кофе|чай|круж/.test(q)) return "☕";
  if (/гор|лес|природ/.test(q)) return "🏔️";
  if (/робот|ai|кибер/.test(q)) return "🤖";
  return "🎁";
}

export function generateDesignVariants(input: {
  mode: DesignMode;
  prompt: string;
  photoDataUrl?: string | null;
}): DesignVariant[] {
  const prompt =
    input.mode === "surprise"
      ? input.prompt.trim() ||
        SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)]
      : input.prompt.trim() || "Персональный дизайн";

  const styles = pickStyles(prompt + input.mode, 4);
  const theme = themeEmoji(prompt);

  return styles.map((style, index) => ({
    id: newVariantId(index),
    title: style.title,
    subtitle:
      input.mode === "photo"
        ? `${style.subtitle} · по вашему фото`
        : `${prompt} · ${style.subtitle}`,
    gradient: style.gradient,
    emoji: input.mode === "photo" ? "📷" : theme,
    styleTag: style.styleTag,
    photoDataUrl: input.mode === "photo" ? input.photoDataUrl ?? null : null,
    prompt,
  }));
}

export function getSurprisePrompt(): string {
  return SURPRISE_PROMPTS[Math.floor(Math.random() * SURPRISE_PROMPTS.length)];
}

export function saveDesignPick(payload: DesignPickPayload) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DESIGN_SESSION_KEY, JSON.stringify(payload));
}

export function loadDesignPick(): DesignPickPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DESIGN_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DesignPickPayload;
  } catch {
    return null;
  }
}

export function clearDesignPick() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DESIGN_SESSION_KEY);
}

export function productHrefForDesign(
  product: DesignProduct,
  variant: DesignVariant,
): string {
  const params = new URLSearchParams();
  if (product.configProductId) {
    params.set("product", product.configProductId);
    params.set("design", variant.id);
    return `/configure?${params.toString()}`;
  }
  if (product.id === "photo") return "/photo/photos";
  if (product.id === "calendar") return "/photo/calendar";
  if (product.id === "postcard") return "/photo/postcard";
  params.set("q", `${product.title}: ${variant.prompt}`);
  params.set("design", variant.id);
  return `/ideas?${params.toString()}`;
}
