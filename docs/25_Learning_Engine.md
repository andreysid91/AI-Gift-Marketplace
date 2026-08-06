# Learning Engine — TASK-058

Система продуктовой аналитики **без AI**.  
Запоминает поведение пользователей и готовит статистику для будущих рекомендаций.

---

## Цель

Понимать спрос по фактам, а не по догадкам:

1. Что чаще ищут
2. Что чаще покупают
3. Что чаще добавляют вместе
4. Какие сценарии самые популярные
5. Какие фильтры используют
6. Какие подарки покупают повторно
7. Какие товары почти не открывают

Рекомендации Gift Engine позже усиливаются этими сигналами.  
Сейчас — архитектура + mock-данные + сбор событий + панель Owner.

---

## Принципы

1. **Не AI.** Только события, счётчики и агрегаты.
2. **Событие → склад → агрегат → инсайт.** Слои разделены.
3. **Privacy-light.** Не храним PII в событиях (имя, телефон, адрес). Допустимы анонимный `sessionKey` / `accountId` hash.
4. **Mock-first.** Локальный seed + `localStorage`; позже — серверный store.
5. **Рекомендации отдельно.** Learning Engine отдаёт сигналы; Knowledge / Gift Engine их потребляет, когда будет готово.

---

## Архитектура

```
UI (поиск, фильтры, сценарии, конструктор, checkout)
        │
        ▼
  track*(…)  ──►  Event Store (localStorage / будущий API)
        │
        ▼
  Aggregator  ──►  LearningInsights
        │
        ├──► Owner: раздел «Аналитика»
        └──► (позже) recommendGifts / ranking boost
```

| Слой | Путь | Роль |
|------|------|------|
| Типы | `frontend/lib/learning/types.ts` | События и инсайты |
| Seed | `frontend/data/learning-mock.json` | Стартовые mock-события |
| Store | `frontend/lib/learning/store.ts` | Load / save / seed |
| Track | `frontend/lib/learning/track.ts` | Запись событий из UI |
| Aggregate | `frontend/lib/learning/aggregate.ts` | Счётчики и топы |
| Signals | `frontend/lib/learning/signals.ts` | Сигналы для будущего ranking |
| UI | `frontend/components/learning-insights-panel.tsx` | Owner |

---

## Типы событий

| type | payload | Зачем |
|------|---------|--------|
| `search` | `query` | Частота запросов |
| `filter` | `dimension`, `value` | Популярные фильтры |
| `scenario` | `scenario` | gift / photo / business / custom |
| `product_open` | `productId` | Просмотры / открытия |
| `cart_add` | `productId` | Добавления в набор |
| `bundle` | `productIds[]` | Совместные добавления |
| `purchase` | `productIds[]` | Покупки (в т.ч. повторные) |

Каждое событие: `id`, `type`, `at` (ISO), `payload`, опционально `sessionKey`.

---

## Инсайты (агрегаты)

- **topSearches** — нормализованные запросы × count  
- **topPurchases** — productId × count  
- **topBundles** — пары productId-A|B × count  
- **topScenarios** — scenario × count  
- **topFilters** — dimension:value × count  
- **repeatPurchases** — товары с purchase count ≥ 2  
- **coldProducts** — каталог минус почти нулевые `product_open`  

---

## Связь с рекомендациями (будущее)

`getLearningSignals()` возвращает:

- `productBoost` — вес популярности / повторных покупок  
- `pairAffinity` — «часто берут вместе»  
- `coldPenalty` — штраф за холодные SKU  
- `queryHints` — частые формулировки поиска  

Gift Engine / `recommendGifts` **пока не обязан** их использовать.  
Когда подключим: лёгкий additive boost к score KB, без LLM.

---

## Owner

Раздел **Аналитика** в `/owner` — топы по всем семи метрикам + кнопка сброса к mock seed.

---

## Что не делать сейчас

- Не подключать ML / embeddings / LLM к аналитике  
- Не строить CRM на этих событиях (см. TASK-046)  
- Не слать события на внешние трекеры без отдельного решения  
- Не ломать текущий Knowledge-first recommend ради статистики  

---

## Критерии готовности TASK-058

1. Документ архитектуры  
2. Store + типы + mock seed  
3. Агрегаты по 7 направлениям  
4. Трекинг из ключевых UI-точек  
5. Панель в Owner  
6. Экспорт сигналов для будущего ranking  
7. Запись в Roadmap  
