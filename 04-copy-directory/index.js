const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  try {
    const copyFolderPath = path.join(__dirname, 'files-copy');

    await fs.mkdir(copyFolderPath, { recursive: true });

    const filesFolderPath = path.join(__dirname, 'files');
    const files = await fs.readdir(filesFolderPath);

    for (const file of files) {
      const sourcePath = path.join(filesFolderPath, file);
      const destinationPath = path.join(copyFolderPath, file);

      const fileContent = await fs.readFile(sourcePath);
      await fs.writeFile(destinationPath, fileContent);
    }

    console.log('Directory copied successfully.');
  } catch (err) {
    console.error('Error copying directory:', err);
  }
}

// Run the function
copyDir();
