const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

function buildCSSBundle() {
  try {
    const files = fs.readdirSync(stylesFolderPath);

    const cssFiles = files.filter((file) => path.extname(file) === '.css');

    const stylesArray = [];

    cssFiles.forEach((cssFile) => {
      const filePath = path.join(stylesFolderPath, cssFile);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      stylesArray.push(fileContent);
    });

    const combinedStyles = stylesArray.join('\n');

    fs.writeFileSync(outputFilePath, combinedStyles, 'utf-8');

    console.log('CSS bundle был создан.');
  } catch (error) {
    console.error('Ошибка создания CSS bundle:', error);
  }
}

buildCSSBundle();
