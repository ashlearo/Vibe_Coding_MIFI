# Разбор ДЗ 2. Конструктор посещения события

**Файлы:** `index.html`, `style.css`, `app.js` · **Запуск:** открыть `index.html` двойным кликом в браузере.
Этот разбор объясняет, как объединить JSON, HTML/CSS и DOM для создания интерактивной карточки события.

---

## 1. Полный текст задания (сводка)

**Что сдать:** Ссылку на папку с 3 файлами (`index.html`, `style.css`, `app.js`).
**Данные:** В `app.js` должен быть `sourceJson`. Нужно распарсить его через `JSON.parse()` в `try...catch`.
**Расчёт:** Функция `buildReport` должна использовать `filter`, `map` (с деструктуризацией и `trim()`) и `reduce`. Она возвращает объект с `count`, `total` и `items`.
**Интерфейс:** Заголовок, дата, место, описание. Кнопка показа программы. Форма с чекбоксами. Ошибки. Итог и JSON-строка.
**Поведение:** Все скрытые блоки изначально имеют атрибут `hidden`. Используем `querySelector('#id')`. События `click` и `submit` через `addEventListener`.
**CSS:** Без Flexbox, Grid, псевдоэлементов. Только margin, padding, border, цвета.

---

## 2. Пошаговый разбор

### 2.1. Парсинг JSON и показ формы

> `sourceJson` разбирается через `JSON.parse()` в `try...catch`, результат называется `data`. (...) Блок программы, форма, области обеих ошибок, итог и JSON-строка изначально имеют атрибут `hidden`. Меняйте их видимость через свойство `hidden`.

```javascript
let data = null;

try {
    data = JSON.parse(sourceJson);
    form.hidden = false; // Показываем форму, если JSON корректен
} catch (error) {
    dataError.textContent = 'Ошибка данных.';
    dataError.hidden = false;
    form.hidden = true; // Скрываем форму при ошибке
}
```

**Почему так:**
- `try...catch` — это обязательное требование безопасности. Если в JSON опечатка (например, пропущена кавычка), программа не "упадёт" с ошибкой в консоли, а перехватит её.
- Изначально в HTML у формы стоит атрибут `hidden`. Мы меняем его на `false` только если парсинг прошёл успешно. Это защищает пользователя от взаимодействия со сломанным интерфейсом.

### 2.2. Кнопка «Показать программу»

> Кнопка «Показать программу» и блок программы `show-program`, `program`; по клику блок виден, его `innerHTML` равен `data.event.meeting`.

```javascript
btnShowProgram.addEventListener('click', () => {
    if (data && data.event) {
        programBlock.innerHTML = data.event.meeting;
        programBlock.hidden = false;
    }
});
```

**Почему так:**
- `addEventListener('click', () => { ... })` — современный способ повесить обработчик. Внутри мы передаём функцию, которая выполнится только при клике.
- `innerHTML = data.event.meeting` — вставляет текст из JSON внутрь блока.
- `hidden = false` — делает блок видимым.

### 2.3. Логика расчёта `buildReport`

> Используйте `filter` для отбора услуг и `map` для создания нового массива объектов. Внутри `map` извлеките `title` и `price` одноуровневой деструктуризацией и очистите `title` методом `trim()`. Сумму цен посчитайте через `reduce`. Исходные услуги не меняются.

```javascript
function buildReport(services, guideChecked, audioChecked, catalogChecked) {
    const filteredServices = services.filter((service) => {
        if (service.id === 'guide' && guideChecked) return true;
        if (service.id === 'audio' && audioChecked) return true;
        if (service.id === 'catalog' && catalogChecked) return true;
        return false;
    });

    const items = filteredServices.map((service) => {
        const { title, price } = service;
        return { title: title.trim(), price: price };
    });

    const total = items.reduce((sum, item) => sum + item.price, 0);

    return { count: items.length, total: total, items: items };
}
```

**Почему так:**
- **`filter`**: Мы проходим по исходному массиву `services` и оставляем только те объекты, для которых вернулось `true`.
- **`map`**: Создаёт *новый* массив. В задании сказано "Исходные услуги не меняются", поэтому мы не делаем `service.title = service.title.trim()` (это мутировало бы исходный объект), а создаём новый `{ title: ..., price: ... }`.
- **Деструктуризация**: `const { title, price } = service;` — это короткий и чистый способ вытащить свойства из объекта в переменные.
- **`reduce`**: Метод для сведения массива к одному значению. Мы берём `sum` (аккумулятор), прибавляем к нему цену текущего элемента и возвращаем новую сумму. Начинаем с `0`.

### 2.4. Обработка отправки формы и валидация

