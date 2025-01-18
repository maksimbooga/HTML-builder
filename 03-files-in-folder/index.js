const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFilesInformation(dirPath) {
  try {
    const dirents = await fs.readdir(dirPath, { withFileTypes: true });

    for (const dirent of dirents) {
      const fullPath = path.join(dirPath, dirent.name);

      if (dirent.isFile()) {
        const stats = await fs.stat(fullPath);

        const fileName = path.basename(fullPath, path.extname(dirent.name));
        const fileExtension = path.extname(dirent.name).slice(1);
        const fileSize = stats.size;

        console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
      } else if (dirent.isDirectory() && !dirent.name.includes('.')) {
        await displayFilesInformation(fullPath);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

displayFilesInformation(folderPath);
