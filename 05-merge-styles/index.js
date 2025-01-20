const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  const stylesFolder = path.join(__dirname, 'styles');
  const outputFolder = path.join(__dirname, 'project-dist');
  const outputFile = path.join(__dirname, 'bundle.css');

  try {
    await fs.mkdir(outputFolder, { recursive: true });

    const files = await fs.readdir(stylesFolder, { withFileTypes: true });

    const styles = [];
    for (const file of files) {
      const filePath = path.join(stylesFolder, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileContent = await fs.readFile(filePath, 'utf8');
        styles.push(fileContent);
      }
    }
    await fs.writeFile(outputFile, styles.join('\n'));
    console.log('congrats u didnt crush my prod :) styles merged to bundle');
  } catch (error) {
    console.error(error.message);
  }
}

mergeStyles();