> В обработчике `submit` вызовите `event.preventDefault()`, прочитайте `checked` у чекбоксов и вызовите `buildReport`.

```javascript
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Отменяем перезагрузку страницы

    const isGuideChecked = checkGuide.checked;
    const isAudioChecked = checkAudio.checked;
    const isCatalogChecked = checkCatalog.checked;

    if (!isGuideChecked && !isAudioChecked && !isCatalogChecked) {
        choiceError.textContent = 'Выберите хотя бы одну услугу.';
        choiceError.hidden = false;
        resultBlock.hidden = true;
        reportJsonBlock.hidden = true;
        return; // Выходим из функции, чтобы не выполнять расчёт
    }

    choiceError.hidden = true; // Скрываем ошибку, если всё ок
    // ... дальнейший расчёт
});
```

**Почему так:**
- `event.preventDefault()` — критически важная строка. Без неё браузер попытается отправить форму на сервер и перезагрузить страницу, а наши данные пропадут.
- Сначала проверяем на пустой выбор. Если ничего не выбрано — показываем ошибку и через `return` прерываем выполнение функции (дальше код не пойдёт).
- Свойство `.checked` возвращает `true` или `false` в зависимости от того, стоит ли галочка в чекбоксе.

### 2.5. Вывод результата и JSON

> `innerHTML` результата: `Выбрано услуг: N<br>Итого: S руб.<br>название 1<br>название 2`. В `report-json` покажите только JSON-строку отчёта, полученную через `JSON.stringify()` и проверенную через `JSON.parse()`.

```javascript
    const report = buildReport(data.services, isGuideChecked, isAudioChecked, isCatalogChecked);

    let resultHtml = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.`;
    report.items.forEach((item) => {
        resultHtml += `<br>${item.title}`;
    });

    resultBlock.innerHTML = resultHtml;
    resultBlock.hidden = false;

    const jsonString = JSON.stringify(report);
    JSON.parse(jsonString); 
    
    reportJsonBlock.textContent = jsonString;
    reportJsonBlock.hidden = false;
```

**Почему так:**
- Мы формируем строку HTML вручную, добавляя теги `<br>`.
- `forEach` используется для перебора отфильтрованных услуг и добавления их названий.
- `JSON.stringify(report)` превращает объект JavaScript в строку. Задание требует тут же проверить её через `JSON.parse()`. Это делается для демонстрации того, что мы умеем безопасно сериализовать данные. Для вывода используем `textContent`, чтобы браузер не воспринимал текст как HTML-теги.

---

## 3. Финальная проверка по чек-листу

| Требование | Где реализовано | Статус |
|---|---|---|
| 3 файла, относительные пути | `index.html` (link, script) | ✔ |
| `try...catch` для JSON | `app.js`, строки 26-33 | ✔ |
| `filter`, `map` (destructuring, trim), `reduce` | `app.js`, функция `buildReport` | ✔ |
| Исходные услуги не меняются | `map` создаёт новый объект | ✔ |
| Скрытие/показ через `hidden` | `form.hidden = true/false` и др. | ✔ |
| `querySelector('#id')` | В начале `app.js` | ✔ |
| `event.preventDefault()` | В `submit` | ✔ |
| Очистка `title` от пробелов | `title.trim()` в `map` | ✔ |
| `innerHTML` по шаблону | `resultBlock.innerHTML = ...` | ✔ |
| CSS без Flexbox/Grid | `style.css` | ✔ |
| Минимум 2 правила для классов | `.card`, `.form-block`, `.error-message` и др. | ✔ |

---

## 4. Крайние случаи для самопроверки

| Сценарий | Ожидаемое поведение |
|---|---|
| Открытие с корректным JSON | Видна карточка и форма. Остальное скрыто. |
| Клик по «Показать программу» | Появляется текст: `Сбор: 18:30. Начало: 19:00.` |
| Выбор только «Аудиогид» | Итог: `Выбрано услуг: 1`, `Итого: 350 руб.`, `Аудиогид` |
| Выбор всех услуг | Итог: `Выбрано услуг: 3`, `Итого: 1100 руб.` |
| Пустой выбор (нажать Submit) | Появляется текст: `Выберите хотя бы одну услугу.` Итог и JSON скрыты. |
| Непустой выбор после ошибки | Ошибка исчезает, появляется итог и JSON. |
| Сломанный JSON (удалить кавычку) | Текст: `Ошибка данных.` Форма исчезает. |

> ⚠️ **Важно:** Перед сдачей обязательно проверь, что файлы открываются без сервера (двойным кликом) и в консоли браузера (F12) нет красных ошибок.