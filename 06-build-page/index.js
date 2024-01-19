const fs = require('fs').promises;
const path = require('path');

async function copyDirectory(source, destination) {
  try {
    await fs.mkdir(destination, { recursive: true });

    const items = await fs.readdir(source);

    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destinationPath = path.join(destination, item);

      const stats = await fs.stat(sourcePath);

      if (stats.isDirectory()) {
        await copyDirectory(sourcePath, destinationPath);
      } else {
        const fileContent = await fs.readFile(sourcePath);
        await fs.writeFile(destinationPath, fileContent);
      }
    }

    console.log(`Directory ${source} successfully copied to ${destination}.`);
  } catch (error) {
    console.error(
      `Error copying directory from ${source} to ${destination}:`,
      error,
    );
  }
}

const buildHTMLPage = async () => {
  try {
    const projectDistPath = path.join(__dirname, 'project-dist');
    await fs.mkdir(projectDistPath, { recursive: true });

    const templatePath = path.join(__dirname, 'template.html');
    const template = await fs.readFile(templatePath, 'utf-8');

    const componentsPath = path.join(__dirname, 'components');
    const componentFiles = await fs.readdir(componentsPath);
    const components = {};

    for (const file of componentFiles) {
      const componentName = path.parse(file).name;
      const componentFilePath = path.join(componentsPath, file);
      const componentContent = await fs.readFile(componentFilePath, 'utf-8');
      components[componentName] = componentContent;
    }

    let modifiedTemplate = template;
    Object.keys(components).forEach((tag) => {
      const regex = new RegExp(`{{${tag}}}`, 'g');
      modifiedTemplate = modifiedTemplate.replace(regex, components[tag]);
    });

    const indexPath = path.join(__dirname, 'project-dist', 'index.html');
    await fs.writeFile(indexPath, modifiedTemplate, 'utf-8');
    console.log('index.html successfully created.');

    const stylesFolderPath = path.join(__dirname, 'styles');
    const outputFilePath = path.join(__dirname, 'project-dist', 'style.css');
    const files = await fs.readdir(stylesFolderPath);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const stylesArray = [];

    for (const cssFile of cssFiles) {
      const filePath = path.join(stylesFolderPath, cssFile);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      stylesArray.push(fileContent);
    }

    const combinedStyles = stylesArray.join('\n');
    await fs.writeFile(outputFilePath, combinedStyles, 'utf-8');
    console.log('style.css successfully created.');

    const copyFolderPath = path.join(__dirname, 'project-dist', 'assets');
    const assetsFolderPath = path.join(__dirname, 'assets');
    await copyDirectory(assetsFolderPath, copyFolderPath);
    console.log('Assets folder successfully copied.');

    console.log('Project build completed.');
  } catch (error) {
    console.error('Error building project:', error);
  }
};

// Run the main function
buildHTMLPage();
