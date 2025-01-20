const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');

const outputHTML = path.join(projectDist, 'index.html');
const outputCSS = path.join(projectDist, 'style.css');
const outputAssets = path.join(projectDist, 'assets');

async function ensureDir(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function copyDirectory(src, dest) {
  await ensureDir(dest);
  const items = await fs.readdir(src, { withFileTypes: true });
  for (const item of items) {
    const srcPath = path.join(src, item.name);
    const destPath = path.join(dest, item.name);

    if (item.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function generateHTML() {
  try {
    let templateContent = await fs.readFile(templateFile, 'utf8');
    const templateTags = templateContent.match(/{{\s*[\w-]+\s*}}/g);

    if (templateTags) {
      for (const tag of templateTags) {
        const tagName = tag.replace(/{{\s*|\s*}}/g, '');
        const componentPath = path.join(componentsFolder, `${tagName}.html`);

        try {
          const componentContent = await fs.readFile(componentPath, 'utf8');
          templateContent = templateContent.replace(
            new RegExp(tag, 'g'),
            componentContent,
          );
        } catch {
          console.warn(`component file for tag "${tag}" not found. skip`);
        }
      }
    }

    await fs.writeFile(outputHTML, templateContent, 'utf8');
    console.log('HTML generated successfully.');
  } catch (error) {
    console.error('error generating HTML:', error.message);
  }
}

async function mergeStyles() {
  try {
    const styleFiles = await fs.readdir(stylesFolder, { withFileTypes: true });
    const cssContents = [];

    for (const file of styleFiles) {
      const filePath = path.join(stylesFolder, file.name);

      if (file.isFile() && path.extname(file.name) === '.css') {
        const content = await fs.readFile(filePath, 'utf8');
        cssContents.push(content);
      }
    }

    await fs.writeFile(outputCSS, cssContents.join('\n'), 'utf8');
    console.log('styles merged successfully.');
  } catch (error) {
    console.error('error merging styles:', error.message);
  }
}

async function copyAssets() {
  try {
    await copyDirectory(assetsFolder, outputAssets);
    console.log('assets copied successfully.');
  } catch (error) {
    console.error('error copying assets:', error.message);
  }
}

async function buildProject() {
  try {
    await ensureDir(projectDist);
    await generateHTML();
    await mergeStyles();
    await copyAssets();
    console.log('project built successfully.');
  } catch (error) {
    console.error('error building project:', error.message);
  }
}

buildProject();
