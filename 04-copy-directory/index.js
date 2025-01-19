const fs = require('fs/promises');
const path = require('path');

async function copyDirectory(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });

    const destContents = await fs.readdir(dest);
    for (const item of destContents) {
      const destPath = path.join(dest, item);
      await fs.rm(destPath, { recursive: true, force: true });
    }

    const srcContents = await fs.readdir(src, { withFileTypes: true });
    for (const item of srcContents) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isDirectory()) {
        await copyDirectory(srcPath, destPath);
      } else if (item.isFile()) {
        await fs.copyFile(srcPath, destPath);
      }
    }
    console.log(`Directory copied from ${src} to ${dest}`);
  } catch (error) {
    console.error(error);
  }
}

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

copyDirectory(srcFolder, destFolder);
