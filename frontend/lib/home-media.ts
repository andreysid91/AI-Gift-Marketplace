/**
 * Home / showcase photo library — warm gift & people shots (Unsplash).
 * Used so the product never looks like emoji placeholders.
 */

export const HOME_PHOTOS = {
  mugHands:
    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
  mugWarm:
    "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=80",
  coupleGift:
    "https://images.unsplash.com/photo-1513201099705-a9746d1aa7a6?auto=format&fit=crop&w=900&q=80",
  canvasWall:
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=900&q=80",
  teeWear:
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  familyTable:
    "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80",
  packing:
    "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80",
  smileOpen:
    "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80",
  photoPrint:
    "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=900&q=80",
  officeMerch:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
  birthday:
    "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80",
  grandma:
    "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=900&q=80",
  kids:
    "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=80",
  workshop:
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80",
  delivery:
    "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80",
} as const;

export type HomeCategory = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

export const POPULAR_HOME_CATEGORIES: HomeCategory[] = [
  {
    id: "mug",
    title: "Кружки",
    subtitle: "С фото и портретом",
    href: "/gift?id=mug",
    image: HOME_PHOTOS.mugHands,
  },
  {
    id: "canvas",
    title: "Холсты",
    subtitle: "Картина на стену",
    href: "/gift?id=canvas",
    image: HOME_PHOTOS.canvasWall,
  },
  {
    id: "tee",
    title: "Футболки",
    subtitle: "Принт под человека",
    href: "/gift?id=tee",
    image: HOME_PHOTOS.teeWear,
  },
  {
    id: "photo",
    title: "Фотопечать",
    subtitle: "Фотокниги и снимки",
    href: "/photo",
    image: HOME_PHOTOS.photoPrint,
  },
  {
    id: "puzzle",
    title: "Пазлы",
    subtitle: "Семейный вечер",
    href: "/gift?id=puzzle",
    image: HOME_PHOTOS.familyTable,
  },
  {
    id: "business",
    title: "Для бизнеса",
    subtitle: "Тираж и мерч",
    href: "/business",
    image: HOME_PHOTOS.officeMerch,
  },
];

export type WeekIdea = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  badge: string;
};

export const WEEK_IDEAS: WeekIdea[] = [
  {
    id: "w1",
    title: "Портрет маме на кружке",
    subtitle: "Акварель · к дню рождения",
    href: "/gift?id=mug",
    image: HOME_PHOTOS.mugWarm,
    badge: "Хит недели",
  },
  {
    id: "w2",
    title: "Холст для пары",
    subtitle: "Стиль Pixar · годовщина",
    href: "/gift?id=canvas",
    image: HOME_PHOTOS.coupleGift,
    badge: "Вау-эффект",
  },
  {
    id: "w3",
    title: "Футболка брату",
    subtitle: "Комикс с фото",
    href: "/gift?id=tee",
    image: HOME_PHOTOS.teeWear,
    badge: "Быстрый заказ",
  },
  {
    id: "w4",
    title: "Пазл семье",
    subtitle: "Общее фото · новоселье",
    href: "/gift?id=puzzle",
    image: HOME_PHOTOS.familyTable,
    badge: "Для дома",
  },
];
