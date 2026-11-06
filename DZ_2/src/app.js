const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

// Находим все нужные элементы
const btnShowProgram = document.querySelector('#show-program');
const programBlock = document.querySelector('#program');
const form = document.querySelector('#service-form');
const dataError = document.querySelector('#data-error');
const choiceError = document.querySelector('#choice-error');
const resultBlock = document.querySelector('#result');
const reportJsonBlock = document.querySelector('#report-json');

const checkGuide = document.querySelector('#guide');
const checkAudio = document.querySelector('#audio');
const checkCatalog = document.querySelector('#catalog');

let data = null;

// 1. Парсинг JSON с обработкой ошибок
try {
    data = JSON.parse(sourceJson);
    form.hidden = false; // Показываем форму, если JSON корректен
} catch (error) {
    dataError.textContent = 'Ошибка данных.';
    dataError.hidden = false;
    form.hidden = true; // Скрываем форму при ошибке
}

// 2. Функция расчёта отчёта
function buildReport(services, guideChecked, audioChecked, catalogChecked) {
    // Фильтруем услуги: оставляем только те, чьи id соответствуют true
    const filteredServices = services.filter((service) => {
        if (service.id === 'guide' && guideChecked) return true;
        if (service.id === 'audio' && audioChecked) return true;
        if (service.id === 'catalog' && catalogChecked) return true;
        return false;
    });

    // Формируем новый массив объектов, очищая title от пробелов
    const items = filteredServices.map((service) => {
        const { title, price } = service; // Деструктуризация
        return { title: title.trim(), price: price };
    });

    // Считаем сумму через reduce
    const total = items.reduce((sum, item) => sum + item.price, 0);

    return {
        count: items.length,
        total: total,
        items: items
    };
}

// 3. Обработчик кнопки "Показать программу"
btnShowProgram.addEventListener('click', () => {
    if (data && data.event) {
        programBlock.innerHTML = data.event.meeting;
        programBlock.hidden = false;
    }
});

// 4. Обработчик отправки формы
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Отменяем перезагрузку страницы

    const isGuideChecked = checkGuide.checked;
    const isAudioChecked = checkAudio.checked;
    const isCatalogChecked = checkCatalog.checked;

    // Проверка на пустой выбор
    if (!isGuideChecked && !isAudioChecked && !isCatalogChecked) {
        choiceError.textContent = 'Выберите хотя бы одну услугу.';
        choiceError.hidden = false;
        resultBlock.hidden = true;
        reportJsonBlock.hidden = true;
        return;
    }

    // Скрываем ошибку, если выбор есть
    choiceError.hidden = true;

    // Вызываем расчёт
    const report = buildReport(data.services, isGuideChecked, isAudioChecked, isCatalogChecked);

    // Формируем HTML для результата
    let resultHtml = `Выбрано услуг: ${report.count}<br>Итого: ${report.total} руб.`;
    report.items.forEach((item) => {
        resultHtml += `<br>${item.title}`;
    });

    resultBlock.innerHTML = resultHtml;
    resultBlock.hidden = false;

    // Формируем и проверяем JSON-строку
    const jsonString = JSON.stringify(report);
    JSON.parse(jsonString); // Проверка (не упадёт, если всё ок)
    
    reportJsonBlock.textContent = jsonString;
    reportJsonBlock.hidden = false;
});