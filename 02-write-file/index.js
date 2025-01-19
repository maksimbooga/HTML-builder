const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writableStream = fs.createWriteStream(filePath, { flags: 'a' });

const readLineInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log(
  'yo, write somethin here and go away, btw to go your way press ctrl + c or type exit',
);

function farewell() {
  console.log('\n' + 'bye, dont use this writer again <3');

  writableStream.end();
}

readLineInterface.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    readLineInterface.close();
  } else {
    writableStream.write(input + '\n');
  }
});

readLineInterface.on('close', () => {
  farewell();
  process.exit(0);
});
