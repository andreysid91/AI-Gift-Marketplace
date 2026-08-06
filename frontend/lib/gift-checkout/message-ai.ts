/**
 * Mock AI greeting generator for checkout message step.
 * Swap for real LLM later via the same signature.
 */

const TEMPLATES = [
  (name: string, occasion: string) =>
    `Дорог${name ? `ая ${name}` : "ой друг"}!\n\nПусть ${occasion || "этот день"} принесёт тепло и улыбки. Этот подарок — с любовью и вниманием к тебе.\n\nС праздником!`,
  (name: string) =>
    `${name ? `${name}, ` : ""}спасибо, что ты есть.\n\nПусть этот подарок напомнит, как ты важен(на) для меня. Обнимаю!`,
  (_name: string, occasion: string) =>
    `С ${occasion || "праздником"}!\n\nЖелаю радости, лёгкости и моментов, которые хочется сохранить. Этот подарок — маленький знак большой заботы.`,
  (name: string) =>
    `Привет${name ? `, ${name}` : ""}!\n\nЯ долго выбирал(а) что-то особенное — и вот оно. Надеюсь, тебе понравится так же, как мне нравится тебя радовать.`,
];

export function generateGreetingMessage(input: {
  recipientHint?: string;
  occasionHint?: string;
  giftTitle?: string;
}): string {
  const name = (input.recipientHint || "").trim();
  const occasion = (input.occasionHint || "").trim();
  const pick = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  let text = pick(name, occasion);
  if (input.giftTitle?.trim()) {
    text += `\n\nP.S. Внутри — «${input.giftTitle.trim()}».`;
  }
  return text;
}
