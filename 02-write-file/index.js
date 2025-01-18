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
  process.stdout.write('bye, dont use this writer again <3\n');
  readLineInterface.close();
  writableStream.end();
  process.exit();
}

readLineInterface.on('line', (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    farewell();
  } else {
    writableStream.write(input + '\n');
  }
});

process.on('SIGINT', farewell);
