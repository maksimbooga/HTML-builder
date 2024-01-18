const fs = require('fs');

const filePath = '01-read-file/text.txt';

const readStream = fs.createReadStream(filePath, 'utf8');

readStream.on('data', (chunk) => {
  process.stdout.write(chunk);
});

readStream.on('end', () => {
  console.log('\nЧтение файла завершено.');
});

readStream.on('error', (err) => {
  console.error('Ошибка при чтении файла:', err);
});
