# Разбор ДЗ 1. Консольное меню

**Файл:** `homework-1.js` · **Запуск:** `node homework-1.js`
Разбор построен параллельно с текстом задания: сначала цитата требования, затем реализация и объяснение.

---

## Содержание

1. [Полный текст задания (сводка)](#1-полный-текст-задания-сводка)
2. [Полный код решения](#2-полный-код-решения)
3. [Запуск и главное меню](#3-запуск-и-главное-меню)
4. [Билетная касса](#4-билетная-касса)
5. [Доставка заказа](#5-доставка-заказа)
6. [Лестница](#6-лестница)
7. [Финальная проверка по чек-листу](#7-финальная-проверка-по-чек-листу)
8. [Крайние случаи для самопроверки](#8-крайние-случаи-для-самопроверки)

---

## 1. Полный текст задания (сводка)

**Что сдать:** одну ссылку на работу (Яндекс.Диск, GitVerse, GitHub и т.п.). Ссылка должна открываться без запроса доступа.

**Как запускается:** `node homework-1.js`. Программа печатает меню, читает выбор через `readline`, запрашивает нужные числа, печатает результат и завершается. Если введён не 1, 2 или 3 — печатает `такой задачи нет`.

**1. Билетная касса.** Запросить категорию и бюджет. `ticketPrice(category)` через `switch`: 1→300, 2→500, 3→900, иначе 0. `maxTickets(budget, price)` циклом `while` считает количество билетов без деления и округления. `printTicketResult(category, budget)` вызывает первые две; для неизвестной категории печатает только `неизвестная категория`, иначе — чек по шаблону.

**2. Доставка заказа.** Запросить расстояние и сумму заказа. `deliveryPrice(distance, total)`: заказ ≥ 3000 → 0; иначе ≤ 3 км → 0; 4–10 км → 200; > 10 км → 200 + 25 за каждый км после 10-го. `printDelivery` печатает одну строку по шаблону.

**3. Лестница.** Запросить высоту. `printSteps(height)` циклом `for` печатает ступени от 1 до height. Ступень 4 пропустить через `continue`. После ступени 10 напечатать `Дальше лестница не построена` и выйти через `break`. После цикла — `Всего построено: N`.

**Перед сдачей:** в файле есть `switch`, `while`, `for`, `continue`, `break`. Функции, которые считают, возвращают значение, а не печатают. При неверном пункте меню — `такой задачи нет`.

---

## 2. Полный код решения

```javascript
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

// ==========================================
// 1. Билетная касса
// ==========================================

function ticketPrice(category) {
  switch (category) {
    case 1: return 300;
    case 2: return 500;
    case 3: return 900;
    default: return 0;
  }
}

function maxTickets(budget, price) {
  if (price === 0) return 0;

  let count = 0;
  let currentBudget = budget;

  while (currentBudget >= price) {
    currentBudget -= price;
    count++;
  }
  return count;
}

function printTicketResult(category, budget) {
  const price = ticketPrice(category);

  if (price === 0) {
    console.log('неизвестная категория');
    return;
  }

  const count = maxTickets(budget, price);
  console.log(`Категория ${category}, билет ${price} руб., бюджет ${budget} руб.: можно купить ${count} шт.`);
}

// ==========================================
// 2. Доставка заказа
// ==========================================

function deliveryPrice(distance, total) {
  if (total >= 3000) return 0;
  if (distance <= 3) return 0;
  if (distance >= 4 && distance <= 10) return 200;
  if (distance > 10) return 200 + 25 * (distance - 10);

  return 0;
}

function printDelivery(distance, total) {
  const price = deliveryPrice(distance, total);
  console.log(`Расстояние ${distance} км, заказ ${total} руб.: доставка ${price} руб.`);
}

// ==========================================
// 3. Лестница
// ==========================================

function printSteps(height) {
  let builtSteps = 0;

  for (let i = 1; i <= height; i++) {
    if (i === 4) {
      continue;
    }

    if (i > 10) {
      console.log('Дальше лестница не построена');
      break;
    }

    console.log(`Ступень ${i}`);
    builtSteps++;
  }

  console.log(`Всего построено: ${builtSteps}`);
}

// ==========================================
// Главное меню и запуск
// ==========================================

async function main() {
  console.log('Выберите задачу:');
  console.log('1 — билетная касса');
  console.log('2 — доставка заказа');
  console.log('3 — лестница');

  const choiceStr = await rl.question('Ваш выбор: ');
  const choice = Number(choiceStr);

  if (choice === 1) {
    const category = Number(await rl.question('Категория билета: '));
    const budget = Number(await rl.question('Бюджет: '));
    printTicketResult(category, budget);
  } else if (choice === 2) {
    const distance = Number(await rl.question('Расстояние: '));
    const total = Number(await rl.question('Сумма заказа: '));
    printDelivery(distance, total);
  } else if (choice === 3) {
    const height = Number(await rl.question('Высота лестницы: '));
    printSteps(height);
  } else {
    console.log('такой задачи нет');
  }

  rl.close();
}

main().catch(console.error);
```

---

## 3. Запуск и главное меню

> «Программа печатает меню… Прочитайте выбор пользователя через `readline`. Если введён не 1, 2 или 3, напечатайте `такой задачи нет` и завершите программу.»

```javascript
const readline = require('readline/promises');
const { stdin: input, stdout: output } = require('process');

const rl = readline.createInterface({ input, output });

async function main() {
  console.log('Выберите задачу:');
  console.log('1 — билетная касса');
  console.log('2 — доставка заказа');
  console.log('3 — лестница');

  const choiceStr = await rl.question('Ваш выбор: ');
  const choice = Number(choiceStr);

  if (choice === 1) { /* ... */ }
  else if (choice === 2) { /* ... */ }
  else if (choice === 3) { /* ... */ }
  else {
    console.log('такой задачи нет');
  }

  rl.close();
}

main().catch(console.error);
```

**Почему так:**

- `readline/promises` — современный способ ввода: `await rl.question(...)` возвращает ответ прямо в переменную, без колбэков.
- `Number(choiceStr)` обязателен: `rl.question` всегда возвращает **строку**. Без приведения `'1' !== 1`, и все проверки сломаются.
- `rl.close()` — без него процесс Node.js не завершится, потому что `readline` держит поток ввода открытым.
- `main().catch(console.error)` — аккуратная обработка ошибок (например, `Ctrl+C`).

---

## 4. Билетная касса

> «Для пункта 1 запросите категорию билета и бюджет в рублях.»

```javascript
if (choice === 1) {
  const category = Number(await rl.question('Категория билета: '));
  const budget = Number(await rl.question('Бюджет: '));
  printTicketResult(category, budget);
}
```

Снова `Number`: дальше бюджет будет сравниваться с ценой и уменьшаться, а строка может дать неожиданный результат при неявном приведении.

> «`ticketPrice(category)` через `switch` возвращает цену билета: для категории 1 — 300, для 2 — 500, для 3 — 900. Для другой категории возвращает 0.»

```javascript
function ticketPrice(category) {
  switch (category) {
    case 1: return 300;
    case 2: return 500;
    case 3: return 900;
    default: return 0;
  }
}
```

- `switch` — требование задания, используем именно его.
- `return` прямо в `case` — идиоматично: `return` завершает функцию, `break` не нужен.
- `default: return 0` закрывает требование «для другой категории — 0».

> «`maxTickets(budget, price)` циклом `while` считает, сколько билетов по цене `price` можно купить на бюджет `budget`. Не используйте деление и округление.»

```javascript
function maxTickets(budget, price) {
  if (price === 0) return 0;

  let count = 0;
  let currentBudget = budget;

  while (currentBudget >= price) {
    currentBudget -= price;
    count++;
  }
  return count;
}
```

- **Никакого деления.** «Покупаем» по одному билету: пока денег хватает — вычитаем цену и увеличиваем счётчик.
- `if (price === 0) return 0;` — защита от бесконечного цикла (иначе `currentBudget >= 0` всегда истинно).
- `let currentBudget = budget;` — работаем с копией, чтобы не менять аргумент (сайд-эффекты).

> «`printTicketResult(category, budget)` вызывает первые две функции. Для неизвестной категории печатает только `неизвестная категория`. В остальных случаях печатает чек.»

```javascript
function printTicketResult(category, budget) {
  const price = ticketPrice(category);

  if (price === 0) {
    console.log('неизвестная категория');
    return;
  }

  const count = maxTickets(budget, price);
  console.log(`Категория ${category}, билет ${price} руб., бюджет ${budget} руб.: можно купить ${count} шт.`);
}
```

Сначала `ticketPrice`. Если 0 — печатаем сообщение и `return`, дальше не идём. Иначе — `maxTickets` и чек через шаблонную строку.

---

## 5. Доставка заказа

> «`deliveryPrice(distance, total)` возвращает стоимость доставки. Если сумма заказа не меньше 3000, доставка бесплатна. Иначе до 3 километров включительно доставка тоже бесплатна; от 4 до 10 километров включительно — 200 рублей; дальше — 200 рублей и ещё 25 рублей за каждый километр после десятого.»

```javascript
function deliveryPrice(distance, total) {
  if (total >= 3000) return 0;
  if (distance <= 3) return 0;
  if (distance >= 4 && distance <= 10) return 200;
  if (distance > 10) return 200 + 25 * (distance - 10);

  return 0;
}
```

- **Порядок проверок важен.** Сначала самая «сильная» причина бесплатной доставки — сумма заказа. Если заказ 3000+, расстояние неважно.
- Диапазоны расстояния идут по возрастанию: ≤3 → 0; 4–10 → 200; >10 → формула.
- Формула `200 + 25 * (distance - 10)`: для 12 км → `200 + 25 * 2 = 250`, как в примере.
- Финальный `return 0` — страховка для дробных значений (3–4 км), которых нет в задании.

> «`printDelivery(distance, total)` вызывает первую функцию и печатает одну строку по шаблону: `Расстояние 12 км, заказ 2500 руб.: доставка 250 руб.`»

```javascript
function printDelivery(distance, total) {
  const price = deliveryPrice(distance, total);
  console.log(`Расстояние ${distance} км, заказ ${total} руб.: доставка ${price} руб.`);
}
```

Одна шаблонная строка точно по образцу, без лишних слов.

---

## 6. Лестница

> «Создайте функцию `printSteps(height)`. Она циклом `for` печатает номера ступеней от 1 до `height`. Ступень 4 не строят: пропустите её через `continue`. После ступени 10 строительство останавливается: напечатайте `Дальше лестница не построена` и выйдите из цикла через `break`. После цикла напечатайте количество построенных ступеней: `Всего построено: N`.»

```javascript
function printSteps(height) {
  let builtSteps = 0;

  for (let i = 1; i <= height; i++) {
    if (i === 4) {
      continue;
    }

    if (i > 10) {
      console.log('Дальше лестница не построена');
      break;
    }

    console.log(`Ступень ${i}`);
    builtSteps++;
  }

  console.log(`Всего построено: ${builtSteps}`);
}
```

- `for (let i = 1; i <= height; i++)` — ровно от 1 до `height` включительно.
- `if (i === 4) continue;` — пропускаем всё ниже в теле цикла: «Ступень 4» не печатается, `builtSteps` не растёт.
- `if (i > 10) { ... break; }` — на 11-й итерации (когда 10-я уже напечатана) выходим из цикла. Строка «Ступень 11» не выполнится.
- `builtSteps++` только после успешной печати. Для `height = 12`: 1,2,3,5,6,7,8,9,10 → 9 ступеней. Совпадает с примером.

> ⚠️ **Порядок проверок.** В данном случае `continue` и `break` не конфликтуют: для `i = 4` первая проверка истинна (continue), для `i = 11` первая ложна, вторая истинна (break). Но правило хорошего тона — ставить «исключения» (`continue`) раньше «границ» (`break`), чтобы читалось сверху вниз по возрастанию.

---

## 7. Финальная проверка по чек-листу

| Требование | Где реализовано | Статус |
|---|---|---|
| Запуск `node homework-1.js` | Имя файла, `main()` | ✔ |
| Меню и `readline` | `main()`, `rl.question` | ✔ |
| Неверный пункт → `такой задачи нет` | `else { console.log('такой задачи нет'); }` | ✔ |
| `ticketPrice` через `switch` | Функция `ticketPrice` | ✔ |
| `maxTickets` через `while`, без деления | Функция `maxTickets` | ✔ |
| `printTicketResult` с проверкой категории | Функция `printTicketResult` | ✔ |
| `deliveryPrice` с диапазонами | Функция `deliveryPrice` | ✔ |
| `printDelivery` по шаблону | Функция `printDelivery` | ✔ |
| `printSteps` с `for`, `continue`, `break` | Функция `printSteps` | ✔ |
| Считающие функции возвращают, а не печатают | `ticketPrice`, `maxTickets`, `deliveryPrice` — `return` | ✔ |
| Печать только в `print...` | `printTicketResult`, `printDelivery`, `printSteps` | ✔ |

---

## 8. Крайние случаи для самопроверки

Перед сдачей запусти программу и проверь сценарии, которых нет в примерах:

| Сценарий | Ожидаемое поведение |
|---|---|
| Меню: ввести `0`, `4`, `-1`, `abc` | `такой задачи нет`, программа завершается |
| Билеты: категория `4` (или любая не 1–3) | `неизвестная категория`, без чека |
| Билеты: бюджет `0` или отрицательный | `можно купить 0 шт.` |
| Билеты: бюджет `2300`, категория `2` | `можно купить 4 шт.` (пример из задания) |
| Доставка: заказ `3000`, расстояние любое | доставка `0 руб.` |
| Доставка: заказ `2999`, расстояние `3` | доставка `0 руб.` (до 3 км включительно) |
| Доставка: заказ `2999`, расстояние `4` | доставка `200 руб.` |
| Доставка: заказ `2500`, расстояние `12` | доставка `250 руб.` (пример из задания) |
| Лестница: высота `1` | `Ступень 1` · `Всего построено: 1` |
| Лестница: высота `3` | ступени 1–3 · `Всего построено: 3` |
| Лестница: высота `10` | 1,2,3,5,6,7,8,9,10 · `Всего построено: 9` |
| Лестница: высота `12` | 1,2,3,5,6,7,8,9,10 · `Дальше лестница не построена` · `Всего построено: 9` |
| Лестница: высота `0` или отрицательная | цикл не выполнится · `Всего построено: 0` |

> ✅ **Проверка завершения процесса.** После вывода результата программа должна завершиться сама. Если висит — забыт `rl.close()`.

---

*Разбор подготовлен к сдаче ДЗ 1. Код полностью соответствует чек-листу задания: есть `switch`, `while`, `for`, `continue`, `break`; считающие функции возвращают значение; неверный пункт меню даёт `такой задачи нет`.*