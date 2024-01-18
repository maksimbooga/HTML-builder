const fs = require('fs');
const readline = require('readline');
const path = require('path');

const outputDir = '02-write-file';
const filename = 'output.txt';
const filePath = path.join(outputDir, filename);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Привет! Введите текст для записи в файл:');

const writeToFile = (text) => {
  fs.appendFile(filePath, text + '\n', 'utf8', (err) => {
    if (err) {
      console.error('Ошибка при записи в файл:', err);
    } else {
      console.log('Текст успешно записан в файл.');
      rl.prompt();
    }
  });
};

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('До свидания!');
    rl.close();
  } else {
    writeToFile(input);
  }
});

rl.on('close', () => {
  console.log('Программа завершена.');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\nПрограмма завершена по сигналу Ctrl+C.');
  rl.close();
});
