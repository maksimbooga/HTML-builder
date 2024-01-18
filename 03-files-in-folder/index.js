const fs = require('fs');
const path = require('path');

const folderPath = '03-files-in-folder/secret-folder';

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error('Ошибка при чтении содержимого папки:', err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file.name);

    fs.stat(filePath, (statErr, stats) => {
      if (statErr) {
        console.error(
          `Ошибка при получении информации о файле ${file.name}:`,
          statErr,
        );
        return;
      }

      if (stats.isFile()) {
        const fileSizeInKB = Math.round(stats.size / 1024);
        const fileExtension = path.extname(file.name).slice(1);
        console.log(
          `${path.basename(
            file.name,
            `.${fileExtension}`,
          )} - ${fileExtension} - ${fileSizeInKB}kb`,
        );
      }
    });
  });
});
