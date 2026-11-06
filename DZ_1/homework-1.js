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
  // Если цена 0 (неизвестная категория), то билетов можно купить 0 (или бесконечно, но по заданию возвращаем 0)
  if (price === 0) return 0; 
  
  let count = 0;
  let currentBudget = budget;
  
  // Считаем циклом while без деления и округления
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
  if (total >= 3000) {
    return 0;
  }
  
  if (distance <= 3) {
    return 0;
  }
  
  if (distance >= 4 && distance <= 10) {
    return 200;
  }
  
  // Если больше 10 км
  if (distance > 10) {
    // 200 рублей и ещё 25 рублей за каждый километр после 10-го.
    // Например, для 12 км: 200 + 25 * (12 - 10) = 250
    return 200 + 25 * (distance - 10);
  }
  
  return 0; // Заглушка, если попадутся дробные значения от 3 до 4
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
    // Ступень 4 не строят
    if (i === 4) {
      continue;
    }
    
    // После ступени 10 строительство останавливается
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
// Главное меню и логика запуска
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