# Gift Engine v1 — TASK-059

Центральный модуль подбора подарков.

**Все разделы сайта, которые предлагают товары / наборы / сценарий заказа, должны вызывать Gift Engine — не Knowledge recommend и не Agent напрямую.**

---

## Цель

Принять свободный запрос человека и вернуть готовое решение:

- лучшие товары  
- лучшие подарочные наборы  
- лучшие дополнения  
- срок изготовления  
- примерную стоимость  
- почему эти варианты подходят  

---

## Примеры входа

| Запрос | Ожидаемый упор |
|--------|----------------|
| «Подарок маме до 3000» | gift, получатель, бюджет |
| «100 футболок для компании» | business, quantity |
| «Фото на кружке» | photo, mentioned product |

---

## Параметры после разбора

| Параметр | Пример |
|----------|--------|
| Получатель | Мама |
| Повод | День рождения |
| Бюджет | 3000 |
| Количество | 100 |
| Срочность | normal / soon / urgent |
| Наличие фото | true/false |
| Тип заказа | gift / photo / business / custom |
| Город | Красноярск |

Плюс темы: хобби, профессии, стили (из JSON KB).

---

## Архитектура

```
UI / API
   │
   ▼
runGiftEngine(input)          ← sync, только локальные JSON
   │
   ├─ parseGiftEngineParams   ← правила, без AI
   ├─ Knowledge Base JSON     ← products, addons, …
   └─ GiftEngineResult
         products / sets / addons
         leadTime / cost / why

resolveGiftEngine(input)      ← async
   │
   └─ if needsEnrichment && enricher registered
         → GiftEngineEnricher (AI позже)
```

| Слой | Путь |
|------|------|
| Публичный API | `frontend/lib/gift-engine/` |
| Парсинг | `parse.ts` |
| Запуск | `run.ts` |
| AI-слот | `providers.ts` + `ai-enricher.ts` (server) |
| KB (внутр.) | `frontend/lib/knowledge/` |
| Док | этот файл |

### Принцип AI

1. **v1 не использует AI** в `runGiftEngine`.  
2. AI подключается **регистрацией enricher** (`registerGiftEngineEnricher`) — без переписывания ядра.  
3. Серверный `/api/recommend` может зарегистрировать OpenAI enricher, если нужен fallback.

---

## Публичные функции

```ts
runGiftEngine(input)           // knowledge-only
resolveGiftEngine(input)       // + optional enricher
parseGiftEngineParams(input)
getGiftEngineConstructorIds(input)
toGiftRecommendation(result)   // адаптер для старого UI
```

**Не импортировать** `recommendGifts` из UI — только через Gift Engine.

---

## Результат

```ts
GiftEngineResult {
  params, products, sets, addons,
  leadTimeHours, leadTimeLabel,
  estimatedCost, estimatedCostLabel,
  why[], confidence, source, needsEnrichment
}
```

---

## Точки использования

- `/ideas` конструктор — `runGiftEngineAsRecommendation`  
- `/create` сценарии — `params.orderType`  
- `/api/recommend` — `resolveGiftEngine`  
- `scenario-catalog` defaults — `getGiftEngineConstructorIds`  

---

## Критерии готовности TASK-059

1. Модуль `lib/gift-engine` с разбором параметров  
2. Только локальные JSON в sync-пути  
3. Ответ: товары, наборы, дополнения, срок, цена, why  
4. Слот для AI без переписывания ядра  
5. Основные разделы сайта ходят через Gift Engine  
6. Документ обновлён  
